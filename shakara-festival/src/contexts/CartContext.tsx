'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  category?: string
  days?: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQty: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clear: () => void
  count: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'shakara_cart_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p))
      }
      return [...prev, item]
    })
  }

  const updateQty = (id: string, quantity: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p)))
  }

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id))
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


