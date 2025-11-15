"use client"

import React, { useEffect, useMemo, useState } from 'react'
import styles from './TicketsSection.module.scss'
import { useCart } from '@/contexts/CartContext'
import { CART_ENABLED } from '@/lib/featureFlags'
import { trackAddToCart } from '@/lib/analytics'

type Addon = { _id: string; name: string; sku: string; price: number; description?: string; badge?: string }

type TicketsSectionAddonsUpsellProps = {
  selectedDates: string[]
  enabled?: boolean
}

export default function TicketsSectionAddonsUpsell({ selectedDates, enabled = true }: TicketsSectionAddonsUpsellProps) {
  const { addItem } = useCart()
  const [addons, setAddons] = useState<Addon[]>([])

  const normalizedDates = useMemo(() => {
    const next = Array.from(new Set(selectedDates.filter(Boolean)))
    next.sort()
    return next
  }, [selectedDates])

  useEffect(() => {
    if (!CART_ENABLED || !enabled) return

    fetch('/api/checkout/addons')
      .then(r => r.json())
      .then(d => setAddons(d?.addons || []))
      .catch(() => {})
  }, [enabled])

  if (!CART_ENABLED || !enabled || !addons.length) return null

  return (
    <section className={styles.ticketsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Make it even better</h2>
        <div className={styles.ticketsGrid}>
          {addons.slice(0, 3).map((a) => (
            <div key={a._id} className={styles.ticketCardWrapper}>
              <div className={styles.ticketCard}>
                {a.badge && <div className={styles.badge}>{a.badge}</div>}
                <div className={styles.cardContent}>
                  <h3 className={styles.ticketName}>{a.name}</h3>
                  <div className={styles.priceContainer}>
                    <div className={styles.priceGroup}>
                      <span className={styles.currentPrice}>₦{a.price.toLocaleString()}</span>
                    </div>
                  </div>
                  {a.description && (
                    <p className={styles.description}>{a.description}</p>
                  )}
                </div>
                <div className={styles.cardFooter}>
                  <button
                    onClick={() => {
                      const sku = a.sku
                      trackAddToCart({
                        items: [
                          {
                            item_id: sku,
                            item_name: a.name,
                            price: a.price,
                            quantity: 1,
                            item_category: 'addon',
                          },
                        ],
                        currency: 'NGN',
                        value: a.price,
                      })
                      addItem({ 
                        id: sku, 
                        name: a.name, 
                        price: a.price, 
                        quantity: 1, 
                        category: 'addon', 
                        selectedDates: normalizedDates,
                        selectedDate: normalizedDates.length === 1 ? normalizedDates[0] : undefined,
                      })
                      window.dispatchEvent(new Event('cart:add'))
                    }}
                    className={styles.buyButton + ' clickable'}
                  >
                    Add to Basket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


