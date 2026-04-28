import { SiteSettingsForm } from '@/components/admin/SiteSettingsForm'
import { getAdminSettingsData } from '@/lib/admin-data'

export default async function AdminSettingsPage() {
  const { settings, projects } = await getAdminSettingsData()

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">Site</p>
        <h1 className="mt-2 text-3xl font-semibold">Settings</h1>
      </div>
      <SiteSettingsForm settings={settings} projects={projects} />
    </div>
  )
}
