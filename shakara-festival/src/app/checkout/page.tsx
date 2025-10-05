import LayoutWrapper from '@/components/v2/LayoutWrapper'
import ThemedContent from '@/components/ThemedContent'
import CheckoutForm from '@/components/v2/checkout/CheckoutForm'

export default function CheckoutPage() {
  return (
    <LayoutWrapper currentPageName="Checkout">
      <ThemedContent transparent>
        <CheckoutForm />
      </ThemedContent>
    </LayoutWrapper>
  )
}


