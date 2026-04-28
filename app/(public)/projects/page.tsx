import type { Metadata } from 'next'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { getProjects, getSettings } from '@/lib/data'

export const revalidate = 1800

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: `Portfolio Projects | ${settings.student_name || 'Your Name'}`,
    description: 'Browse architectural drafting and design projects.',
  }
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; sort?: string }>
}) {
  const params = await searchParams
  const projects = await getProjects()
  const filtered = projects
    .filter((project) => (!params.category ? true : project.category === params.category))
    .filter((project) => (!params.tag ? true : project.tags?.includes(params.tag)))
    .sort((a, b) => {
      if (params.sort === 'oldest') {
        return String(a.created_at).localeCompare(String(b.created_at))
      }
      if (params.sort === 'az') {
        return a.title.localeCompare(b.title)
      }
      return String(b.created_at).localeCompare(String(a.created_at))
    })

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">
            Portfolio Gallery
          </p>
          <h1 className="text-4xl font-semibold leading-tight">Projects</h1>
          <p className="max-w-prose text-base leading-relaxed text-[var(--muted)]">
            Technical drawings, design studies, rendering concepts, and documentation packages.
          </p>
        </div>
        <ProjectFilters category={params.category} tag={params.tag} sort={params.sort} />
        {filtered.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="border border-[var(--border)] bg-[var(--surface)] p-8">
            <h2 className="text-xl font-semibold">No projects found</h2>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--muted)]">
              Reset filters or choose a different category to view available work.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
