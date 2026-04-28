'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {isDark ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
    </button>
  )
}
