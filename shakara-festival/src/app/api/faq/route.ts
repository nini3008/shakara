import { NextResponse } from 'next/server'
import { client, FAQ_QUERY } from '@/lib/sanity'

export async function GET() {
  try {
    const faqs = await client.fetch(FAQ_QUERY)
    return NextResponse.json(faqs)
  } catch (error) {
    console.error('FAQ fetch error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
