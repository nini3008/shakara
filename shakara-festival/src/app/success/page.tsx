import LayoutWrapper from '@/components/v2/LayoutWrapper'
import ThemedContent from '@/components/ThemedContent'
import SuccessClient from './SuccessClient'

export const dynamic = 'force-dynamic'

export default function SuccessPage() {
  return (
    <LayoutWrapper currentPageName="Payment Success">
      <ThemedContent transparent>
        <SuccessClient />
      </ThemedContent>
    </LayoutWrapper>
  )
}
