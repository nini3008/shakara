import LayoutWrapper from '@/components/v2/LayoutWrapper'
import ThemedContent from '@/components/ThemedContent'
import PaperSection from '@/components/v2/PaperSection'
import FAQSection from '@/components/sections/FAQSection'

export const metadata = {
  title: 'FAQ - Shakara Festival',
  description: 'Frequently asked questions about Shakara Festival',
}

export default function FAQPage() {
  return (
    <LayoutWrapper currentPageName="FAQ">
      <ThemedContent transparent>
        <PaperSection>
          <FAQSection />
        </PaperSection>
      </ThemedContent>
    </LayoutWrapper>
  )
}
