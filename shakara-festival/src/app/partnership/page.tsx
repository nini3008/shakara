import LayoutWrapper from '@/components/v2/LayoutWrapper'
import ThemedContent from '@/components/ThemedContent'
import PartnersSection from '@/components/sections/PartnersSection'
import PaperSection from '@/components/v2/PaperSection'

export default function PartnershipPage() {
  return (
    <LayoutWrapper currentPageName="Partnership">
      <ThemedContent transparent>
        <PaperSection>
          <PartnersSection />
        </PaperSection>
      </ThemedContent>
    </LayoutWrapper>
  )
}


