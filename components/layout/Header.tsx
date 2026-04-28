'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/88 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="focus-ring flex min-h-11 items-center text-sm font-semibold tracking-wide transition-all duration-150 ease-in-out hover:text-slate-600 active:scale-95 dark:hover:text-slate-300"
        >
          Architectural Portfolio
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'focus-ring flex min-h-11 items-center px-3 text-sm font-medium text-[var(--muted)] transition-all duration-150 ease-in-out hover:text-[var(--foreground)] active:scale-95',
                  active && 'text-[var(--foreground)]'
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/admin"
            className="focus-ring flex min-h-11 items-center px-3 text-sm font-medium text-[var(--muted)] transition-all duration-150 ease-in-out hover:text-[var(--foreground)] active:scale-95"
          >
            Admin
          </Link>
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] bg-[var(--surface)] transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
          >
            {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-3 md:hidden">
          <nav aria-label="Mobile primary" className="flex flex-col gap-1">
            {[...navItems, { href: '/admin', label: 'Admin' }].map((item) => (
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
