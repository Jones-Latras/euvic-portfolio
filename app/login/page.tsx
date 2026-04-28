import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/LoginForm'

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_28rem]">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">
            Admin Access
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight">
            Sign in to manage portfolio content.
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-[var(--muted)]">
            Use the Supabase admin account created for the portfolio owner.
          </p>
        </div>
        <div className="border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <LoginForm />
        </div>
      </div>
    </section>
  )
}
