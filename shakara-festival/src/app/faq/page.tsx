import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import PaperSection from '@/components/v2/PaperSection'
import FAQSection from '@/components/sections/FAQSection'
import { createPageMetadata } from '@/lib/metadata-utils'

export const metadata = createPageMetadata({
  title: 'Shakara Festival FAQ | Tickets, Entry, Safety & Info',
  description: 'Find answers to common questions about Shakara Festival tickets, schedule, and onsite experience.',
  path: '/faq',
})

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
