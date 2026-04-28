'use client'

import Link from 'next/link'
import { LayoutDashboard, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { createClient } from '@/lib/supabase/client'
import { hasSupabaseBrowserEnv } from '@/lib/supabase/config'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header({ studentName = 'Euvic Abellano' }: { studentName?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    if (!hasSupabaseBrowserEnv) return

    const supabase = createClient()
    void supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(Boolean(session))
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/86 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[74px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="focus-ring flex min-h-11 flex-col justify-center transition-all duration-150 ease-in-out hover:text-slate-600 active:scale-95 dark:hover:text-slate-300"
        >
          <span className="font-display text-[15px] font-semibold leading-none">{studentName}</span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Drafting Portfolio
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'focus-ring relative flex min-h-11 items-center px-3 text-sm font-semibold text-[var(--muted)] transition-all duration-150 ease-in-out hover:text-[var(--foreground)] active:scale-95',
                  active &&
                    'text-[var(--foreground)] after:absolute after:bottom-2 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[var(--foreground)]'
                )}
              >
                {item.label}
              </Link>
            )
          })}
          {hasSession ? (
            <Link
              href="/admin"
              aria-label="Admin dashboard"
              title="Admin dashboard"
            className="focus-ring flex min-h-11 min-w-11 items-center justify-center rounded-full text-[var(--muted)] transition-all duration-150 ease-in-out hover:bg-[var(--surface)] hover:text-[var(--foreground)] active:scale-95"
            >
              <LayoutDashboard aria-hidden="true" size={18} />
            </Link>
          ) : null}
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
          >
            {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-3 md:hidden">
          <nav aria-label="Mobile primary" className="flex flex-col gap-1">
            {[...navItems, ...(hasSession ? [{ href: '/admin', label: 'Admin' }] : [])].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring flex min-h-11 items-center px-2 text-sm font-medium text-[var(--foreground)] transition-all duration-150 ease-in-out hover:bg-[var(--surface)] active:scale-95"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
