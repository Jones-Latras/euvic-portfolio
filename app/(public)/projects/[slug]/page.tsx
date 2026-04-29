import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, Download } from 'lucide-react'
import { ViewTracker } from '@/components/projects/ViewTracker'
import { LightboxGallery } from '@/components/projects/LightboxGallery'
import { PROJECT_CATEGORIES } from '@/lib/constants'
import { fallbackProjects, getProjectBySlug, getProjects } from '@/lib/data'
import { absoluteUrl, cn } from '@/lib/utils'

export const revalidate = 1800

export async function generateStaticParams() {
  return fallbackProjects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}

  return {
    title: project.title,
    description: project.short_desc || undefined,
    openGraph: {
      title: project.title,
      description: project.short_desc || undefined,
      images: absoluteUrl(project.cover_image) ? [absoluteUrl(project.cover_image)!] : undefined,
    },
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [project, projects] = await Promise.all([getProjectBySlug(slug), getProjects()])
  if (!project) notFound()

  const projectIndex = projects.findIndex((item) => item.slug === project.slug)
  const previousProject = projectIndex > 0 ? projects[projectIndex - 1] : null
  const nextProject =
    projectIndex >= 0 && projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null
  const category =
    PROJECT_CATEGORIES.find((item) => item.value === project.category)?.label ?? project.category
  const specs =
    project.tech_specs && !Array.isArray(project.tech_specs) && typeof project.tech_specs === 'object'
      ? Object.entries(project.tech_specs)
      : []

  return (
    <article>
      <ViewTracker slug={project.slug} />
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <Link
            href="/projects"
            className="focus-ring inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--muted)] transition-all duration-150 ease-in-out hover:text-[var(--foreground)] active:scale-95"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back to Gallery
          </Link>
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div className="space-y-5">
              <span className="inline-flex border border-[var(--border)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {category}
              </span>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
                {project.title}
              </h1>
              <p className="max-w-prose text-base leading-relaxed text-[var(--muted)]">
                {project.short_desc}
              </p>
            </div>
            <div className="space-y-3 border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">
                Year
              </p>
              <p className="font-semibold">{project.year || 'N/A'}</p>
              {project.tags?.length ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <section className="relative aspect-[16/9] min-h-72 w-full bg-slate-200">
        <Image
          src={project.cover_image || '/placeholder.svg'}
          alt={`${project.title} primary image`}
          fill
          sizes="100vw"
          priority
          quality={85}
          className="object-cover"
        />
      </section>
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="max-w-prose text-base leading-relaxed text-[var(--muted)]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h3 className="mt-8 text-2xl font-semibold text-[var(--foreground)]">
                    {children}
                  </h3>
                ),
                h2: ({ children }) => (
                  <h3 className="mt-8 text-2xl font-semibold text-[var(--foreground)]">
                    {children}
                  </h3>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-8 text-2xl font-semibold text-[var(--foreground)]">
                    {children}
                  </h3>
                ),
              }}
            >
              {project.description || ''}
            </ReactMarkdown>
          </div>
          <aside className="space-y-6">
            {specs.length ? (
              <div className="border border-[var(--border)] bg-[var(--surface)]">
                <h2 className="border-b border-[var(--border)] px-5 py-4 text-sm font-semibold">
                  Technical Specs
                </h2>
                <dl className="divide-y divide-[var(--border)]">
                  {specs.map(([key, value]) => (
                    <div key={key} className="grid grid-cols-[8rem_1fr] gap-4 px-5 py-3">
                      <dt className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">
                        {key}
                      </dt>
                      <dd className="text-sm">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
            {project.pdf_url ? (
              <Link
                href={project.pdf_url}
                className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 border border-accent bg-accent px-5 text-sm font-semibold text-white transition-all duration-150 ease-in-out hover:bg-accent-light active:scale-95"
              >
                <Download aria-hidden="true" size={16} />
                Download Drawing Set
              </Link>
            ) : null}
          </aside>
        </div>
      </section>
      {project.images?.length ? (
        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <LightboxGallery title={project.title} images={project.images} />
        </section>
      ) : null}
      <ProjectNeighborNav previousProject={previousProject} nextProject={nextProject} />
    </article>
  )
}

function ProjectNeighborNav({
  previousProject,
  nextProject,
}: {
  previousProject: Awaited<ReturnType<typeof getProjects>>[number] | null
  nextProject: Awaited<ReturnType<typeof getProjects>>[number] | null
}) {
  if (!previousProject && !nextProject) return null

  return (
    <nav
      aria-label="Adjacent projects"
      className="border-t border-[var(--border)] px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2">
        <AdjacentProjectLink project={previousProject} direction="previous" />
        <AdjacentProjectLink project={nextProject} direction="next" />
      </div>
    </nav>
  )
}

function AdjacentProjectLink({
  project,
  direction,
}: {
  project: Awaited<ReturnType<typeof getProjects>>[number] | null
  direction: 'previous' | 'next'
}) {
  if (!project) return <div aria-hidden="true" />

  const isNext = direction === 'next'

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        'focus-ring group flex min-h-24 flex-col justify-center border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-[0.99]',
        isNext && 'sm:text-right'
      )}
    >
      <span
        className={cn(
          'mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]',
          isNext && 'sm:justify-end'
        )}
      >
        {!isNext ? <ArrowLeft aria-hidden="true" size={14} /> : null}
        {isNext ? 'Next Project' : 'Previous Project'}
        {isNext ? <ArrowRight aria-hidden="true" size={14} /> : null}
      </span>
      <span className="text-base font-semibold">{project.title}</span>
    </Link>
  )
}
