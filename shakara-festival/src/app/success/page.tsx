'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import { motion } from 'framer-motion'
import { CheckCircle2, Home, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function SuccessContent() {
  const searchParams = useSearchParams()
  const txRef = searchParams.get('tx_ref')
  const [email, setEmail] = useState('')

  useEffect(() => {
    // You could fetch order details here using tx_ref
    // For now, we'll just show a generic success message
    const savedEmail = localStorage.getItem('checkout-email')
    if (savedEmail) {
      setEmail(savedEmail)
      localStorage.removeItem('checkout-email')
    }
  }, [txRef])

  return (
    <section className="min-h-[60vh] flex items-center justify-center py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mb-8 inline-flex"
        >
          <div className="relative">
            <div className="absolute inset-0 gradient-bg rounded-full blur-xl opacity-50" />
            <CheckCircle2 className="relative h-24 w-24 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-300 mb-2">
            Thank you for your purchase. Your tickets have been confirmed.
          </p>

          {txRef && (
            <p className="text-sm text-gray-400 mb-6">
              Transaction Reference: <code className="bg-gray-800 px-2 py-1 rounded">{txRef}</code>
            </p>
          )}

          {email && (
            <p className="text-gray-300 mb-8">
              A confirmation email will be sent to <strong>{email}</strong> shortly with your ticket details.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/tickets">
              <Button className="w-full sm:w-auto gradient-bg text-white">
                <Ticket className="mr-2 h-4 w-4" />
                Buy More Tickets
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function SuccessPage() {
  return (
    <V2Layout currentPageName="Payment Success">
      <ThemedContent transparent>
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-gray-300">Loading...</div>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </ThemedContent>
    </V2Layout>
  )
}
