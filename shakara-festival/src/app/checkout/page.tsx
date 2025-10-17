import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import CheckoutForm from '@/components/v2/checkout/CheckoutForm'
import { CHECKOUT_ENABLED } from '@/lib/featureFlags'
import { notFound } from 'next/navigation'

export default function CheckoutPage() {
  if (!CHECKOUT_ENABLED) {
    // Hide page entirely when flag is off
    notFound()
  }
  return (
    <V2Layout currentPageName="Checkout">
      <ThemedContent transparent>
        <CheckoutForm />
      </ThemedContent>
    </V2Layout>
  )
}


