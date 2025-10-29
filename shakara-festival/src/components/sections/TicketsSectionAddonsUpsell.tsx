"use client"

import React, { useEffect, useState } from 'react'
import styles from './TicketsSection.module.scss'
import { useCart } from '@/contexts/CartContext'

type Addon = { _id: string; name: string; sku: string; price: number; description?: string; badge?: string }

export default function TicketsSectionAddonsUpsell() {
  const { addItem } = useCart()
  const [addons, setAddons] = useState<Addon[]>([])

  useEffect(() => {
    fetch('/api/checkout/addons')
      .then(r => r.json())
      .then(d => setAddons(d?.addons || []))
      .catch(() => {})
  }, [])

  if (!addons.length) return null

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
                      addItem({ id: a.sku, name: a.name, price: a.price, quantity: 1, category: 'addon' })
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


