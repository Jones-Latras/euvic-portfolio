'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function logout() {
    setLoading(true)
    if (hasSupabaseEnv) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    router.replace('/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={logout}
      className="focus-ring inline-flex min-h-11 w-full shrink-0 items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut aria-hidden="true" size={16} />
      {loading ? 'Signing out...' : 'Logout'}
    </button>
  )
}
