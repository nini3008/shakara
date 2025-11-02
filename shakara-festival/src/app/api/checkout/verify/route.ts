import { NextRequest, NextResponse } from 'next/server'
import Flutterwave from 'flutterwave-node-v3'
import { writeClient } from '@/lib/sanity'

type ReservationLineDoc = {
  sku: string
  quantity?: number
  units?: number
  unitPrice?: number
  name?: string
  selectedDate?: string
}

type ReservationDoc = {
  [key: string]: unknown
  _id: string
  amount: number
  currency: string
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  lines?: ReservationLineDoc[]
  status?: string
  holdApplied?: boolean
}

type NormalizedLine = {
  sku: string
  quantity: number
  units: number
  unitPrice: number
  name: string
  selectedDate?: string
}

export async function POST(req: NextRequest) {
  try {
    const { transactionId, tx_ref, expectedCurrency } = await req.json()
    if (!transactionId) return NextResponse.json({ error: 'Missing transactionId' }, { status: 400 })

    const flw = new Flutterwave(
      process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
      process.env.FLW_SECRET_KEY!
    )

    const response = await flw.Transaction.verify({ id: transactionId })
    const data = response?.data

    // Look up reservation by tx_ref (server total)
    let ok = data?.status === 'successful' && (expectedCurrency ? data?.currency === expectedCurrency : true)
    let finalizeError: unknown = undefined
    try {
      const reservation = await writeClient.fetch<ReservationDoc | null>(
        `*[_type == "reservation" && tx_ref == $tx_ref][0]{ _id, amount, currency, email, firstName, lastName, phone, holdApplied, lines[] { sku, quantity, units, unitPrice, name, selectedDate }, status }`,
        { tx_ref }
      )
      if (!reservation) return NextResponse.json({ ok: false, reason: 'Reservation not found' }, { status: 404 })
      const reservationDoc = reservation as ReservationDoc
      ok = ok && Number(data?.amount) === Number(reservationDoc.amount)

      if (reservationDoc.status === 'confirmed') {
        return NextResponse.json({ ok: true, data })
      }

      if (ok) {
        // Finalize: move reserved -> sold; mark reservation confirmed; create order
        const reservationEmailRaw = (reservationDoc as { email?: string }).email
        const reservationFirstName = (reservationDoc as { firstName?: string }).firstName
        const reservationLastName = (reservationDoc as { lastName?: string }).lastName
        const reservationPhone = (reservationDoc as { phone?: string }).phone
        const gatewayCustomerMetadata = (data as { customer?: { email?: string; phone_number?: string; name?: string } } | undefined)?.customer
        const gatewayCustomerEmail = typeof gatewayCustomerMetadata?.email === 'string' && gatewayCustomerMetadata.email.length > 0
          ? gatewayCustomerMetadata.email
          : undefined
        const gatewayCustomerPhone = typeof gatewayCustomerMetadata?.phone_number === 'string' && gatewayCustomerMetadata.phone_number.length > 0
          ? gatewayCustomerMetadata.phone_number
          : undefined

        const customerEmail = typeof reservationEmailRaw === 'string' && reservationEmailRaw.length > 0
          ? reservationEmailRaw
          : (gatewayCustomerEmail ?? '')

        const customerFirstName = typeof reservationFirstName === 'string' ? reservationFirstName : undefined
        const customerLastName = typeof reservationLastName === 'string' ? reservationLastName : undefined
        const customerPhone = typeof reservationPhone === 'string' ? reservationPhone : undefined

        const normalizedLines: NormalizedLine[] = (reservationDoc.lines || []).map((line) => {
          const quantity = typeof line?.quantity === 'number' ? line.quantity : (typeof line?.units === 'number' ? line.units : 1)
          const units = typeof line?.units === 'number' ? line.units : quantity
          return {
            sku: String(line?.sku || ''),
            quantity,
            units,
            unitPrice: typeof line?.unitPrice === 'number' ? line.unitPrice : 0,
            name: typeof line?.name === 'string' ? line.name : '',
            selectedDate: line?.selectedDate,
          }
        })

        const releaseHold = reservationDoc.holdApplied === true

        const skus: string[] = normalizedLines.map((l) => l.sku)
        const tickets: Array<{ _id: string; _rev?: string; sku: string }> = await writeClient.fetch(
          `*[_type == "ticket" && sku in $skus]{ _id, _rev, sku }`,
          { skus }
        )
        const ticketBySku = new Map(tickets.map(t => [t.sku, t]))

        let tx = writeClient.transaction()
        for (const line of normalizedLines) {
          const ticketRef = ticketBySku.get(line.sku)
          if (ticketRef && ticketRef._id) {
            tx = tx.patch(ticketRef._id, p => {
              let patch = p.setIfMissing({ sold: 0, reserved: 0 })
              if (ticketRef._rev) {
                patch = patch.ifRevisionId(ticketRef._rev)
              }
              patch = patch.inc({ sold: line.units })
              if (releaseHold) {
                patch = patch.inc({ reserved: -line.units })
              }
              return patch
            })
          }
        }
        tx = tx
          .patch(reservationDoc._id, p => p.set({ status: 'confirmed', holdApplied: false }))
          .create({
            _type: 'order',
            tx_ref,
            amount: reservationDoc.amount,
            currency: reservationDoc.currency,
            lines: normalizedLines,
            email: customerEmail,
            firstName: customerFirstName,
            lastName: customerLastName,
            phone: customerPhone,
            status: 'paid',
            gateway: 'flutterwave',
            verification: {
              id: data?.id,
              tx_ref: data?.tx_ref,
              gateway_amount: typeof data?.amount === 'number' ? data?.amount : Number(data?.amount ?? 0),
            },
            createdAt: new Date().toISOString(),
          })
        await tx.commit({ autoGenerateArrayKeys: true })
      }
    } catch (err) {
      finalizeError = err
      console.error('Order finalization failed', err)
      ok = false
    }

    if (!ok) {
      return NextResponse.json({ ok: false, data, finalizeError: finalizeError ? String(finalizeError) : undefined }, { status: 400 })
    }

    // TODO: issue ticket / persist order (out of scope here)
    return NextResponse.json({ ok: true, data })
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}


