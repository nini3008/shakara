'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: {
      public_key: string;
      tx_ref: string;
      amount: number | string;
      currency: string;
      payment_options: string;
      customer: { email: string; phone_number: string; name: string };
      customizations: { title: string; description: string; logo: string };
      meta: unknown;
      callback: (data: { transaction_id: number; tx_ref: string }) => void;
      onClose: () => void;
    }) => void
  }
}

// Load Flutterwave script
function loadFlutterwave(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.FlutterwaveCheckout) return resolve()
    const script = document.createElement('script')
    script.src = 'https://checkout.flutterwave.com/v3.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Flutterwave'))
    document.body.appendChild(script)
  })
}

// Generate transaction reference
function generateTxRef(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 15)
  return `shakara-${timestamp}-${random}`
}

export default function CheckoutForm() {
  const router = useRouter()
  const { items, total, clear, count } = useCart()
  
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load Flutterwave script on mount
  useEffect(() => {
    loadFlutterwave()
      .then(() => setScriptLoaded(true))
      .catch((err) => {
        console.error('Failed to load Flutterwave:', err)
        setPaymentError('Failed to load payment provider. Please refresh and try again.')
      })
  }, [])

  // Handle payment with Flutterwave Inline
  async function handlePayment() {
    if (!scriptLoaded || !window.FlutterwaveCheckout) {
      setPaymentError('Payment system not ready. Please try again.')
      return
    }

    if (total === 0) {
      setPaymentError('Your cart is empty.')
      return
    }

    setLoading(true)
    setPaymentError(null)

    const publicKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY
    if (!publicKey) {
      setPaymentError('Payment configuration error. Please contact support.')
      setLoading(false)
      return
    }

    try {
      // Guard against legacy curated-* items without SKUs
      const validItems = items.filter((i) => !i.id?.startsWith('curated-'))
      if (validItems.length === 0) {
        setPaymentError('Your cart contains items that are no longer valid. Please add tickets again from the Tickets page.')
        setLoading(false)
        return
      }

      // Ask the server to compute authoritative totals and create a reservation
      const prepareRes = await fetch('/api/checkout/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          lines: validItems.map((item) => ({ sku: item.id, quantity: item.quantity })),
        }),
      })
      if (!prepareRes.ok) {
        const err = await prepareRes.json().catch(() => ({}))
        setPaymentError(err.error || 'Could not prepare checkout')
        setLoading(false)
        return
      }
      const prepared = await prepareRes.json()

      // Build safe meta data (strings only) to avoid SDK sanitization errors
      type PreparedLine = { sku: string; name: string; unitPrice: number; quantity: number }
      const meta = {
        items: JSON.stringify((prepared?.lines || []).map((l: PreparedLine) => ({
          sku: String(l.sku),
          name: String(l.name),
          unitPrice: String(l.unitPrice),
          quantity: String(l.quantity),
        }))),
        totalItems: String(count),
        serverAmount: String(prepared.amount),
      }

      // Configure Flutterwave Inline with server-prepared values
      const config = {
        public_key: String(publicKey),
        tx_ref: String(prepared.tx_ref),
        amount: String(prepared.amount),
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: String(email || ''),
          phone_number: String(phone || ''),
          name: String(`${firstName} ${lastName}`.trim() || ''),
        },
        customizations: {
          title: 'Shakara Festival',
          description: String(`${validItems.map(item => `${item.name} x${item.quantity}`).join(', ')}`),
          logo: String(`${window.location.origin}/images/SHAKARAWhite.png`),
        },
        meta,
        callback: async function(data: { transaction_id: number; tx_ref: string }) {
          console.log('Payment callback:', data)
          
          // Verify the transaction on the server
          try {
            const response = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                transactionId: data.transaction_id,
                tx_ref: data.tx_ref,
                expectedCurrency: 'NGN',
              }),
            })
            
            const result = await response.json()
            
            if (result.ok) {
              // Save email for success page
              try { localStorage.setItem('checkout-email', email) } catch {}
              // Clear cart
              clear()
              // Force a full page navigation so the Flutterwave modal is torn down
              const successUrl = `/success?tx_ref=${encodeURIComponent(data.tx_ref)}`
              if (typeof window !== 'undefined') {
                window.location.assign(successUrl)
              } else {
                router.push(successUrl)
              }
            } else {
              setPaymentError('Payment verification failed. Please contact support.')
              setLoading(false)
            }
          } catch (error) {
            console.error('Verification error:', error)
            setPaymentError('An error occurred during payment verification.')
            setLoading(false)
          }
        },
        onClose: function() {
          console.log('Payment modal closed')
          setLoading(false)
        },
      }

      // Open Flutterwave checkout
      window.FlutterwaveCheckout(config)
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError('Failed to initiate payment. Please try again.')
      setLoading(false)
    }
  }

  if (count === 0) {
    return (
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          className="rounded-2xl border border-gray-800/40 text-white p-6 md:p-10 text-center shadow-2xl bg-gradient-to-br from-[#1a0f1f] via-[#0b0b0e] to-[#1f0d09]"
          >
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Add some tickets to your cart to continue with checkout.
            </p>
            <Button
              onClick={() => router.push('/tickets')}
              className="gradient-bg text-white"
            >
              Browse Tickets
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-gray-800/40 text-white p-6 md:p-10 shadow-2xl bg-gradient-to-br from-[#1a0f1f] via-[#0b0b0e] to-[#1f0d09]"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Items</span>
                  <span className="text-sm">{count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold gradient-text">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">First Name</label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Last Name</label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08012345678"
                    required
                  />
                </div>

                {paymentError && (
                  <div className="text-red-500 text-sm">{paymentError}</div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={loading || !email || !firstName || !lastName || !phone || !scriptLoaded}
                  className="w-full gradient-bg text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₦${total.toLocaleString()}`
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Secured by Flutterwave. Your payment information is encrypted.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}