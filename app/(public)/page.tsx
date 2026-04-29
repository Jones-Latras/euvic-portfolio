import Image from 'next/image'
import Link from 'next/link'
import { DraftingCompass, Layers, PenTool, Ruler, Shapes, View } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { getFeaturedProjects, getSettings } from '@/lib/data'
import type { Metadata } from 'next'

export const revalidate = 3600

const skills = [
  { label: 'AutoCAD', icon: Ruler },
  { label: 'Revit', icon: Layers },
  { label: 'SketchUp', icon: Shapes },
  { label: 'ArchiCAD', icon: DraftingCompass },
  { label: 'Adobe Suite', icon: View },
  { label: 'Hand Drafting', icon: PenTool },
]

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: settings.seo_title || 'Portfolio | Architectural Design',
    description: settings.seo_description || 'Showcasing architectural drafting and design work.',
    openGraph: {
      title: settings.seo_title || 'Portfolio | Architectural Design',
      description: settings.seo_description || 'Showcasing architectural drafting and design work.',
      images: settings.seo_og_image ? [settings.seo_og_image] : undefined,
    },
    alternates: {
      canonical: '/',
    },
  }
}

export default async function HomePage() {
  const [settings, projects] = await Promise.all([getSettings(), getFeaturedProjects()])
  const heroImage = settings.hero_image_url || ''
  const valueStatement =
    'Residential plans, 3D visualization, and space planning with clean technical precision.'

  return (
    <>
      <section className="relative min-h-[calc(100vh-74px)] overflow-hidden">
        <Image
          src={heroImage}
          alt="Architectural portfolio hero image"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,14,25,0.88)_0%,rgba(9,14,25,0.68)_38%,rgba(9,14,25,0.28)_70%,rgba(9,14,25,0.12)_100%)]" />
        <div className="blueprint-grid absolute inset-0 opacity-25" />
        <div className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/65 lg:flex">
          <span className="[writing-mode:vertical-rl]">Scroll</span>
          <span aria-hidden="true" className="h-8 w-px bg-white/45" />
        </div>
        <div className="absolute bottom-16 right-4 hidden font-mono text-[10px] uppercase tracking-[0.24em] text-white/60 sm:right-6 lg:right-8 lg:block">
          Residential / Commercial / Drafting
        </div>
        <div className="relative mx-auto flex min-h-[calc(100vh-74px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid max-w-[720px] grid-cols-[1px_minmax(0,1fr)] gap-6 text-white lg:-translate-y-10 lg:gap-8">
            <div className="mt-2 h-full min-h-72 bg-white/35" aria-hidden="true" />
            <div className="space-y-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate-200 sm:text-xs">
                Architectural Drafting Portfolio
              </p>
              <div className="space-y-4">
                <h1 className="whitespace-nowrap font-display text-[clamp(2.75rem,5.7vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
                  {settings.student_name || 'Your Name'}
                </h1>
                <div className="space-y-3">
                  <p className="font-display text-xl font-medium leading-snug text-slate-50 sm:text-2xl">
                    {settings.tagline || 'Architectural Drafting & Design'}
                  </p>
                  <p className="max-w-[620px] text-base leading-relaxed text-slate-200 sm:text-lg">
                    {valueStatement}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <ButtonLink href="/projects">View Projects</ButtonLink>
                <ButtonLink href={settings.cv_url || '/about'} variant="secondary">
                  Download CV
                </ButtonLink>
              </div>
              <div className="flex flex-wrap gap-3 pt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-white/70">
                <span>Selected Works 2024-2026</span>
                <span className="hidden sm:inline">/</span>
                <span>Technical Presentation Boards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {projects.length ? (
        <section className="bg-[var(--background)] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">
                  Selected Works
                </p>
                <h2 className="font-display text-3xl font-semibold">Featured Projects</h2>
              </div>
              <Link
                href="/projects"
                className="focus-ring inline-flex min-h-11 items-center text-sm font-semibold text-[var(--foreground)] transition-all duration-150 ease-in-out hover:text-slate-600 active:scale-95 dark:hover:text-slate-300"
              >
                View All Projects
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-y border-[var(--border)] bg-[var(--surface)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="scroll-fade-in mx-auto flex max-w-7xl gap-3 overflow-x-auto">
          {skills.map((skill) => {
            const Icon = skill.icon
            return (
              <div
                key={skill.label}
                className="flex min-h-11 shrink-0 items-center gap-2 border border-[var(--border)] px-4 text-sm font-semibold"
              >
                <Icon aria-hidden="true" size={17} />
                {skill.label}
              </div>
            )
          })}
        </div>
      </section>

      {settings.quote_1_text ? (
        <section className="bg-[var(--background)] px-4 py-16 sm:px-6 lg:px-8">
          <figure className="mx-auto max-w-3xl space-y-5">
            <blockquote className="text-2xl font-semibold leading-snug sm:text-3xl">
              &ldquo;{settings.quote_1_text}&rdquo;
            </blockquote>
            {settings.quote_1_author ? (
              <figcaption className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">
                {settings.quote_1_author}
              </figcaption>
            ) : null}
          </figure>
        </section>
      ) : null}
    </>
  )
}
