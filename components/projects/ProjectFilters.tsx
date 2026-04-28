'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { PROJECT_CATEGORIES, PROJECT_TAGS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const tagLabels: Record<string, string> = {
  autocad: 'AutoCAD',
  revit: 'Revit',
  sketchup: 'SketchUp',
  'hand-drawn': 'Hand-drawn',
  residential: 'Residential',
  commercial: 'Commercial',
  archicad: 'Archicad',
  'adobe-suite': 'Adobe Suite',
}

export function ProjectFilters({
  category,
  tag,
  sort,
  total,
}: {
  category?: string
  tag?: string
  sort?: string
  total: number
}) {
  const router = useRouter()
  const sortLabel = sort === 'oldest' ? 'Oldest' : sort === 'az' ? 'A-Z' : 'Newest'

  function pushHref(href: string) {
    router.push(href)
  }

  return (
    <section className="space-y-6 border-y border-[var(--border)] py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal aria-hidden="true" size={18} className="text-[var(--muted)]" />
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            Refine Gallery
          </p>
        </div>
        {category || tag || sort ? (
          <Link
            href="/projects"
            className="focus-ring inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[var(--border)] px-4 text-sm font-semibold text-[var(--muted)] transition-all duration-200 ease-out hover:border-slate-500 hover:text-[var(--foreground)] active:scale-95 md:self-auto"
          >
            <RotateCcw aria-hidden="true" size={15} />
            Reset
          </Link>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div className="space-y-5">
          <FilterGroup label="Project Type">
            <FilterPill href={buildHref({ category: undefined, tag, sort })} active={!category} tone="primary">
              All
            </FilterPill>
            {PROJECT_CATEGORIES.map((item) => (
              <FilterPill
                key={item.value}
                href={buildHref({ category: item.value, tag, sort })}
                active={category === item.value}
                tone="primary"
              >
                {item.label}
              </FilterPill>
            ))}
          </FilterGroup>

          <FilterGroup label="Tools / Tags">
            {PROJECT_TAGS.map((item) => (
              <FilterPill
                key={item}
                href={buildHref({ category, tag: tag === item ? undefined : item, sort })}
                active={tag === item}
                tone="secondary"
              >
                {tagLabels[item] ?? item}
              </FilterPill>
            ))}
          </FilterGroup>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/70 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
              {total} {total === 1 ? 'Project' : 'Projects'}
            </p>
            <p className="text-xs font-semibold text-[var(--muted)]">Sort: {sortLabel}</p>
          </div>
          <label className="block space-y-2">
            <span className="sr-only">Sort projects</span>
            <div className="relative">
              <select
                value={sort || 'newest'}
                onChange={(event) => {
                  pushHref(
                    buildHref({
                      category,
                      tag,
                      sort: event.target.value === 'newest' ? undefined : event.target.value,
                    })
                  )
                }}
                className="focus-ring min-h-12 w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--background)] px-4 pr-10 text-sm font-semibold text-[var(--foreground)] transition-all duration-200 ease-out hover:border-slate-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A-Z</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              />
            </div>
          </label>
        </div>
      </div>
    </section>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
        {label}
      </p>
      <div className="flex max-w-full gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
        {children}
      </div>
    </div>
  )
}

function FilterPill({
  href,
  active,
  tone,
  children,
}: {
  href: string
  active: boolean
  tone: 'primary' | 'secondary'
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'focus-ring inline-flex shrink-0 items-center rounded-full border transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0',
        tone === 'primary'
          ? 'min-h-11 px-4 text-sm font-semibold'
          : 'min-h-9 px-3 text-xs font-semibold',
        active
          ? 'border-slate-100 bg-slate-100 text-slate-950 shadow-lg shadow-slate-950/10 hover:bg-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white'
          : 'border-[var(--border)] text-[var(--muted)] hover:border-slate-500 hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
      )}
    >
      {children}
    </Link>
  )
}

function buildHref({
  category,
  tag,
  sort,
}: {
  category?: string
  tag?: string
  sort?: string
}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (tag) params.set('tag', tag)
  if (sort) params.set('sort', sort)
  const query = params.toString()
  return query ? `/projects?${query}` : '/projects'
}
