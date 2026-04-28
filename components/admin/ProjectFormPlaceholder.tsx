export function ProjectFormPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">Project Form</p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
      </div>
      <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="max-w-prose text-sm leading-relaxed text-[var(--muted)]">
          The production create/edit form is scheduled for Phase 5. The public portfolio and admin shell are scaffolded first so Supabase credentials, Auth, and Storage can be wired in cleanly.
        </p>
      </div>
    </div>
  )
}
