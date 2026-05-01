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

const availability = [
  'Residential drafting',
  'Presentation boards',
  '3D visualization studies',
  'Academic collaboration',
  'Internship / job opportunities',
]

export default async function ContactPage() {
  const settings = await getSettings()
  const email = settings.email || 'you@email.com'
  const location = settings.location || 'Cagayan de Oro, PH'

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_30rem] lg:gap-14">
        <div className="grid gap-8 lg:grid-cols-[1px_minmax(0,1fr)]">
          <div className="hidden bg-[var(--border)] lg:block" aria-hidden="true" />
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                <span>Contact / 04</span>
                <span aria-hidden="true">/</span>
                <span>{location}</span>
              </div>
              <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Let&apos;s talk about drafting, design, or opportunities.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-[var(--muted)]">
                Send a project inquiry, academic note, or job opportunity. Direct email is
                available as a fallback.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/75 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                  Contact Info
                </p>
                <dl className="mt-5 space-y-4">
                  <ContactMeta label="Email" value={email} href={`mailto:${email}`} />
                  <ContactMeta label="Location" value={location} />
                  <ContactMeta label="Response Time" value="Usually within 1-2 days" />
                </dl>
              </article>

              <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/75 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                  Available For
                </p>
                <ul className="mt-5 space-y-2">
                  {availability.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-[var(--muted)]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--muted)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            {settings.linkedin_url ? (
              <Link
                href={settings.linkedin_url}
                className="focus-ring inline-flex min-h-11 items-center rounded-full border border-[var(--border)] px-4 text-sm font-semibold text-[var(--muted)] transition-all duration-200 ease-out hover:border-slate-500 hover:text-[var(--foreground)] active:scale-95"
              >
                LinkedIn
              </Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-5 shadow-2xl shadow-slate-950/5 sm:p-6">
          <div className="mb-6 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Send An Inquiry
            </p>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Use the form below for project, academic, or work-related messages.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

function ContactMeta({
  label,
  value,
  href,
}: {
  label: string
  value: string
  href?: string
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold">
        {href ? (
          <Link
            href={href}
            className="focus-ring transition-colors duration-200 hover:text-slate-600 dark:hover:text-white"
          >
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}
