import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { getAdminDashboardData } from '@/lib/admin-data'
import { hasSupabaseBrowserEnv } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (hasSupabaseBrowserEnv) {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect('/login')
    }
  }

  const { messages } = await getAdminDashboardData()
  const unreadCount = messages.filter((message) => !message.is_read).length

  return (
    <section className="border-t border-[var(--border)]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[14rem_1fr] lg:px-8">
        <AdminSidebar unreadCount={unreadCount} />
        <div>{children}</div>
      </div>
    </section>
  )
}
