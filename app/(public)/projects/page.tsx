import type { Metadata } from 'next'
import Link from 'next/link'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { getFilteredProjects, getSettings } from '@/lib/data'

export const revalidate = 1800

type ProjectSearchParams = {
  category?: string
  tag?: string
  sort?: string
  page?: string
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: `Portfolio Projects | ${settings.student_name || 'Your Name'}`,
    description: 'Browse architectural drafting and design projects.',
    alternates: {
      canonical: '/projects',
    },
  }
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<ProjectSearchParams>
}) {
  const params = await searchParams
  const page = Number(params.page || '1')
  const result = await getFilteredProjects({
    category: params.category,
    tag: params.tag,
    sort: params.sort,
    page,
  })
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize))

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
        {result.projects.length ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {result.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <Pagination
              currentPage={result.page}
              totalPages={totalPages}
              category={params.category}
              tag={params.tag}
              sort={params.sort}
            />
          </>
        ) : (
          <div className="border border-[var(--border)] bg-[var(--surface)] p-8">
            <h2 className="text-xl font-semibold">No projects found</h2>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--muted)]">
              Reset filters or choose a different category to view available work.
            </p>
            <Link
              href="/projects"
              className="focus-ring mt-4 inline-flex min-h-11 items-center border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
            >
              Reset Filters
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function Pagination({
  currentPage,
  totalPages,
  category,
  tag,
  sort,
}: {
  currentPage: number
  totalPages: number
  category?: string
  tag?: string
  sort?: string
}) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-between gap-4" aria-label="Project pagination">
      <PageLink
        disabled={currentPage <= 1}
        href={buildHref({ category, tag, sort, page: currentPage - 1 })}
      >
        Previous
      </PageLink>
      <span className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">
        Page {currentPage} of {totalPages}
      </span>
      <PageLink
        disabled={currentPage >= totalPages}
        href={buildHref({ category, tag, sort, page: currentPage + 1 })}
      >
        Next
      </PageLink>
    </nav>
  )
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string
  disabled: boolean
  children: React.ReactNode
}) {
  if (disabled) {
    return (
      <span className="inline-flex min-h-11 items-center border border-[var(--border)] px-4 text-sm font-semibold opacity-50">
        {children}
      </span>
    )
  }

  return (
    <Link
      href={href}
      className="focus-ring inline-flex min-h-11 items-center border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
    >
      {children}
    </Link>
  )
}

function buildHref({
  category,
  tag,
  sort,
  page,
}: {
  category?: string
  tag?: string
  sort?: string
  page?: number
}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (tag) params.set('tag', tag)
  if (sort) params.set('sort', sort)
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/projects?${query}` : '/projects'
}
