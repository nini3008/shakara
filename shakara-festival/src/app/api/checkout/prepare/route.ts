import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/sanity'

type PrepareLine = { sku: string; quantity: number }

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
  inventory?: number
  sold?: number
  reserved?: number
  allowOversell?: boolean
  live?: boolean
}

function generateTxRef() {
  return `shakara-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
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
        _id,_rev,name,sku,price,testPrice,currency,available,soldOut,bundleSize,inventory,sold,reserved,allowOversell,live
      }`,
      { skus, ids }
    )
    if (!Array.isArray(docs)) docs = []

    const skuToDoc = new Map(docs.map(d => [d.sku, d]))
    const idToDoc = new Map(docs.map(d => [d._id, d]))

    let amount = 0
    const currency = 'NGN'
    type ResolvedLine = { sku: string; quantity: number; units: number; unitPrice: number; name: string }
    const resolvedLines: ResolvedLine[] = []

    for (const line of lines) {
      const doc = skuToDoc.get(line.sku) || idToDoc.get(`ticket.${line.sku}`)
      if (!doc) return NextResponse.json({ error: `Unknown SKU ${line.sku}` }, { status: 400 })
      if (!doc.available || doc.soldOut) return NextResponse.json({ error: `SKU not available ${line.sku}` }, { status: 400 })

      const bundleSize = Math.max(1, doc.bundleSize ?? 1)
      const units = bundleSize * Math.max(1, line.quantity)
      const inv = doc.inventory ?? Number.POSITIVE_INFINITY
      const sold = doc.sold ?? 0
      const reserved = doc.reserved ?? 0
      const availableUnits = inv - sold - reserved
      if (!doc.allowOversell && availableUnits < units) {
        return NextResponse.json({ error: `Insufficient inventory for ${line.sku}` }, { status: 409 })
      }

      const unitPrice = (doc.live ?? true) ? (process.env.NODE_ENV === 'production' ? doc.price : (doc.testPrice ?? doc.price)) : (doc.testPrice ?? doc.price)
      amount += unitPrice * line.quantity
      resolvedLines.push({ sku: doc.sku, quantity: line.quantity, units, unitPrice, name: doc.name })
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

    return NextResponse.json({ tx_ref, amount, currency, lines: resolvedLines })
  } catch (e: unknown) {
    console.error('Prepare error', e)
    const message =
      typeof e === 'object' && e !== null && 'message' in e
        ? String((e as { message?: unknown }).message)
        : 'unknown'
    return NextResponse.json({ error: `Prepare failed: ${message}` }, { status: 500 })
  }
}


