'use client'

import React from 'react'
import Link from 'next/link'
import { CHECKOUT_ENABLED } from '@/lib/featureFlags'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/Button'

export default function CartDropdown({ open }: { open: boolean }) {
  const { items, total, removeItem, updateQty } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="fixed right-4 top-20 w-[calc(100vw-1rem)] max-w-md rounded-xl border border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/70 backdrop-blur-md shadow-xl z-[100]"
        >
          <div className="p-4 max-h-96 overflow-auto">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Your basket is empty.</div>
            ) : (
              <div className="space-y-3">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm">{it.name}</div>
                      <div className="text-xs text-gray-500">₦{it.price.toLocaleString()} × </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => updateQty(it.id, parseInt(e.target.value || '1', 10))}
                        className="w-14 h-8 rounded-md border border-input bg-transparent px-2 text-sm"
                      />
                      <button onClick={() => removeItem(it.id)} className="text-xs text-red-500">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-gray-200/60 dark:border-gray-800/60 p-4 flex items-center justify-between">
            <div className="text-sm">Total</div>
            <div className="font-bold">₦{total.toLocaleString()}</div>
          </div>
          <div className="p-4 pt-0">
            {CHECKOUT_ENABLED ? (
              <Link href="/checkout">
                <Button className="w-full gradient-bg text-white">Proceed to checkout</Button>
              </Link>
            ) : (
              <Button disabled className="w-full opacity-60">Checkout Unavailable</Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


