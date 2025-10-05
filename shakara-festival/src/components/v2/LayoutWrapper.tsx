import V2Layout from './Layout'
import { client, FOOTER_SECTION_QUERY } from '@/lib/sanity'

type FooterData = {
  brandSection?: { tagline?: string; location?: string }
  quickLinks?: { label?: string; href?: string }[]
  socialLinks?: Record<string, string>
  copyright?: string
}

async function getFooterData(): Promise<FooterData | null> {
  try {
    const data = await client.fetch(FOOTER_SECTION_QUERY, {}, { cache: 'no-store', next: { revalidate: 60 } })
    return data
  } catch (error) {
    console.error('Error fetching footer data:', error)
    return null
  }
}

export default async function LayoutWrapper({ children, currentPageName }: { children: React.ReactNode; currentPageName?: string }) {
  const footerData = await getFooterData()

  return (
    <V2Layout footerData={footerData} currentPageName={currentPageName}>
      {children}
    </V2Layout>
  )
}
