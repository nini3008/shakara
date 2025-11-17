'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ResolvedDiscount } from '@/types'

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  category?: string
  days?: number
  selectedDate?: string // legacy single-date reference; prefer selectedDates
  selectedDates?: string[]
  uid?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQty: (uid: string, quantity: number) => void
  removeItem: (uid: string) => void
  clear: () => void
  count: number
  total: number
  discount: ResolvedDiscount | null
  setDiscount: (discount: ResolvedDiscount | null) => void
  finalTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'shakara_cart_v1'
const DISCOUNT_STORAGE_KEY = 'shakara_discount_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const normalizeDates = (value?: string[] | string): string[] => {
    if (!value) return []
    const array = Array.isArray(value) ? value : String(value)
      .split(',')
      .map((date) => date.trim())
    const unique = Array.from(new Set(array.filter(Boolean)))
    unique.sort()
    return unique
  }

  const normalizeItem = (item: CartItem): CartItem => {
    const selectedDates = normalizeDates(item.selectedDates ?? item.selectedDate)
    return {
      ...item,
      selectedDates,
      selectedDate: selectedDates.length === 1 ? selectedDates[0] : item.selectedDate,
    }
  }

  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.map((i) => normalizeItem(i)) : []
    } catch {
      return []
    }
  })

  const [discount, setDiscount] = useState<ResolvedDiscount | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(DISCOUNT_STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  useEffect(() => {
    try {
      if (discount) {
        localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify(discount))
      } else {
        localStorage.removeItem(DISCOUNT_STORAGE_KEY)
      }
    } catch {}
  }, [discount])

  // Clear discount when cart changes
  useEffect(() => {
    if (discount && items.length > 0) {
      // Keep discount if cart has items
    } else if (items.length === 0) {
      // Clear discount if cart is empty
      setDiscount(null)
    }
  }, [items.length])

  const computeUid = (i: CartItem) => {
    const parts = [i.category || 'ticket', i.id]
    if (i.selectedDates?.length) {
      parts.push(`@${i.selectedDates.join('|')}`)
    } else if (i.selectedDate) {
      parts.push(`@${i.selectedDate}`)
    }
    return parts.join(':')
  }

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const normalized = normalizeItem(item)
      const uid = normalized.uid || computeUid(normalized)
      const existing = prev.find((p) => p.uid === uid)
      if (existing) {
        return prev.map((p) => (p.uid === uid ? { ...p, quantity: p.quantity + normalized.quantity } : p))
      }
      return [...prev, { ...normalized, uid }]
    })
  }

  const updateQty = (uid: string, quantity: number) => {
    setItems((prev) => prev.map((p) => (p.uid === uid ? { ...p, quantity: Math.max(1, quantity) } : p)))
  }

  const removeItem = (uid: string) => setItems((prev) => prev.filter((p) => p.uid !== uid))
  const clear = () => {
    setItems([])
    setDiscount(null)
  }

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items])
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items])
  const finalTotal = useMemo(() => {
    const discountValue = discount?.valueApplied || 0
    return Math.max(0, total - discountValue)
  }, [total, discount])

  const value: CartContextType = { items, addItem, updateQty, removeItem, clear, count, total, discount, setDiscount, finalTotal }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}


