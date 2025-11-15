"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import type { CartItem } from '@/contexts/CartContext'
import styles from '@/components/sections/TicketsSection.module.scss'
import { trackAddToCart } from '@/lib/analytics'

type Addon = {
  _id: string
  name: string
  sku: string
  description?: string
  price: number
  badge?: string
}

const deriveTicketDates = (items: CartItem[]): string[] => {
  const dates = new Set<string>()
  for (const item of items) {
    if (item.category === 'addon') continue
    const selectedDates = Array.isArray(item.selectedDates) && item.selectedDates.length > 0
      ? item.selectedDates
      : (item.selectedDate ? [item.selectedDate] : [])
    for (const date of selectedDates) {
      if (typeof date === 'string' && date.length > 0) {
        dates.add(date)
      }
    }
  }
  return Array.from(dates).sort()
}

export default function AddonsSection() {
  const { addItem, items } = useCart()
  const [addons, setAddons] = useState<Addon[]>([])
  const ticketDates = useMemo(() => deriveTicketDates(items), [items])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/checkout/addons')
        if (!res.ok) return
        const data = await res.json()
        setAddons(data?.addons || [])
      } catch {}
    }
    load()
  }, [])

  if (!addons.length) return null

  return (
    <section className={styles.ticketsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Enhance your experience</h2>
        <div className={styles.ticketsGrid}>
          {addons.map((a) => (
            <div key={a._id} className={styles.ticketCardWrapper}>
              <div className={styles.ticketCard}>
                <div className={styles.badge}>{a.badge || 'ADD-ON'}</div>
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
                      const dates = ticketDates.length > 0 ? [...ticketDates] : []
                      if (dates.length === 0) {
                        window.alert('Add at least one dated ticket to your basket before adding add-ons.')
                        return
                      }
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
                        selectedDates: dates,
                        selectedDate: dates.length === 1 ? dates[0] : undefined,
                      })
                      window.dispatchEvent(new Event('cart:add'))
                    }}
                    className={styles.buyButton + ' clickable'}
                    aria-label={`Add ${a.name} add-on`}
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


