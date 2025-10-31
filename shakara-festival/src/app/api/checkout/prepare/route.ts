import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/sanity'

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
  bundleSize?: number
  // new fields for per-day + bundles
  day?: string
  isBundle?: boolean
  unitsPerBundle?: number
  bundleTargetSku?: string
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

export async function POST(req: NextRequest) {
  try {
    const { lines, email }: { lines: PrepareLine[]; email?: string } = await req.json()
    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: 'No lines provided' }, { status: 400 })
    }

    const skus = [...new Set(lines.map(l => String(l.sku || '').trim()))]
    const ids = skus.map(s => `ticket.${s}`)

    const reader = writeClient || client

    // Primary lookup by sku field, with a resilient fallback by document _id
    let docs: TicketDoc[] = await reader.fetch(
      `*[_type == "ticket" && (sku in $skus || _id in $ids)]{
        _id,_rev,name,sku,price,testPrice,currency,available,soldOut,bundleSize,day,isBundle,unitsPerBundle,bundleTargetSku,type,inventory,sold,reserved,allowOversell,live
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
      (docs || [])
        .filter(d => d.isBundle && d.bundleTargetSku && !skuToDoc.has(d.bundleTargetSku))
        .map(d => String(d.bundleTargetSku))
    ))
    if (missingTargets.length > 0) {
      const extra: TicketDoc[] = await reader.fetch(
        `*[_type == "ticket" && sku in $targets]{
          _id,_rev,name,sku,price,testPrice,currency,available,soldOut,bundleSize,day,isBundle,unitsPerBundle,bundleTargetSku,type,inventory,sold,reserved,allowOversell,live
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
    type ResolvedLine = { sku: string; quantity: number; units: number; unitPrice: number; name: string; selectedDate?: string }
    const resolvedLines: ResolvedLine[] = []
    const dateMetadata: Record<string, string[]> = {}

    const ensureBaseTicketForDate = async (type: string | undefined, date: string): Promise<TicketDoc | undefined> => {
      if (!type) return undefined
      const key = `${type}:${date}`
      if (dayTypeToDoc.has(key)) {
        return dayTypeToDoc.get(key)
      }

      const fetched: TicketDoc | null = await reader.fetch(
        `*[_type == "ticket" && type == $type && day == $day && (!defined(isBundle) || isBundle == false)][0]{
          _id,_rev,name,sku,price,testPrice,currency,available,soldOut,bundleSize,day,isBundle,unitsPerBundle,bundleTargetSku,type,inventory,sold,reserved,allowOversell,live
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

    for (const line of lines) {
      const selectedDatesFromLine = normalizeSelectedDates(line.selectedDates ?? line.selectedDate)
      const doc = skuToDoc.get(line.sku) || idToDoc.get(`ticket.${line.sku}`)
      if (!doc) return NextResponse.json({ error: `Unknown SKU ${line.sku}` }, { status: 400 })
      if (!doc.available || doc.soldOut) return NextResponse.json({ error: `SKU not available ${line.sku}` }, { status: 400 })

      const qty = Math.max(1, line.quantity)
      const priceFor = (d: TicketDoc) => (d.live ?? true)
        ? (process.env.NODE_ENV === 'production' ? d.price : (d.testPrice ?? d.price))
        : (d.testPrice ?? d.price)

      if (doc.isBundle) {
        const targetSku = doc.bundleTargetSku
        const target = targetSku ? skuToDoc.get(targetSku) : undefined
        if (!target) return NextResponse.json({ error: `Bundle target unavailable for ${line.sku}` }, { status: 400 })
        if (!target.available || target.soldOut) return NextResponse.json({ error: `Target ticket not available for ${line.sku}` }, { status: 400 })

        const unitsPerBundle = Math.max(1, doc.unitsPerBundle ?? (selectedDatesFromLine.length || 1))
        const selectedDates = selectedDatesFromLine.length > 0
          ? selectedDatesFromLine
          : target.day
            ? [target.day]
            : []

        if (selectedDates.length !== unitsPerBundle) {
          return NextResponse.json({ error: `Bundle ${line.sku} requires selecting ${unitsPerBundle} unique ${unitsPerBundle === 1 ? 'day' : 'days'}` }, { status: 400 })
        }

        const typeForBundle = target.type ?? doc.type
        const baseDocs: TicketDoc[] = []

        for (const date of selectedDates) {
          let baseDoc: TicketDoc | undefined
          if (target.day === date) {
            baseDoc = target
          } else {
            baseDoc = await ensureBaseTicketForDate(typeForBundle, date)
          }

          if (!baseDoc) {
            return NextResponse.json({ error: `No base ticket available for ${typeForBundle ?? 'bundle'} on ${date}` }, { status: 400 })
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
          resolvedLines.push({
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
        })
      } else {
        const bundleSize = Math.max(1, doc.bundleSize ?? 1)
        const units = bundleSize * qty
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
        resolvedLines.push({ sku: doc.sku, quantity: qty, units, unitPrice, name: doc.name, selectedDate })
        if (selectedDates.length > 0) {
          dateMetadata[`ticket_${resolvedLines.length - 1}`] = selectedDates
        }
      }
    }

    const tx_ref = generateTxRef()

    // Create reservation document (no counter increments here; Sanity write tokens are not available on edge)
    // In a real production setup, move this to a server with a Sanity write token to atomically inc reserved using transactions.
    try {
      await reader.create({
        _type: 'reservation',
        tx_ref,
        lines: resolvedLines,
        amount,
        currency,
        email,
        status: 'held',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      })
    } catch (err) {
      // Log but do not fail checkout; reservation is optional in dev
      console.error('Reservation create failed', err)
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


