"use client"

import React, { useEffect, useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import styles from '@/components/sections/TicketsSection.module.scss'

type Addon = {
  _id: string
  name: string
  sku: string
  description?: string
  price: number
  badge?: string
}

export default function AddonsSection() {
  const { addItem } = useCart()
  const [addons, setAddons] = useState<Addon[]>([])

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
                      addItem({ id: a.sku, name: a.name, price: a.price, quantity: 1, category: 'addon' })
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


