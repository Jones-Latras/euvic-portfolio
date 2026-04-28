'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastKind = 'success' | 'error' | 'info'
type Toast = {
  id: string
  kind: ToastKind
  message: string
}

type ToastContextValue = {
  showToast: (message: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)
const pendingToastKey = 'arch-portfolio-pending-toast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  function showToast(message: string, kind: ToastKind = 'info') {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, kind, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 4500)
  }

  useEffect(() => {
    const pending = window.localStorage.getItem(pendingToastKey)
    if (!pending) return
    window.localStorage.removeItem(pendingToastKey)
    const parsed = JSON.parse(pending) as { message: string; kind?: ToastKind }
    showToast(parsed.message, parsed.kind)
  }, [])

  const value = useMemo(() => ({ showToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-50 w-[min(24rem,calc(100vw-2rem))] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'flex items-start justify-between gap-3 border p-4 text-sm leading-relaxed shadow-lg transition-all duration-150 ease-in-out',
              toast.kind === 'success' && 'border-emerald-700 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100',
              toast.kind === 'error' && 'border-red-700 bg-red-50 text-red-950 dark:bg-red-950 dark:text-red-100',
              toast.kind === 'info' && 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]'
            )}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
              className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center transition-all duration-150 ease-in-out active:scale-95"
              aria-label="Dismiss notification"
            >
              <X aria-hidden="true" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast must be used within ToastProvider')
  return value
}

export function queueToast(message: string, kind: ToastKind = 'info') {
  window.localStorage.setItem(pendingToastKey, JSON.stringify({ message, kind }))
}
