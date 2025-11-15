import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/sanity'

const ORDER_QUERY = `*[_type == "order" && tx_ref == $tx_ref][0]{
  tx_ref,
  amount,
  currency,
  guestIntegration
}`

export async function GET(_req: NextRequest, { params }: { params: Promise<{ tx_ref?: string }> }) {
  try {
    const resolvedParams = await params
    const tx_ref = resolvedParams?.tx_ref
    if (!tx_ref) {
      return NextResponse.json({ error: 'Missing tx_ref parameter' }, { status: 400 })
    }

    const reader = writeClient || client
    const order = await reader.fetch<{ tx_ref: string; amount?: number; currency?: string; guestIntegration?: unknown }>(
      ORDER_QUERY,
      { tx_ref }
    )

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      tx_ref: order.tx_ref,
      amount: order?.amount ?? null,
      currency: order?.currency ?? 'NGN',
      guestIntegration: order?.guestIntegration ?? null,
    })
  } catch (err) {
    console.error('Failed to load order guest integration', err)
    return NextResponse.json({ error: 'Unable to load order details' }, { status: 500 })
  }
}

