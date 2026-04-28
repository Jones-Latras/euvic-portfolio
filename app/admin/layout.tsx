import type { Metadata } from 'next'
import Link from 'next/link'
import { FolderKanban, Home, Inbox, Settings, UserRound } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
  },
}

const links = [
  { href: '/admin', label: 'Overview', icon: Home },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/about', label: 'About', icon: UserRound },
  { href: '/admin/messages', label: 'Messages', icon: Inbox },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--border)]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[14rem_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Admin" className="flex gap-2 overflow-x-auto lg:flex-col">
            {links.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring inline-flex min-h-11 shrink-0 items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
                >
                  <Icon aria-hidden="true" size={16} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </section>
  )
}
