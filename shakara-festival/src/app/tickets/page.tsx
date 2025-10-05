import LayoutWrapper from '@/components/v2/LayoutWrapper'
import ThemedContent from '@/components/ThemedContent'
import TicketsSection from '@/components/sections/TicketsSection'

export default function TicketsPage() {
  return (
    <LayoutWrapper currentPageName="Tickets">
      <ThemedContent transparent>
        <TicketsSection />
      </ThemedContent>
    </LayoutWrapper>
  )
}


