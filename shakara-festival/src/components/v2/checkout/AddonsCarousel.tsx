"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import type { CartItem } from '@/contexts/CartContext'
import { cn } from '@/lib/utils'
import { trackAddToCart } from '@/lib/analytics'
import { TopToast } from '@/components/ui/TopToast'

type Addon = { _id: string; name: string; sku: string; price: number; description?: string; badge?: string }
type AddonsCarouselProps = { className?: string }

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

export default function AddonsCarousel({ className }: AddonsCarouselProps) {
  const { addItem, items: cartItems } = useCart()
  const [addons, setAddons] = useState<Addon[]>([])
  const ticketDates = useMemo(() => deriveTicketDates(cartItems), [cartItems])
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastId, setToastId] = useState(0)

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setToastId((id) => id + 1)
    setToastOpen(true)
  }, [])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [paused, setPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const pausedRef = useRef(false)
  const xRef = useRef(0)
  const dragStateRef = useRef({ pointerId: 0, startX: 0, startOffset: 0, active: false })
  const itemWidthRef = useRef(0)
  const resumeTimeoutRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const applyTranslation = useCallback((nextValue: number) => {
    const node = containerRef.current
    if (!node) return
    const width = node.scrollWidth / 2
    if (!width) return
    let value = nextValue % width
    if (value < 0) value += width
    xRef.current = value
    node.style.transform = `translateX(${-value}px)`
  }, [])

  const computeItemWidth = useCallback(() => {
    const node = containerRef.current
    if (!node) return 0
    const card = node.querySelector<HTMLElement>('[data-addon-card]')
    if (!card) return 0
    const styles = window.getComputedStyle(node)
    const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0
    const total = card.offsetWidth + gap
    itemWidthRef.current = total
    return total
  }, [])

  const clearResumeTimeout = useCallback(() => {
    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }
  }, [])

  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  const scheduleResume = useCallback(() => {
    clearResumeTimeout()
    resumeTimeoutRef.current = window.setTimeout(() => {
      resumeTimeoutRef.current = null
      const node = containerRef.current
      const shouldStayPaused = !!node && node.matches(':hover')
      setPaused(shouldStayPaused)
      pausedRef.current = shouldStayPaused
    }, 1400)
  }, [clearResumeTimeout])

  const scrollByStep = useCallback((direction: 'forward' | 'backward') => {
    const step = itemWidthRef.current || computeItemWidth()
    if (!step) return
    cancelAnimation()
    clearResumeTimeout()
    setPaused(true)
    pausedRef.current = true
    const start = xRef.current
    const delta = (direction === 'forward' ? 1 : -1) * step
    const duration = 320
    const startTime = performance.now()

    const tick = (time: number) => {
      const elapsed = Math.min((time - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - elapsed, 3)
      applyTranslation(start + delta * eased)
      if (elapsed < 1) {
        animationFrameRef.current = requestAnimationFrame(tick)
      } else {
        animationFrameRef.current = null
        scheduleResume()
      }
    }

    animationFrameRef.current = requestAnimationFrame(tick)
  }, [applyTranslation, cancelAnimation, clearResumeTimeout, computeItemWidth, scheduleResume])

  const endDrag = useCallback((event?: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) return
    const pointerId = event?.pointerId ?? dragStateRef.current.pointerId
    dragStateRef.current = { pointerId: 0, startX: 0, startOffset: 0, active: false }
    setIsDragging(false)
    cancelAnimation()
    clearResumeTimeout()
    const node = containerRef.current
    const shouldStayPaused = !!node && node.matches(':hover')
    setPaused(shouldStayPaused)
    pausedRef.current = shouldStayPaused
    if (!shouldStayPaused) {
      scheduleResume()
    }
    if (node && typeof pointerId === 'number' && node.hasPointerCapture?.(pointerId)) {
      try {
        node.releasePointerCapture(pointerId)
      } catch {}
    }
  }, [cancelAnimation, clearResumeTimeout, scheduleResume])

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
    if (!containerRef.current) return
    let raf = 0
    const speed = 0.2 // slower scroll speed
    const step = () => {
      if (!pausedRef.current) {
        applyTranslation(xRef.current + speed)
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [items.length, applyTranslation])

  useEffect(() => {
    applyTranslation(xRef.current)
  }, [items.length, applyTranslation])

  useEffect(() => {
    const updateWidth = () => computeItemWidth()
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [computeItemWidth, items.length])

  useEffect(() => () => {
    clearResumeTimeout()
    cancelAnimation()
  }, [clearResumeTimeout, cancelAnimation])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = containerRef.current
    if (!node) return
    const target = event.target as HTMLElement | null
    if (target?.closest('button, a, input, textarea, select, [data-ignore-drag]')) {
      return
    }
    cancelAnimation()
    clearResumeTimeout()
    dragStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: xRef.current,
    }
    setIsDragging(true)
    setPaused(true)
    pausedRef.current = true
    try {
      node.setPointerCapture(event.pointerId)
    } catch {}
    event.preventDefault()
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) return
    const delta = event.clientX - dragStateRef.current.startX
    applyTranslation(dragStateRef.current.startOffset - delta)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    endDrag(event)
  }

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    endDrag(event)
  }

  if (!items.length) return null

  return (
    <section aria-label="Popular add-ons" className={cn('mt-12', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-lg font-semibold text-white/90 mb-3">Make it even better</h3>
        <div
          className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20"
          onMouseEnter={() => {
            clearResumeTimeout()
            cancelAnimation()
            setPaused(true)
            pausedRef.current = true
          }}
          onMouseLeave={() => {
            clearResumeTimeout()
            setPaused(false)
            pausedRef.current = false
          }}
        >
          <button
            type="button"
            aria-label="Scroll add-ons backward"
            data-ignore-drag
            className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
            onClick={() => scrollByStep('backward')}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <span aria-hidden>{'<'}</span>
          </button>
          <button
            type="button"
            aria-label="Scroll add-ons forward"
            data-ignore-drag
            className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
            onClick={() => scrollByStep('forward')}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <span aria-hidden>{'>'}</span>
          </button>
          <div
            className={cn(
              'flex gap-4 items-stretch py-3 will-change-transform select-none cursor-grab',
              isDragging && 'cursor-grabbing'
            )}
            ref={containerRef}
            style={{ width: 'max-content', touchAction: 'pan-y' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            {[...items, ...items].map((a, idx) => (
              <div
                key={a._id + '-' + idx}
                data-addon-card
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
                    onClick={() => {
                      const dates = ticketDates.length > 0 ? [...ticketDates] : []
                      if (dates.length === 0) {
                        showToast('Add at least one dated ticket before choosing add-ons')
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
      <TopToast
        key={toastId}
        open={toastOpen}
        onOpenChange={setToastOpen}
        message={toastMessage}
      />
    </section>
  )
}
