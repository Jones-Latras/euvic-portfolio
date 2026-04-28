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

  return (
    <>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <Image
          src={heroImage}
          alt="Architectural portfolio hero image"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/50 to-slate-950/20" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6 text-white">
            <p className="font-mono text-xs uppercase tracking-wide text-slate-200">
              Architectural Drafting Portfolio
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {settings.student_name || 'Your Name'}
            </h1>
            <p className="max-w-prose text-lg leading-relaxed text-slate-100">
              {settings.tagline || 'Architectural Drafting & Design'}
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <ButtonLink href="/projects">View My Work</ButtonLink>
              <ButtonLink href={settings.cv_url || '/about'} variant="secondary">
                Download CV
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--background)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">
                Selected Work
              </p>
              <h2 className="text-3xl font-semibold">Featured Projects</h2>
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
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

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
