import { NextRequest, NextResponse } from 'next/server'
import Flutterwave from 'flutterwave-node-v3'
import { writeClient } from '@/lib/sanity'
import type { ResolvedDiscount } from '@/types'

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

type TicketDocRef = {
  _id: string
  _rev?: string
  sku: string
  type?: string
  day?: string
  name?: string
}

type GuestIntegrationBase = {
  status: 'success' | 'error'
  syncedAt?: string
  raw?: string
}

type GuestIntegrationSuccess = GuestIntegrationBase & {
  status: 'success'
  externalId?: number
  uniqueCode?: string
  amountPaid?: string
  qrCodeId?: number
  qrCodeUrl?: string
  qrCodeCode?: string
}

type GuestIntegrationError = GuestIntegrationBase & {
  status: 'error'
  message: string
}

type GuestIntegrationResult = GuestIntegrationSuccess | GuestIntegrationError

const TICKET_TYPE_MAP: Record<string, string> = {
  general: 'general_admission',
  pit: 'pit_ticket',
  vip: 'vip_table',
  vvip: 'vvip_table',
}

function resolveTicketType(ticket?: TicketDocRef): string | undefined {
  if (!ticket?.type) return undefined
  return TICKET_TYPE_MAP[ticket.type] ?? 'general_admission'
}

function resolveAddonType(ticket?: TicketDocRef, fallbackName?: string): string | undefined {
  const name = (ticket?.name || fallbackName || '').toLowerCase()
  if (!name) return undefined
  if (name.includes('concierge')) return 'concierge_service'
  if (name.includes('fast') && name.includes('lane')) return 'fast_lane_priority'
  if (name.includes('panel') || name.includes('masterclass') || name.includes('speaker')) return 'speaker_series'
  return undefined
}

const toCurrencyString = (value: number): string => {
  if (!Number.isFinite(value)) return '0.00'
  return (Math.round(value * 100) / 100).toFixed(2)
}

