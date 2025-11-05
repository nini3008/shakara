import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import PartnersSection from '@/components/sections/PartnersSection'
import PaperSection from '@/components/v2/PaperSection'
import { createPageMetadata } from '@/lib/metadata-utils'

export const metadata = createPageMetadata({
  title: 'Partner With Shakara Festival | Lagos 2025',
  description: 'Partner with Shakara Festival 2025 to showcase your brand alongside Africa’s most electric music experience.',
  path: '/partnership',
})

export default function PartnershipPage() {
  return (
    <V2Layout currentPageName="Partnership">
      <ThemedContent transparent>
        <PaperSection>
          <PartnersSection />
        </PaperSection>
      </ThemedContent>
    </V2Layout>
  )
}


