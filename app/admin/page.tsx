import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAdminDashboardData } from '@/lib/admin-data'

export default async function AdminPage() {
  const { projects, messages } = await getAdminDashboardData()
  const published = projects.filter((project) => project.is_published).length
  const drafts = projects.length - published
  const totalViews = projects.reduce((sum, project) => sum + (project.view_count || 0), 0)
  const unread = messages.filter((message) => !message.is_read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--foreground)] bg-[var(--foreground)] px-4 text-sm font-semibold text-[var(--background)] transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95"
        >
          <Plus aria-hidden="true" size={16} />
          Quick Add Project
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Total Projects" value={projects.length} />
        <Stat label="Published" value={published} />
        <Stat label="Drafts" value={drafts} />
        <Stat label="Total Messages" value={messages.length} />
        <Stat label="Unread Messages" value={unread} />
        <Stat label="Total Views" value={totalViews} />
      </div>
      <div className="border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Recent Messages</h2>
          <Link
            href="/admin/messages"
            className="focus-ring inline-flex min-h-11 items-center text-sm font-semibold text-[var(--muted)] transition-all duration-150 ease-in-out hover:text-[var(--foreground)] active:scale-95"
          >
            View Inbox
          </Link>
        </div>
        {messages.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                  <th scope="col" className="px-3 py-3 font-semibold">
                    From
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Subject
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className="border-b border-[var(--border)]">
                    <td className="px-3 py-3 font-semibold">{message.name}</td>
                    <td className="px-3 py-3 text-[var(--muted)]">
                      {message.subject || 'No subject'}
                    </td>
                    <td className="px-3 py-3">{message.is_read ? 'Read' : 'Unread'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-[var(--muted)]">
            No contact messages yet.
          </p>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  )
}
