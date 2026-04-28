'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FolderKanban, Home, Inbox, Menu, Settings, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { LogoutButton } from './LogoutButton'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/about', label: 'About Page', icon: UserRound },
  { href: '/admin/messages', label: 'Messages', icon: Inbox },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="mb-3 flex items-center justify-between lg:hidden">
        <p className="text-sm font-semibold">Admin Menu</p>
        <button
          type="button"
          aria-label="Toggle admin navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] bg-[var(--surface)] transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
        >
          {open ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
        </button>
      </div>
      <div className={cn('space-y-2 lg:block', open ? 'block' : 'hidden')}>
        <nav aria-label="Admin" className="flex flex-col gap-2">
          {links.map((item) => {
            const Icon = item.icon
            const active =
              pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            const showBadge = item.href === '/admin/messages' && unreadCount > 0

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'focus-ring inline-flex min-h-11 shrink-0 items-center gap-2 border px-3 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95',
                  active
                    ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]'
                )}
              >
                <Icon aria-hidden="true" size={16} />
                <span className="min-w-0 flex-1">{item.label}</span>
                {showBadge ? (
                  <span className="inline-flex min-h-6 min-w-6 items-center justify-center border border-current px-1 font-mono text-xs">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </nav>
        <LogoutButton />
      </div>
    </aside>
  )
}
