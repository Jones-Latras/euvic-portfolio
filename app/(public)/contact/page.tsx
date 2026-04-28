import Link from 'next/link'
import { ContactForm } from '@/components/contact/ContactForm'
import { getSettings } from '@/lib/data'

export const metadata = {
  title: 'Contact',
  description: 'Contact the architectural drafting portfolio owner.',
  alternates: {
    canonical: '/contact',
  },
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_28rem]">
        <div className="space-y-5">
          <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">
            Contact
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight">
            Let&apos;s talk about drafting, design, or opportunities.
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-[var(--muted)]">
            Send a project inquiry, academic note, or job opportunity. Direct email is available as a fallback.
          </p>
          <div className="space-y-2 text-sm leading-relaxed text-[var(--muted)]">
            <p>{settings.email || 'you@email.com'}</p>
            {settings.linkedin_url ? (
              <Link
                href={settings.linkedin_url}
                className="focus-ring inline-flex min-h-11 items-center font-semibold text-[var(--foreground)] transition-all duration-150 ease-in-out hover:text-slate-600 active:scale-95"
              >
                LinkedIn
              </Link>
            ) : null}
          </div>
        </div>
        <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
