import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { cn } from '@/lib/utils'

type ToastContextValue = {
  show: (message: ReactNode, options?: { variant?: 'error' | 'success' | 'info'; duration?: number }) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const variantConfig = {
  error: { badge: '✕', badgeClass: 'bg-red-500/20 text-red-400' },
  success: { badge: '✓', badgeClass: 'bg-emerald-500/20 text-emerald-400' },
  info: { badge: 'i', badgeClass: 'bg-slate-500/20 text-slate-200' },
} as const

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState<ReactNode>(null)
  const [duration, setDuration] = useState(4000)
  const [variant, setVariant] = useState<'error' | 'success' | 'info'>('info')

  const show = useCallback<ToastContextValue['show']>((msg, opts) => {
    setOpen(false)
    setMessage(msg)
    setVariant(opts?.variant ?? 'info')
    setDuration(opts?.duration ?? 4000)
    requestAnimationFrame(() => setOpen(true))
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ show }), [show])

  const badgeStyles = variantConfig[variant]

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider duration={duration} swipeDirection="up">
        {children}
        <ToastPrimitive.Root
          open={open}
          onOpenChange={setOpen}
          className="pointer-events-auto z-[70] w-full max-w-sm rounded-full border border-white/10 bg-[#0f0f13]/95 px-5 py-3 text-sm font-medium text-white shadow-[0_15px_35px_-15px_rgba(0,0,0,0.65)] backdrop-blur"
        >
          <div className="flex items-center gap-3">
            <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full text-xs', badgeStyles.badgeClass)}>
              {badgeStyles.badge}
            </span>
            <ToastPrimitive.Description className="flex-1 text-left leading-snug">
              {message}
            </ToastPrimitive.Description>
          </div>
        </ToastPrimitive.Root>
        <ToastPrimitive.Viewport className="pointer-events-none fixed top-6 left-1/2 z-[69] flex w-full max-w-full -translate-x-1/2 flex-col items-center gap-3 px-4" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

