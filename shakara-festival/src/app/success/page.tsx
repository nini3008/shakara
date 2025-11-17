'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import { motion } from 'framer-motion'
import { CheckCircle2, Home, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { trackPurchase } from '@/lib/analytics'
import type { OrderGuestIntegration } from '@/types'

type OrderLookupResponse = {
  tx_ref: string
  amount: number | null
  currency: string
  guestIntegration: OrderGuestIntegration | null
}


function SuccessContent() {
  const searchParams = useSearchParams()
  const txRef = searchParams.get('tx_ref')
  const [email, setEmail] = useState('')
  const [guestIntegration, setGuestIntegration] = useState<OrderGuestIntegration | null>(null)
  const [integrationLoading, setIntegrationLoading] = useState(false)
  const [integrationError, setIntegrationError] = useState<string | null>(null)

  useEffect(() => {
    // You could fetch order details here using tx_ref
    // For now, we'll just show a generic success message
    const savedEmail = localStorage.getItem('checkout-email')
    if (savedEmail) {
      setEmail(savedEmail)
      localStorage.removeItem('checkout-email')
    }
  }, [txRef])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('checkout-purchase')
      if (!raw) return
      const parsed = JSON.parse(raw) as {
        transactionId?: string
        currency?: string
        value?: number
        tax?: number
        items?: Array<{
          item_id?: string
          item_name?: string
          price?: number
          quantity?: number
          item_category?: string
          item_variant?: string
        }>
      }

      const items = Array.isArray(parsed?.items)
        ? parsed.items
            .map((item) => ({
              item_id: String(item?.item_id ?? ''),
              item_name: String(item?.item_name ?? ''),
              price: Number(item?.price ?? 0),
              quantity: Number(item?.quantity ?? 1),
              item_category: item?.item_category ? String(item.item_category) : undefined,
              item_variant: item?.item_variant ? String(item.item_variant) : undefined,
            }))
            .filter((item) => item.item_id && item.item_name)
        : []

      const transactionId = parsed?.transactionId || txRef || ''

      if (items.length > 0 && transactionId) {
        trackPurchase({
          transaction_id: transactionId,
          currency: parsed?.currency || 'NGN',
          value: typeof parsed?.value === 'number' ? parsed.value : undefined,
          tax: typeof parsed?.tax === 'number' ? parsed.tax : undefined,
          items,
        })
      }
    } catch (err) {
      console.error('Failed to push purchase event', err)
    } finally {
      try {
        localStorage.removeItem('checkout-purchase')
      } catch {}
    }
  }, [txRef])

  useEffect(() => {
    if (!txRef) return
    const txRefValue: string = txRef
    const controller = new AbortController()

    async function loadGuestIntegration() {
      setIntegrationLoading(true)
      setIntegrationError(null)
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(txRefValue)}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          if (controller.signal.aborted) return
          const message =
            (payload && (payload.error || payload.message)) ||
            (response.status === 404
              ? 'We could not find your ticket details yet. Please check back shortly.'
              : 'Unable to load your ticket details right now. Please try again in a moment.')
          if (response.status >= 500) {
            console.error('Order lookup failed', response.status, payload)
          }
          setGuestIntegration(null)
          setIntegrationError(message)
          return
        }

        const data: OrderLookupResponse = await response.json()
        if (controller.signal.aborted) return
        setGuestIntegration(data?.guestIntegration ?? null)
      } catch (err) {
        if (controller.signal.aborted) return
        console.error('Failed to fetch guest integration', err)
        setGuestIntegration(null)
        setIntegrationError('Failed to load your ticket details. Please refresh the page shortly.')
      } finally {
        if (!controller.signal.aborted) {
          setIntegrationLoading(false)
        }
      }
    }

    loadGuestIntegration()
    return () => controller.abort()
  }, [txRef])

  const guestIntegrationStatus = guestIntegration?.status
  const isIntegrationSuccess = guestIntegrationStatus === 'success'
  const isIntegrationError = guestIntegrationStatus === 'error'
  const formattedAmountPaid = guestIntegration?.amountPaid
    ? (() => {
        const value = Number.parseFloat(guestIntegration.amountPaid as string)
        if (Number.isNaN(value)) return guestIntegration.amountPaid
        return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      })()
    : null

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

          <div className="max-w-md mx-auto mb-10">
            {integrationLoading && (
              <div className="rounded-xl border border-gray-800/60 bg-gray-900/40 px-4 py-5 text-gray-300">
                Fetching your QR code…
              </div>
            )}

            {!integrationLoading && integrationError && (
              <div className="rounded-xl border border-yellow-700/60 bg-yellow-900/20 px-4 py-5 text-sm text-yellow-200">
                {integrationError}
              </div>
            )}

            {!integrationLoading && isIntegrationSuccess && guestIntegration && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-6 shadow-lg">
                <p className="text-sm uppercase tracking-widest text-emerald-200 mb-4">Your Festival Access</p>
                {guestIntegration.qrCodeUrl && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={guestIntegration.qrCodeUrl}
                      alt="Your festival QR code"
                      className="h-48 w-48 rounded-lg border border-emerald-400/40 bg-white p-2"
                    />
                  </div>
                )}
                {guestIntegration.uniqueCode && (
                  <p className="text-gray-100">
                    Present code{' '}
                    <code className="bg-black/60 px-2 py-1 rounded text-lg tracking-[0.2em]">
                      {guestIntegration.uniqueCode}
                    </code>{' '}
                    at the gate.
                  </p>
                )}
                {formattedAmountPaid && (
                  <p className="mt-2 text-sm text-emerald-200/80">
                    Amount confirmed: ₦{formattedAmountPaid}
                  </p>
                )}
              </div>
            )}

            {!integrationLoading && isIntegrationError && guestIntegration?.message && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-5 text-sm text-red-200">
                We&apos;re finalizing your QR code. {guestIntegration.message}
              </div>
            )}
          </div>

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
