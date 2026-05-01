import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { Download, Mail, Phone } from 'lucide-react'
import { getSettings } from '@/lib/data'

export async function Footer() {
  noStore()
  const settings = await getSettings()
  const year = new Date().getFullYear()
  const email = settings.email || 'you@email.com'
  const contactNumber = settings.contact_number || ''
  const contactHref = contactNumber ? `tel:${contactNumber.replace(/[^\d+]/g, '')}` : ''
  const location = settings.location || 'Cagayan de Oro, PH'

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_auto] lg:px-8">
        <div className="space-y-3">
          <div>
            <p className="font-display text-lg font-semibold">
              {settings.student_name || 'Euvic G. Abellano'}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Architectural Drafting Portfolio
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            {location}. Residential plans, technical presentation boards, and
            architectural visualization studies.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap content-start gap-2">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/projects">Projects</FooterLink>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          {settings.linkedin_url ? <FooterLink href={settings.linkedin_url}>LinkedIn</FooterLink> : null}
          {settings.behance_url ? <FooterLink href={settings.behance_url}>Behance</FooterLink> : null}
          {settings.github_url ? <FooterLink href={settings.github_url}>GitHub</FooterLink> : null}
        </nav>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <Link
            href={`mailto:${email}`}
            className="focus-ring inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 ease-out hover:text-[var(--foreground)] active:scale-95"
          >
            <Mail aria-hidden="true" size={16} />
            {email}
          </Link>
          {contactNumber ? (
            <Link
              href={contactHref}
              className="focus-ring inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 ease-out hover:text-[var(--foreground)] active:scale-95"
            >
              <Phone aria-hidden="true" size={16} />
              {contactNumber}
            </Link>
          ) : null}
          {settings.cv_url ? (
            <Link
              href={settings.cv_url}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-500 active:translate-y-0"
            >
              <Download aria-hidden="true" size={16} />
              Download CV
            </Link>
          ) : null}
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            © {year}
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring inline-flex min-h-11 items-center rounded-full border border-transparent px-3 text-sm font-semibold text-[var(--muted)] transition-all duration-200 ease-out hover:border-[var(--border)] hover:text-[var(--foreground)] active:scale-95"
    >
      {children}
    </Link>
  )
}
