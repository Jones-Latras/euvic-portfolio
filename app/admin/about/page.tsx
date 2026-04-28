export default function AdminAboutPage() {
  return <AdminPlaceholder title="About Editor" />
}

function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-[var(--muted)]">
        This editor is reserved for Phase 5 content management after Supabase Auth and Storage are connected.
      </p>
    </div>
  )
}
