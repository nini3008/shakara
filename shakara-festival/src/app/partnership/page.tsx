import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import PartnersSection from '@/components/sections/PartnersSection'
import PaperSection from '@/components/v2/PaperSection'

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


