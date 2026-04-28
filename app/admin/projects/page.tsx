import Link from 'next/link'
import { Plus } from 'lucide-react'
import { AdminProjectsTable } from '@/components/admin/AdminProjectsTable'
import { getAdminDashboardData } from '@/lib/admin-data'

export default async function AdminProjectsPage() {
  const { projects } = await getAdminDashboardData()
  const sortedProjects = [...projects].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">Manage</p>
          <h1 className="mt-2 text-3xl font-semibold">Projects</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="focus-ring inline-flex min-h-11 items-center gap-2 border border-[var(--foreground)] bg-[var(--foreground)] px-4 text-sm font-semibold text-[var(--background)] transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95"
        >
          <Plus aria-hidden="true" size={16} />
          New Project
        </Link>
      </div>
      <AdminProjectsTable projects={sortedProjects} />
    </div>
  )
}
