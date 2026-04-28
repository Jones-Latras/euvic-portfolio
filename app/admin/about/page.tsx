import { AboutEditorForm } from '@/components/admin/AboutEditorForm'
import { getAdminAboutEditorData } from '@/lib/admin-data'

export default async function AdminAboutPage() {
  const { about, education, skills } = await getAdminAboutEditorData()

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">Content</p>
        <h1 className="mt-2 text-3xl font-semibold">About Editor</h1>
      </div>
      <AboutEditorForm about={about} education={education} skills={skills} />
    </div>
  )
}
