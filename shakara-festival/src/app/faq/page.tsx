import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import PaperSection from '@/components/v2/PaperSection'
import FAQSection from '@/components/sections/FAQSection'

export const metadata = {
  title: 'FAQ - Shakara Festival',
  description: 'Frequently asked questions about Shakara Festival',
}

export default function FAQPage() {
  return (
    <V2Layout currentPageName="FAQ">
      <ThemedContent transparent>
        <PaperSection>
          <FAQSection />
        </PaperSection>
      </ThemedContent>
    </V2Layout>
  )
}
