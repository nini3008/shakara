import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import PageHeader from '@/components/v2/PageHeader'
import CheckoutForm from '@/components/v2/checkout/CheckoutForm'

export default function CheckoutPage() {
  return (
    <V2Layout currentPageName="Checkout">
      <ThemedContent transparent>
        <CheckoutForm />
      </ThemedContent>
    </V2Layout>
  )
}


