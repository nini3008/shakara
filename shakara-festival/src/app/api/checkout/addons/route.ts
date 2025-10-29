import { NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/sanity'

export async function GET() {
  try {
    const reader = writeClient || client
    let addons = await reader.fetch(`*[_type=="ticket" && type=="addon" && (available==true || !defined(available))]|order(order asc){ _id, name, sku, description, price, badge }`)
    if (!Array.isArray(addons) || addons.length === 0) {
      // Fallback without availability guard, in case older docs miss the field
      addons = await reader.fetch(`*[_type=="ticket" && type=="addon"]|order(order asc){ _id, name, sku, description, price, badge }`)
    }
    return NextResponse.json({ addons: addons || [] })
  } catch {
    return NextResponse.json({ addons: [] })
  }
}


