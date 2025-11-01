"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useCart } from '@/contexts/CartContext'

type Addon = { _id: string; name: string; sku: string; price: number; description?: string; badge?: string }

export default function AddonsCarousel() {
  const { addItem } = useCart()
  const [addons, setAddons] = useState<Addon[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  const xRef = useRef(0)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/checkout/addons')
        if (!res.ok) return
        const data = await res.json()
        if (active) setAddons(data?.addons || [])
      } catch {}
    })()
    return () => { active = false }
  }, [])

  const items = useMemo(() => addons.slice(0, 10), [addons])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    let raf = 0
    const speed = 0.2 // slower scroll speed
    const step = () => {
      if (!pausedRef.current) {
        xRef.current -= speed
        const w = node.scrollWidth / 2
        if (Math.abs(xRef.current) >= w) xRef.current = 0
        node.style.transform = `translateX(${xRef.current}px)`
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [items.length])

  if (!items.length) return null

  return (
    <section aria-label="Popular add-ons" className="mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-lg font-semibold text-white/90 mb-3">Make it even better</h3>
        <div
          className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20"
          onMouseEnter={() => { setPaused(true); pausedRef.current = true }}
          onMouseLeave={() => { setPaused(false); pausedRef.current = false }}
        >
          <div className="flex gap-4 items-stretch py-3 will-change-transform" ref={containerRef} style={{ width: 'max-content' }}>
            {[...items, ...items].map((a, idx) => (
              <div
                key={a._id + '-' + idx}
                className="min-w-[260px] max-w-[260px] flex flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div>
                  <div className="text-xs font-bold tracking-wide text-black bg-amber-400 inline-block px-2 py-1 rounded-full mb-2">
                    {a.badge || 'ADD‑ON'}
                  </div>
                  <div className="font-semibold text-white mb-1">{a.name}</div>
                  <div className="text-white/80 font-bold text-xl mb-2">₦{a.price.toLocaleString()}</div>
                  {a.description && (
                    <p className="text-white/60 text-sm line-clamp-2">{a.description}</p>
                  )}
                </div>
                <button
                  onClick={() => { addItem({ id: a.sku, name: a.name, price: a.price, quantity: 1, category: 'addon' }); window.dispatchEvent(new Event('cart:add')) }}
                  className="mt-3 rounded-md bg-gradient-to-r from-orange-600 to-amber-500 text-white text-sm font-semibold py-2"
                >
                  Add to Basket
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Instruction removed per request */}
      </div>
    </section>
  )
}
