import Link from 'next/link'
import { Download } from 'lucide-react'
import { getSettings } from '@/lib/data'

export async function Footer() {
  const settings = await getSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold">{settings.student_name || 'Your Name'}</p>
          <p className="max-w-prose text-sm leading-relaxed text-[var(--muted)]">
            {settings.email || 'you@email.com'} · © {year}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {settings.linkedin_url ? <FooterLink href={settings.linkedin_url}>LinkedIn</FooterLink> : null}
          {settings.behance_url ? <FooterLink href={settings.behance_url}>Behance</FooterLink> : null}
          {settings.github_url ? <FooterLink href={settings.github_url}>GitHub</FooterLink> : null}
          {settings.cv_url ? (
            <Link
              href={settings.cv_url}
              className="focus-ring inline-flex min-h-11 items-center gap-2 border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
            >
              <Download aria-hidden="true" size={16} />
              CV
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring inline-flex min-h-11 items-center px-3 text-sm font-medium text-[var(--muted)] transition-all duration-150 ease-in-out hover:text-[var(--foreground)] active:scale-95"
    >
      {children}
    </Link>
  )
}
