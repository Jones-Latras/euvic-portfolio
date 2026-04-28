import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PROJECT_CATEGORIES } from '@/lib/constants'
import type { Project } from '@/lib/supabase/types'
import { formatYear } from '@/lib/utils'
import { SkeletonCard } from '@/components/ui/Skeleton'

function categoryLabel(category: string) {
  return PROJECT_CATEGORIES.find((item) => item.value === category)?.label ?? category
}

export function ProjectCard({
  project,
  variant = 'default',
}: {
  project: Project
  variant?: 'default' | 'featured'
}) {
  const image =
    project.cover_image ||
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=75'
  const category = categoryLabel(project.category)

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="focus-ring group block overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-slate-500 hover:shadow-xl active:scale-[0.99] dark:hover:shadow-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
        <Image
          src={image}
          alt={`${project.title} cover image`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-all duration-200 ease-in-out group-hover:scale-105"
          quality={75}
        />
        {variant === 'featured' ? (
          <div className="absolute left-4 top-4 border border-white/40 bg-slate-950/35 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md">
            Featured
          </div>
        ) : null}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="border border-[var(--border)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            {category}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            size={18}
            className="text-[var(--muted)] transition-all duration-150 ease-in-out group-hover:text-[var(--foreground)]"
          />
        </div>
        <div className="space-y-2">
          <h3 className="line-clamp-2 font-display text-xl font-semibold leading-snug">{project.title}</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            <span>{formatYear(project.year)}</span>
            <span>{category}</span>
            <span>Drafting + Visualization</span>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
            {project.short_desc}
          </p>
        </div>
      </div>
    </Link>
  )
}

ProjectCard.Skeleton = SkeletonCard
