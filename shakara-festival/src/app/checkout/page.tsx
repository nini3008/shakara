import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import CheckoutForm from '@/components/v2/checkout/CheckoutForm'
import { CHECKOUT_ENABLED } from '@/lib/featureFlags'
import { notFound } from 'next/navigation'
import AddonsCarousel from '@/components/v2/checkout/AddonsCarousel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  if (!CHECKOUT_ENABLED) {
    // Hide page entirely when flag is off
    notFound()
  }
  return (
    <V2Layout currentPageName="Checkout">
      <ThemedContent transparent>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <h2 className="text-center font-bold mb-6" style={{
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, rgb(217, 119, 6) 0%, rgb(255, 215, 0) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Checkout</h2>
        </div>
        <CheckoutForm />
        {/* Add-ons carousel positioned after the checkout for better focus */}
        <AddonsCarousel />
      </ThemedContent>
    </V2Layout>
  )
}


