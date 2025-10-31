'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

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
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'shakara_cart_v1'

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

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
  const clear = () => setItems([])

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items])
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items])

  const value: CartContextType = { items, addItem, updateQty, removeItem, clear, count, total }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}


