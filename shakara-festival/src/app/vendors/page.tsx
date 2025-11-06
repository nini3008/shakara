import { Metadata } from 'next'
import V2Layout from '@/components/v2/Layout'
import VendorsContent from '@/components/sections/VendorsContent'
import { client, VENDORS_QUERY } from '@/lib/sanity'
import { SanityVendor, adaptSanityVendor } from '@/types/sanity-adapters'
import { createPageMetadata } from '@/lib/metadata-utils'

export const metadata: Metadata = createPageMetadata({
  title: 'Festival Vendors | Shakara Festival',
  description: 'Discover amazing food, fashion, art, and more from our curated vendors at Shakara Festival. Shop local and support African businesses.',
  path: '/vendors',
})

async function getVendors() {
  try {
    const sanityVendors: SanityVendor[] = await client.fetch(VENDORS_QUERY)
    const vendors = sanityVendors.map(adaptSanityVendor)
    return vendors
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return []
  }
}

export default async function VendorsPage() {
  const vendors = await getVendors()

  return (
    <V2Layout currentPageName="Vendors">
      <VendorsContent vendors={vendors} />
    </V2Layout>
  )
}
