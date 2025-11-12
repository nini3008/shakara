'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutCustomerSchema, type CheckoutCustomerInput, type CheckoutCustomer } from '@/lib/validation/checkout'
import { toAbsoluteUrl } from '@/lib/metadata-utils'
import { cn } from '@/lib/utils'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { trackBeginCheckout } from '@/lib/analytics'

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

type CheckoutFormInput = CheckoutCustomerInput
type CheckoutFormValues = CheckoutCustomer

export default function CheckoutForm() {
  const router = useRouter()
  const { items, total, clear, count } = useCart()

  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const form = useForm<CheckoutFormInput, undefined, CheckoutFormValues>({
    resolver: zodResolver(checkoutCustomerSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: undefined,
    },
  })

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
  const handlePayment = async (values: CheckoutFormValues) => {
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

      const ecommerceItems = validItems.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
        item_category: item.category,
        item_variant: item.selectedDates?.join('|') ?? item.selectedDate ?? undefined,
      }))
      const ecommerceValue = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      trackBeginCheckout({
        items: ecommerceItems,
        currency: 'NGN',
        value: ecommerceValue,
      })

      // Ask the server to compute authoritative totals and create a reservation
      const prepareRes = await fetch('/api/checkout/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: values,
          lines: validItems.map((item) => ({ 
            sku: item.id, 
            quantity: item.quantity,
            selectedDate: item.selectedDate,
            selectedDates: item.selectedDates
          })),
        }),
      })
      if (!prepareRes.ok) {
        const err = await prepareRes.json().catch(() => ({} as { error?: string }))
        const fieldErrors = (err as { fieldErrors?: Record<string, string[]> }).fieldErrors
        const firstFieldError = fieldErrors
          ? Object.values(fieldErrors).flat().find(Boolean)
          : undefined
        let message = firstFieldError || err?.error || 'Could not prepare checkout.'
        if (prepareRes.status === 409) {
          message = err?.error || 'Those tickets were just snapped up. Please adjust your selection and try again.'
        } else if (prepareRes.status === 503) {
          message = err?.error || 'Checkout is temporarily unavailable. Please try again in a few minutes.'
        }
        setPaymentError(message)
        setLoading(false)
        return
      }
      const prepared = await prepareRes.json()

      // Build safe meta data (strings only) to avoid SDK sanitization errors
      type PreparedLine = { sku: string; name: string; unitPrice: number; quantity: number }
      const dateMetaEntries = Object.entries(prepared?.dateMetadata || {}).reduce<Record<string, string>>((acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[key] = JSON.stringify(value)
        } else if (value !== undefined && value !== null) {
          acc[key] = String(value)
        }
        return acc
      }, {})

      const meta = {
        items: JSON.stringify((prepared?.lines || []).map((l: PreparedLine) => ({
          sku: String(l.sku),
          name: String(l.name),
          unitPrice: String(l.unitPrice),
          quantity: String(l.quantity),
        }))),
        totalItems: String(count),
        serverAmount: String(prepared.amount),
        customerEmail: values.email,
        customerFirstName: values.firstName,
        customerLastName: values.lastName,
        customerPhone: values.phone ?? '',
        ...dateMetaEntries
      }

      // Configure Flutterwave Inline with server-prepared values
      const customerName = `${values.firstName} ${values.lastName}`.trim()

      const config = {
        public_key: String(publicKey),
        tx_ref: String(prepared.tx_ref),
        amount: String(prepared.amount),
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: values.email ?? '',
          phone_number: values.phone ?? '',
          name: customerName || values.email,
        },
        customizations: {
          title: 'Shakara Festival',
          description: String(`${validItems.map(item => `${item.name} x${item.quantity}`).join(', ')}`),
          logo: toAbsoluteUrl('/images/flutterwave-shakara.png'),
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
            try {
              localStorage.setItem('checkout-email', values.email)
              const purchaseSnapshot = {
                transactionId: data?.tx_ref || prepared.tx_ref,
                currency: prepared?.currency || 'NGN',
                value: Number(prepared?.amount ?? ecommerceValue),
                tax: 0,
                items: ecommerceItems,
              }
              localStorage.setItem('checkout-purchase', JSON.stringify(purchaseSnapshot))
            } catch {}
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
              
              <form className="space-y-4" onSubmit={form.handleSubmit(handlePayment)} noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">First Name</label>
                    <Input
                      aria-invalid={form.formState.errors.firstName ? 'true' : 'false'}
                      placeholder="First Name"
                      {...form.register('firstName')}
                    />
                    {form.formState.errors.firstName && (
                      <p className="mt-1 text-xs text-red-500">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Last Name</label>
                    <Input
                      aria-invalid={form.formState.errors.lastName ? 'true' : 'false'}
                      placeholder="Last Name"
                      {...form.register('lastName')}
                    />
                    {form.formState.errors.lastName && (
                      <p className="mt-1 text-xs text-red-500">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <Input
                    type="email"
                    aria-invalid={form.formState.errors.email ? 'true' : 'false'}
                    placeholder="Email"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Phone Number</label>
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <PhoneInput
                        defaultCountry="ng"
                        aria-invalid={form.formState.errors.phone ? 'true' : 'false'}
                        placeholder="Phone Number"
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className={cn(
                          'phone-input-wrapper flex h-9 w-full items-stretch rounded-md border transition-[color,box-shadow] focus-within:ring-[3px]',
                          form.formState.errors.phone
                            ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/40'
                            : 'border-input focus-within:border-ring focus-within:ring-ring/50'
                        )}
                        countrySelectorStyleProps={{
                          className: 'phone-input-country-selector',
                          buttonStyle: {
                            background: 'transparent',
                            border: 'none',
                            borderRight: '1px solid rgba(148, 163, 184, 0.25)',
                            padding: '0 0.75rem',
                            color: 'inherit',
                          },
                          dropdownStyleProps: {
                            style: {
                              backgroundColor: '#0f172a',
                              color: '#f8fafc',
                            },
                          },
                        }}
                        inputStyle={{
                          backgroundColor: 'transparent',
                          color: 'inherit',
                          border: 'none',
                          flex: 1,
                          padding: '0.45rem 0.75rem 0.45rem 0.5rem',
                          fontSize: '0.875rem',
                        }}
                      />
                    )}
                  />
                  {form.formState.errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                {paymentError && (
                  <div className="text-red-500 text-sm">{paymentError}</div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !scriptLoaded || !form.formState.isValid || form.formState.isSubmitting}
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
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}