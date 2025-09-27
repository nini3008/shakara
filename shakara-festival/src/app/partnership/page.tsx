import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import PartnersSection from '@/components/sections/PartnersSection'
import PaperSection from '@/components/v2/PaperSection'
import PageHeader from '@/components/v2/PageHeader'

export default function PartnershipPage() {
  return (
    <V2Layout currentPageName="Partnership">
      <ThemedContent transparent>
        <PageHeader title="Partnerships" description="Work with us to elevate the festival experience." />
        <PaperSection bgImage="/images/torn-paper-background.png">
          <PartnersSection />
        </PaperSection>
      </ThemedContent>
    </V2Layout>
  )
}


