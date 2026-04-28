'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Mode = 'idle' | 'submitting' | 'resetting'

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export function LoginForm() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('idle')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    if (!hasSupabaseEnv) {
      setMessage('Supabase credentials are not configured yet.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') || '')

    setMode('submitting')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setMode('idle')

    if (error) {
      setMessage(error.message)
      return
    }

    router.replace('/admin')
    router.refresh()
  }

  async function resetPassword() {
    setMessage('')

    if (!email) {
      setMessage('Enter your email before requesting a reset link.')
      return
    }

    if (!hasSupabaseEnv) {
      setMessage('Supabase credentials are not configured yet.')
      return
    }

    setMode('resetting')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    setMode('idle')
    setMessage(error ? error.message : 'Password reset email sent.')
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {!hasSupabaseEnv ? (
        <div className="border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
          Add Supabase environment variables before using admin login.
        </div>
      ) : null}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="focus-ring min-h-11 w-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="focus-ring min-h-11 w-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={mode !== 'idle'}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--foreground)] bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--background)] transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn aria-hidden="true" size={16} />
          {mode === 'submitting' ? 'Signing in...' : 'Sign In'}
        </button>
        <button
          type="button"
          disabled={mode !== 'idle'}
          onClick={resetPassword}
          className="focus-ring inline-flex min-h-11 items-center justify-center px-3 text-sm font-semibold text-[var(--muted)] transition-all duration-150 ease-in-out hover:text-[var(--foreground)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === 'resetting' ? 'Sending...' : 'Forgot password'}
        </button>
      </div>
      {message ? (
        <p role="status" className="text-sm leading-relaxed text-[var(--muted)]">
          {message}
        </p>
      ) : null}
      <Link
        href="/"
        className="focus-ring inline-flex min-h-11 items-center text-sm font-semibold text-[var(--muted)] transition-all duration-150 ease-in-out hover:text-[var(--foreground)] active:scale-95"
      >
        Back to portfolio
      </Link>
    </form>
  )
}
