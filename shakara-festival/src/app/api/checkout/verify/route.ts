import { NextRequest, NextResponse } from 'next/server'
import Flutterwave from 'flutterwave-node-v3'
import { writeClient } from '@/lib/sanity'

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
    try {
      const reservation = await writeClient.fetch(
        `*[_type == "reservation" && tx_ref == $tx_ref][0]{ _id, amount, currency, lines[] { sku, units, selectedDate }, status }`,
        { tx_ref }
      )
      if (!reservation) return NextResponse.json({ ok: false, reason: 'Reservation not found' }, { status: 404 })
      ok = ok && Number(data?.amount) === Number(reservation.amount)

      if (ok) {
        // Finalize: move reserved -> sold; mark reservation confirmed; create order
        type ReservationLine = { sku: string; units: number }
        const skus: string[] = (reservation.lines || []).map((l: ReservationLine) => l.sku)
        const tickets: Array<{ _id: string; sku: string }> = await writeClient.fetch(
          `*[_type == "ticket" && sku in $skus]{ _id, sku }`,
          { skus }
        )
        const idBySku = Object.fromEntries(tickets.map(t => [t.sku, t._id]))

        let tx = writeClient.transaction()
        for (const line of reservation.lines || []) {
          const ticketId = idBySku[line.sku]
          if (ticketId) {
            tx = tx.patch(ticketId, p => p.inc({ sold: line.units, reserved: -line.units }))
          }
        }
        tx = tx
          .patch(reservation._id, p => p.set({ status: 'confirmed' }))
          .create({
            _type: 'order',
            tx_ref,
            amount: reservation.amount,
            currency: reservation.currency,
            lines: reservation.lines,
            status: 'paid',
            gateway: 'flutterwave',
            verification: { id: data?.id, tx_ref: data?.tx_ref, gateway_amount: data?.amount },
            createdAt: new Date().toISOString(),
          })
        await tx.commit({ autoGenerateArrayKeys: true })
      }
    } catch {}

    if (!ok) {
      return NextResponse.json({ ok: false, data }, { status: 400 })
    }

    // TODO: issue ticket / persist order (out of scope here)
    return NextResponse.json({ ok: true, data })
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}


