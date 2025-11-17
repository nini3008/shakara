'use client'

import React from 'react'
import { CHECKOUT_ENABLED } from '@/lib/featureFlags'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/Button'
import { Tag } from 'lucide-react'
import { formatDiscountValue } from '@/lib/discounts'
import { useRouter, usePathname } from 'next/navigation'

type CartDropdownProps = {
  open: boolean
  onClose?: () => void
}

export default function CartDropdown({ open, onClose }: CartDropdownProps) {
  const { items, total, removeItem, updateQty, discount, finalTotal } = useCart()
  const router = useRouter()
  const pathname = usePathname()

  const handleProceedToCheckout = () => {
    // If we're already on the checkout page, just close the dropdown
    if (pathname === '/checkout') {
      onClose?.()
      return
    }

    // Otherwise navigate to checkout and close the dropdown
    router.push('/checkout')
    onClose?.()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="fixed right-4 top-20 w-[calc(100vw-1rem)] max-w-md rounded-xl border border-gray-200/20 dark:border-gray-800/40 text-white shadow-2xl z-100 bg-linear-to-br from-[#1a0f1f] via-[#0b0b0e] to-[#1f0d09]"
        >
          <div className="p-4 max-h-96 overflow-auto">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Your basket is empty.</div>
            ) : (
              <div className="space-y-3">
                {items.map((it) => {
                  const formattedDates = (() => {
                    if (Array.isArray(it.selectedDates) && it.selectedDates.length > 0) {
                      return it.selectedDates
                        .map((d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
                        .join(', ')
                    }
                    if (typeof it.selectedDate === 'string' && it.selectedDate.length > 0) {
                      return it.selectedDate
                        .split(',')
                        .map((d) => d.trim())
                        .filter(Boolean)
                        .map((d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
                        .join(', ')
                    }
                    return null
                  })()

                  return (
                    <div key={it.uid || it.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm">{it.name}</div>
                      <div className="text-xs text-gray-500">
                        ₦{it.price.toLocaleString()} × {it.quantity}
                      </div>
                          {formattedDates && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {`Dates: ${formattedDates}`}
                            </div>
                          )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                          onChange={(e) => updateQty(it.uid || it.id, parseInt(e.target.value || '1', 10))}
                        className="w-14 h-8 rounded-md border border-input bg-transparent px-2 text-sm"
                      />
                          <button onClick={() => removeItem(it.uid || it.id)} className="text-xs text-red-500">Remove</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="border-t border-gray-200/60 dark:border-gray-800/60 p-4 space-y-2">
            {discount && (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Subtotal</div>
                  <div className="text-sm">₦{total.toLocaleString()}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-500 flex items-center gap-2">
                    <Tag className="h-3 w-3" />
                    {discount.label}
                  </div>
                  <div className="text-sm text-green-500">{formatDiscountValue(discount.valueApplied)}</div>
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Total</div>
              <div className="font-bold gradient-text">₦{finalTotal.toLocaleString()}</div>
            </div>
          </div>
          <div className="p-4 pt-0">
            {CHECKOUT_ENABLED ? (
              <>
                <Button
                  className="w-full gradient-bg text-white"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to checkout
                </Button>
                {discount && (
                  <p className="text-xs text-center text-green-500 mt-2">
                    Discount &ldquo;{discount.code}&rdquo; applied
                  </p>
                )}
              </>
            ) : (
              <Button disabled className="w-full opacity-60">Checkout Unavailable</Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


