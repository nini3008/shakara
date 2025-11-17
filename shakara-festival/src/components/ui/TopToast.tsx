import * as ToastPrimitive from '@radix-ui/react-toast'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TopToastProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  message?: ReactNode
  duration?: number
  className?: string
}

export function TopToast({ open, onOpenChange, message, duration = 4000, className }: TopToastProps) {
  return (
    <ToastPrimitive.Provider swipeDirection="up" duration={duration}>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        className={cn(
          'pointer-events-auto z-[60] w-full max-w-sm rounded-full border border-white/10 bg-[#0f0f13]/95 px-5 py-3 text-sm font-medium text-white shadow-[0_15px_35px_-15px_rgba(0,0,0,0.65)] backdrop-blur',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">✕</span>
          <ToastPrimitive.Description className="flex-1 text-left leading-snug">
            {message}
          </ToastPrimitive.Description>
        </div>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="pointer-events-none fixed top-6 left-1/2 z-[59] flex w-full max-w-full -translate-x-1/2 flex-col items-center gap-3 px-4" />
    </ToastPrimitive.Provider>
  )
}