async function syncGuestWithWristband({
  customer,
  lines,
  ticketsBySku,
  orderTxRef,
  orderAmount,
  writeClientInstance,
}: {
  customer: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
  lines: NormalizedLine[]
  ticketsBySku: Map<string, TicketDocRef>
  orderTxRef: string
  orderAmount: number
  writeClientInstance: typeof writeClient
}): Promise<GuestIntegrationResult | undefined> {
  if (!customer?.email) return undefined

  const ticketAggregates = new Map<
    string,
    { date?: string; ticket_type: string; quantity: number; price: string }
  >()
  const addonAggregates = new Map<
    string,
    { date?: string; addon_type: string; quantity: number; price: string }
  >()

  for (const line of lines) {
    const ticket = ticketsBySku.get(line.sku)
    const isAddon = ticket?.type === 'addon'
    const baseDate = line.selectedDate || ticket?.day
    const date = typeof baseDate === 'string' && baseDate.length > 0 ? baseDate : undefined
    if (!date) {
      console.warn('Skipping line without selected date for guest sync', line)
      continue
    }
    const price = toCurrencyString(line.unitPrice ?? 0)

    if (!isAddon) {
      const ticket_type = resolveTicketType(ticket) ?? 'general_admission'
      const key = `${ticket_type}|${date}`
      const existing = ticketAggregates.get(key)
      if (existing) {
        existing.quantity += line.units
      } else {
        ticketAggregates.set(key, { date, ticket_type, quantity: line.units, price })
      }
      continue
    }

    const addon_type = resolveAddonType(ticket, line.name)
    if (!addon_type) continue
    const key = `${addon_type}|${date}`
    const existing = addonAggregates.get(key)
    if (existing) {
      existing.quantity += line.units
    } else {
      addonAggregates.set(key, { date, addon_type, quantity: line.units, price })
    }
  }

  if (ticketAggregates.size === 0) return undefined

  const payload = {
    first_name: customer.firstName || 'Guest',
    last_name: customer.lastName || '',
    email: customer.email,
    phone: customer.phone || '',
    tickets: Array.from(ticketAggregates.values()).map((item) => ({
      date: item.date,
      ticket_type: item.ticket_type,
      quantity: item.quantity,
      price: item.price,
    })),
    addons: Array.from(addonAggregates.values()).map((item) => ({
      date: item.date,
      addon_type: item.addon_type,
      quantity: item.quantity,
      price: item.price,
    })),
  }

  const syncedAt = new Date().toISOString()
  let integration: GuestIntegrationResult
  try {
    const response = await fetch('https://shakarafestival.wristbandsng.com/create/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await response.json().catch(() => undefined)
    if (response.ok && json) {
      let qrCodeUrl: string | undefined =
        json?.qr_code?.qr_code_url ?? json?.qr_code?.qr_code ?? (typeof json?.qr_code === 'string' ? json.qr_code : undefined)
      const qrCodeCode: string | undefined = json?.qr_code?.code
      if (!qrCodeUrl && json?.unique_code) {
        try {
          const qrResponse = await fetch(`https://shakarafestival.wristbandsng.com/qr/${encodeURIComponent(String(json.unique_code))}/`)
          if (qrResponse.ok) {
            const qrJson = await qrResponse.json().catch(() => undefined)
            qrCodeUrl =
              qrJson?.qr_code ??
              qrJson?.qr_code_url ??
              (typeof qrJson === 'string' ? qrJson : qrCodeUrl)
            if (!qrCodeUrl && qrJson && typeof qrJson === 'object') {
              const maybeUrl =
                (qrJson as { qr_code?: string; qr_code_url?: string }).qr_code ||
                (qrJson as { qr_code?: string; qr_code_url?: string }).qr_code_url
              if (typeof maybeUrl === 'string') {
                qrCodeUrl = maybeUrl
              }
            }
            if (!json.qr_code && qrCodeUrl) {
              json.qr_code = { qr_code_url: qrCodeUrl }
            }
          } else {
            console.warn('Guest QR lookup failed', qrResponse.status)
          }
        } catch (qrErr) {
          console.error('Guest QR fetch error', qrErr)
        }
      }

      integration = {
        status: 'success',
        externalId: json?.id,
        uniqueCode: json?.unique_code,
        amountPaid: json?.amount_paid ?? toCurrencyString(orderAmount ?? 0),
        qrCodeId: json?.qr_code?.id,
        qrCodeCode: qrCodeCode,
        qrCodeUrl,
        raw: JSON.stringify(json),
        syncedAt,
      }
    } else {
      integration = {
        status: 'error',
        message:
          (json && (json.error || json.message)) ||
          `Guest creation failed (${response.status})`,
        raw: json ? JSON.stringify(json) : undefined,
        syncedAt,
      }
    }
  } catch (err) {
    integration = {
      status: 'error',
      message: err instanceof Error ? err.message : 'Guest creation failed',
      raw:
        err instanceof Error
          ? JSON.stringify({ name: err.name, message: err.message, stack: err.stack })
          : undefined,
      syncedAt,
    }
  }

  try {
    const orderDoc = await writeClientInstance.fetch<{ _id: string; guestIntegration?: GuestIntegrationResult }>(
      `*[_type == "order" && tx_ref == $tx_ref][0]{ _id, guestIntegration }`,
      { tx_ref: orderTxRef }
    )
    if (orderDoc?._id) {
      // Avoid overwriting an existing successful sync
      if (orderDoc.guestIntegration?.status === 'success') {
        return orderDoc.guestIntegration
      }
      await writeClientInstance
        .patch(orderDoc._id)
        .set({ guestIntegration: integration })
        .commit({ autoGenerateArrayKeys: true })
    }
  } catch (err) {
    console.error('Failed to persist guest integration metadata', err)
  }

  return integration
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
        `*[_type == "reservation" && tx_ref == $tx_ref][0]{ _id, amount, currency, email, firstName, lastName, phone, holdApplied, lines[] { sku, quantity, units, unitPrice, name, selectedDate }, status, discount }`,
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
        const tickets: TicketDocRef[] = await writeClient.fetch(
          `*[_type == "ticket" && sku in $skus]{ _id, _rev, sku, type, day, name }`,
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
            ...((reservationDoc as any).discount && { discount: (reservationDoc as any).discount }),
          })
        await tx.commit({ autoGenerateArrayKeys: true })

        // Increment discount usage count if applicable
        if ((reservationDoc as any).discount?.code) {
          try {
            const discountDoc = await writeClient.fetch<{ _id: string }>(
              `*[_type == "discountCode" && code == $code][0]{ _id }`,
              { code: (reservationDoc as any).discount.code }
            )
            if (discountDoc?._id) {
              await writeClient
                .patch(discountDoc._id)
                .setIfMissing({ usageCount: 0 })
                .inc({ usageCount: 1 })
                .commit({ autoGenerateArrayKeys: true })
            }
          } catch (err) {
            console.error('Failed to update discount usage count', err)
          }
        }

        try {
          await syncGuestWithWristband({
            customer: {
              firstName: customerFirstName,
              lastName: customerLastName,
              email: customerEmail,
              phone: customerPhone,
            },
            lines: normalizedLines,
            ticketsBySku: ticketBySku,
            orderTxRef: tx_ref,
            orderAmount: reservationDoc.amount,
            writeClientInstance: writeClient,
          })
        } catch (err) {
          console.error('Guest sync failed', err)
        }
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


