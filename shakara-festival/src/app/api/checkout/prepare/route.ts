import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/sanity'
import { randomUUID } from 'crypto'
import type { SanityClient } from '@sanity/client'
import { checkoutPreparePayloadSchema } from '@/lib/validation/checkout'

type PrepareLine = { sku: string; quantity: number; selectedDate?: string; selectedDates?: string[] }

type TicketDoc = {
  _id: string
  _rev: string
  name: string
  sku: string
  price: number
  testPrice?: number
  currency: string
  available: boolean
  soldOut?: boolean
  // new fields for per-day + bundles
  day?: string
  isBundle?: boolean
  bundle?: {
    dayCount?: number
    targetSku?: string
  }
  type?: string
  inventory?: number
  sold?: number
  reserved?: number
  allowOversell?: boolean
  live?: boolean
}

function generateTxRef() {
  return `shakara-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

const normalizeSelectedDates = (value?: string[] | string): string[] => {
  if (!value) return []
  const array = Array.isArray(value) ? value : String(value)
    .split(',')
    .map((date) => date.trim())
  const unique = Array.from(new Set(array.filter(Boolean)))
  unique.sort()
  return unique
}

const EXPIRE_BATCH_LIMIT = 20

type StaleReservation = {
  _id: string
  lines?: Array<{ sku?: string; units?: number; quantity?: number }>
}

async function expireStaleReservations(writer: SanityClient, nowIso: string) {
  try {
    const staleReservations = await writer.fetch<StaleReservation[]>(
      `*[_type == "reservation" && status == "held" && holdApplied == true && defined(expiresAt) && expiresAt < $now][0...$limit]{ _id, lines[]{ sku, units, quantity } }`,
      { now: nowIso, limit: EXPIRE_BATCH_LIMIT }
    )

    for (const reservation of staleReservations || []) {
      const normalizedLines = (reservation.lines || []).map((line) => ({
        sku: String(line?.sku || ''),
        units: typeof line?.units === 'number' ? line.units : (typeof line?.quantity === 'number' ? line.quantity : 0),
      })).filter((line) => line.sku && line.units > 0)

      const skus = normalizedLines.map((line) => line.sku)
      const tickets = skus.length > 0
        ? await writer.fetch<Array<{ _id: string; _rev?: string; sku: string }>>(
            `*[_type == "ticket" && sku in $skus]{ _id, _rev, sku }`,
            { skus }
          )
        : []
      const ticketBySku = new Map(tickets.map((ticket) => [ticket.sku, ticket]))

      let tx = writer.transaction()
      for (const line of normalizedLines) {
        const ticketRef = ticketBySku.get(line.sku)
        if (ticketRef && ticketRef._id) {
          tx = tx.patch(ticketRef._id, (patch) => {
            let next = patch.setIfMissing({ reserved: 0 })
            if (ticketRef._rev) {
              next = next.ifRevisionId(ticketRef._rev)
            }
            return next.inc({ reserved: -line.units })
          })
        }
      }
      tx = tx.patch(reservation._id, (patch) => patch.set({ status: 'expired', holdApplied: false }))
      await tx.commit({ autoGenerateArrayKeys: true })
    }
  } catch (err) {
    console.error('Failed to expire stale reservations', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = checkoutPreparePayloadSchema.safeParse(body)
    if (!parsed.success) {
      const { fieldErrors } = parsed.error.flatten()
      return NextResponse.json(
        {
          error: 'Validation failed',
          fieldErrors,
        },
        { status: 400 }
      )
    }

    const { lines, customer } = parsed.data
    const parsedLines = lines as unknown as PrepareLine[]
    const { email, firstName, lastName, phone } = customer

    if (!Array.isArray(parsedLines) || parsedLines.length === 0) {
      return NextResponse.json({ error: 'No lines provided' }, { status: 400 })
    }

    if (!process.env.SANITY_WRITE_TOKEN || !writeClient) {
      return NextResponse.json({ error: 'Checkout holds require SANITY_WRITE_TOKEN on the server.' }, { status: 503 })
    }

    const skus = [...new Set(parsedLines.map(l => String(l.sku || '').trim()))]
    const ids = skus.map(s => `ticket.${s}`)

    const writer = writeClient
    const reader = writer || client

    await expireStaleReservations(writer, new Date().toISOString())

    // Primary lookup by sku field, with a resilient fallback by document _id
    let docs: TicketDoc[] = await reader.fetch(
      `*[_type == "ticket" && (sku in $skus || _id in $ids)]{
        _id,_rev,name,sku,price,testPrice,currency,available,soldOut,day,isBundle,bundle{dayCount,targetSku},type,inventory,sold,reserved,allowOversell,live
      }`,
      { skus, ids }
    )
    if (!Array.isArray(docs)) docs = []

    const skuToDoc = new Map(docs.map(d => [d.sku, d]))
    const idToDoc = new Map(docs.map(d => [d._id, d]))
    const dayTypeToDoc = new Map<string, TicketDoc>()

    for (const doc of docs) {
      if (doc.day && doc.type && !doc.isBundle) {
        dayTypeToDoc.set(`${doc.type}:${doc.day}`, doc)
      }
    }

    // Ensure bundle target tickets are loaded in memory
    const missingTargets = Array.from(new Set(
      (docs || []).reduce<string[]>((acc, d) => {
        if (!d.isBundle) return acc
        const target = d.bundle?.targetSku
        if (target && !skuToDoc.has(target)) {
          acc.push(String(target))
        }
        return acc
      }, [])
    ))
    if (missingTargets.length > 0) {
      const extra: TicketDoc[] = await reader.fetch(
        `*[_type == "ticket" && sku in $targets]{
          _id,_rev,name,sku,price,testPrice,currency,available,soldOut,day,isBundle,bundle{dayCount,targetSku},type,inventory,sold,reserved,allowOversell,live
        }`,
        { targets: missingTargets }
      )
      for (const e of extra || []) {
        skuToDoc.set(e.sku, e)
        idToDoc.set(e._id, e)
        if (e.day && e.type && !e.isBundle) {
          dayTypeToDoc.set(`${e.type}:${e.day}`, e)
        }
      }
    }

    let amount = 0
    const currency = 'NGN'
    type ResolvedLine = { _key: string; sku: string; quantity: number; units: number; unitPrice: number; name: string; selectedDate?: string }
    const resolvedLines: ResolvedLine[] = []
    const dateMetadata: Record<string, string[]> = {}
    const holdMap = new Map<string, { units: number; rev?: string }>()

    const addHoldUnits = (doc: TicketDoc | undefined, units: number) => {
      if (!doc || !doc._id) return
      const existing = holdMap.get(doc._id)
      holdMap.set(doc._id, {
        units: (existing?.units ?? 0) + units,
        rev: existing?.rev ?? doc._rev,
      })
    }

    const ensureBaseTicketForDate = async (type: string | undefined, date: string): Promise<TicketDoc | undefined> => {
      if (!type) return undefined
      const key = `${type}:${date}`
      if (dayTypeToDoc.has(key)) {
        return dayTypeToDoc.get(key)
      }

      const fetched: TicketDoc | null = await reader.fetch(
        `*[_type == "ticket" && type == $type && day == $day && (!defined(isBundle) || isBundle == false)][0]{
          _id,_rev,name,sku,price,testPrice,currency,available,soldOut,day,isBundle,bundle{dayCount,targetSku},type,inventory,sold,reserved,allowOversell,live
        }`,
        { type, day: date }
      )

      if (fetched) {
        skuToDoc.set(fetched.sku, fetched)
        idToDoc.set(fetched._id, fetched)
        if (fetched.day && fetched.type && !fetched.isBundle) {
          dayTypeToDoc.set(`${fetched.type}:${fetched.day}`, fetched)
        }
        return fetched
      }

      return undefined
    }

    for (const line of parsedLines) {
      const selectedDatesFromLine = normalizeSelectedDates(line.selectedDates ?? line.selectedDate)
      const doc = skuToDoc.get(line.sku) || idToDoc.get(`ticket.${line.sku}`)
      if (!doc) return NextResponse.json({ error: `Unknown SKU ${line.sku}` }, { status: 400 })
      if (!doc.available || doc.soldOut) return NextResponse.json({ error: `SKU not available ${line.sku}` }, { status: 400 })

      const qty = Math.max(1, line.quantity)
      const priceFor = (d: TicketDoc) => {
        if (d.live === false && typeof d.testPrice === 'number') {
          return d.testPrice
        }
        return d.price
      }

      if (doc.isBundle) {
        const bundleConfig = doc.bundle || {}
        const targetSku = bundleConfig.targetSku
        const target = targetSku ? skuToDoc.get(targetSku) : undefined
        if (target && (!target.available || target.soldOut)) {
          return NextResponse.json({ error: `Target ticket not available for ${line.sku}` }, { status: 400 })
        }

        const expectedDayCount = Math.max(2, bundleConfig.dayCount ?? (selectedDatesFromLine.length || 0))
        const selectedDates = selectedDatesFromLine

        if (selectedDates.length !== expectedDayCount) {
          return NextResponse.json({ error: `Bundle ${line.sku} requires selecting ${expectedDayCount} unique days` }, { status: 400 })
        }

        const typeForBundle = target?.type ?? doc.type
        if (!typeForBundle) {
          return NextResponse.json({ error: `Bundle ${line.sku} is missing a ticket type to resolve inventory` }, { status: 400 })
        }

        const baseDocs: TicketDoc[] = []

        for (const date of selectedDates) {
          let baseDoc: TicketDoc | undefined
          if (target?.day === date) {
            baseDoc = target
          } else {
            baseDoc = await ensureBaseTicketForDate(typeForBundle, date)
          }

          if (!baseDoc) {
            return NextResponse.json({ error: `No base ticket available for ${typeForBundle} on ${date}` }, { status: 400 })
          }

          const inv = baseDoc.inventory ?? Number.POSITIVE_INFINITY
          const sold = baseDoc.sold ?? 0
          const reserved = baseDoc.reserved ?? 0
          const availableUnits = inv - sold - reserved
          const unitsNeeded = qty
          if (!baseDoc.allowOversell && availableUnits < unitsNeeded) {
            return NextResponse.json({ error: `Insufficient inventory for ${baseDoc.sku} (${date})` }, { status: 409 })
          }

          baseDocs.push(baseDoc)
        }

        const bundlePrice = priceFor(doc)
        const perDayUnitPrice = bundlePrice / selectedDates.length
        amount += bundlePrice * qty

        baseDocs.forEach((base, index) => {
          const date = selectedDates[index]
          const lineKey = randomUUID()
          resolvedLines.push({
            _key: lineKey,
            sku: base.sku,
            quantity: qty,
            units: qty,
            unitPrice: perDayUnitPrice,
            name: doc.name,
            selectedDate: date,
          })
          if (date) {
            dateMetadata[`ticket_${resolvedLines.length - 1}`] = [date]
          }

          addHoldUnits(base, qty)
        })
      } else {
        const units = qty
      const inv = doc.inventory ?? Number.POSITIVE_INFINITY
      const sold = doc.sold ?? 0
      const reserved = doc.reserved ?? 0
      const availableUnits = inv - sold - reserved
      if (!doc.allowOversell && availableUnits < units) {
        return NextResponse.json({ error: `Insufficient inventory for ${line.sku}` }, { status: 409 })
      }

        const unitPrice = priceFor(doc)
        amount += unitPrice * qty
        let selectedDates = selectedDatesFromLine
        if (doc.day) {
          selectedDates = [doc.day]
        }
        const selectedDate = selectedDates[0]
        const lineKey = randomUUID()
        resolvedLines.push({ _key: lineKey, sku: doc.sku, quantity: qty, units, unitPrice, name: doc.name, selectedDate })
        if (selectedDates.length > 0) {
          dateMetadata[`ticket_${resolvedLines.length - 1}`] = selectedDates
        }

        addHoldUnits(doc, units)
      }
    }

    const tx_ref = generateTxRef()

    const reservationDoc = {
      _type: 'reservation',
      tx_ref,
      lines: resolvedLines,
      amount,
      currency,
      email,
      firstName,
      lastName,
      phone,
      customer,
      status: 'held',
      holdApplied: true,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    }

    try {
      let tx = writer.transaction()
      for (const [docId, entry] of holdMap.entries()) {
        tx = tx.patch(docId, p => {
          let patch = p.setIfMissing({ reserved: 0 })
          if (entry.rev) {
            patch = patch.ifRevisionId(entry.rev)
          }
          return patch.inc({ reserved: entry.units })
        })
      }
      tx = tx.create(reservationDoc)
      await tx.commit({ autoGenerateArrayKeys: true })
    } catch (err) {
      console.error('Reservation hold transaction failed', err)
      const message = err instanceof Error ? err.message : 'unknown'
      return NextResponse.json({ error: `Unable to reserve tickets: ${message}` }, { status: 409 })
    }

    return NextResponse.json({ tx_ref, amount, currency, lines: resolvedLines, dateMetadata })
  } catch (e: unknown) {
    console.error('Prepare error', e)
    const message =
      typeof e === 'object' && e !== null && 'message' in e
        ? String((e as { message?: unknown }).message)
        : 'unknown'
    return NextResponse.json({ error: `Prepare failed: ${message}` }, { status: 500 })
  }
}


