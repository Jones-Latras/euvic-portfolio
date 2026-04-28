import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getProjects } from '@/lib/data'

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">Manage</p>
          <h1 className="mt-2 text-3xl font-semibold">Projects</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="focus-ring inline-flex min-h-11 items-center gap-2 border border-accent bg-accent px-4 text-sm font-semibold text-white transition-all duration-150 ease-in-out hover:bg-accent-light active:scale-95"
        >
          <Plus aria-hidden="true" size={16} />
          New Project
        </Link>
      </div>
      <div className="overflow-x-auto border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)]">
              <th scope="col" className="px-4 py-3 font-semibold">Title</th>
              <th scope="col" className="px-4 py-3 font-semibold">Category</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Views</th>
              <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-[var(--border)]">
                <td className="px-4 py-3 font-semibold">{project.title}</td>
                <td className="px-4 py-3">{project.category}</td>
                <td className="px-4 py-3">{project.is_published ? 'Published' : 'Draft'}</td>
                <td className="px-4 py-3">{project.view_count || 0}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="focus-ring inline-flex min-h-11 items-center text-sm font-semibold transition-all duration-150 ease-in-out hover:text-slate-600 active:scale-95"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
