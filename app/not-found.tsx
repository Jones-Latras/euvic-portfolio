import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">404</p>
        <h1 className="text-4xl font-semibold leading-tight">Page not found</h1>
        <p className="max-w-prose text-base leading-relaxed text-[var(--muted)]">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          href="/"
          className="focus-ring inline-flex min-h-11 items-center justify-center border border-[var(--foreground)] bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--background)] transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95"
        >
          Back to Home
        </Link>
      </div>
    </section>
  )
}
