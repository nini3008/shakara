import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import TicketsSection from '@/components/sections/TicketsSection'

export default function TicketsPage() {
  return (
    <V2Layout currentPageName="Tickets">
      <ThemedContent transparent>
        <TicketsSection />
      </ThemedContent>
    </V2Layout>
  )
}


