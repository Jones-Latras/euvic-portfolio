import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { getFilteredProjects, getSettings } from '@/lib/data'
import { PROJECT_CATEGORIES } from '@/lib/constants'
import type { Project } from '@/lib/supabase/types'
import { formatYear } from '@/lib/utils'

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
  const featuredProject = result.projects[0]
  const gridProjects = featuredProject ? result.projects.slice(1) : result.projects

  return (
    <section className="px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="max-w-3xl space-y-2">
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Projects
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Technical drawings, design studies, rendering concepts, and documentation packages.
          </p>
        </div>
        {result.projects.length ? (
          <>
            {featuredProject ? <FeaturedProject project={featuredProject} /> : null}
            <ProjectFilters
              category={params.category}
              tag={params.tag}
              sort={params.sort}
              total={result.total}
            />
            {gridProjects.length ? (
              <div className="space-y-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                      Project Index
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-semibold">More Work</h2>
                  </div>
                  <p className="hidden text-sm text-[var(--muted)] sm:block">
                    {gridProjects.length} shown on this page
                  </p>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {gridProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            ) : null}
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

function FeaturedProject({ project }: { project: Project }) {
  const image =
    project.cover_image ||
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=75'
  const category =
    PROJECT_CATEGORIES.find((item) => item.value === project.category)?.label ?? project.category
  const tools = project.tags?.slice(0, 3).map(formatTag).join(' / ') || 'Drafting / Visualization'

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 shadow-2xl shadow-slate-950/5">
      <Link
        href={`/projects/${project.slug}`}
        className="focus-ring group grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 lg:aspect-auto lg:min-h-[21rem]">
          <Image
            src={image}
            alt={`${project.title} featured project preview`}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.035]"
            quality={85}
          />
          <div className="absolute left-4 top-4 border border-white/40 bg-slate-950/35 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md">
            Featured Case Study
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 p-5 sm:p-7 lg:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {category}
              </span>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {formatYear(project.year)}
              </span>
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-3xl font-semibold leading-tight transition-colors duration-200 group-hover:text-slate-600 dark:group-hover:text-white">
                {project.title}
              </h2>
              <p className="text-base leading-relaxed text-[var(--muted)]">
                {project.short_desc ||
                  'A selected drafting study focused on clear technical presentation and architectural communication.'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <dl className="grid gap-4 border-y border-[var(--border)] py-4 sm:grid-cols-3">
              <Meta label="Role" value="Drafting + Visualization" />
              <Meta label="Tools" value={tools} />
              <Meta label="Year" value={formatYear(project.year)} />
            </dl>
            <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-200 group-hover:border-slate-500">
              View Case Study
              <ArrowUpRight
                aria-hidden="true"
                size={16}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="font-mono text-[9px] uppercase tracking-[0.26em] text-[var(--muted)]">
        {label}
      </dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  )
}

function formatTag(tag: string) {
  return tag
    .split('-')
    .map((part) =>
      part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(' ')
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
