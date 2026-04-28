import { getProjects } from '@/lib/data'

export default async function AdminPage() {
  const projects = await getProjects()
  const published = projects.filter((project) => project.is_published).length
  const featured = projects.filter((project) => project.is_featured).length

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Projects" value={projects.length} />
        <Stat label="Published" value={published} />
        <Stat label="Featured" value={featured} />
      </div>
      <div className="border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold">Supabase Auth Guard Pending</h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--muted)]">
          The admin shell is scaffolded. Connect Supabase credentials and complete Phase 4 before exposing this route in production.
        </p>
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
