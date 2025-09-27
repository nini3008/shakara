import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function GET() {
  try {
    const query = `*[_type == "footerSection" && active == true]|order(order asc)[0]{
      brandSection{tagline, location},
      quickLinks[]{label, href},
      socialLinks,
      copyright
    }`
    const data = await client.fetch(query)
    return NextResponse.json(data || {})
  } catch (e) {
    return NextResponse.json({}, { status: 200 })
  }
}


