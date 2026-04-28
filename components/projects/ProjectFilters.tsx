'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { PROJECT_CATEGORIES, PROJECT_TAGS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function ProjectFilters({
  category,
  tag,
  sort,
}: {
  category?: string
  tag?: string
  sort?: string
}) {
  const router = useRouter()

  function pushHref(href: string) {
    router.push(href)
  }

  return (
    <section className="space-y-4 border-b border-[var(--border)] pb-6">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <SlidersHorizontal aria-hidden="true" size={18} />
        Filters
        {category || tag || sort ? (
          <Link
            href="/projects"
            className="focus-ring ml-auto inline-flex min-h-11 items-center gap-2 border border-[var(--border)] px-3 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
          >
            <RotateCcw aria-hidden="true" size={15} />
            Reset
          </Link>
        ) : null}
      </div>
      <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
        <FilterPill href={buildHref({ category: undefined, tag, sort })} active={!category}>
          All
        </FilterPill>
        {PROJECT_CATEGORIES.map((item) => (
          <FilterPill
            key={item.value}
            href={buildHref({ category: item.value, tag, sort })}
            active={category === item.value}
          >
            {item.label}
          </FilterPill>
        ))}
      </div>
      <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
        {PROJECT_TAGS.map((item) => (
          <FilterPill
            key={item}
            href={buildHref({ category, tag: tag === item ? undefined : item, sort })}
            active={tag === item}
          >
            {item}
          </FilterPill>
        ))}
      </div>
      <label className="block max-w-xs space-y-2">
        <span className="text-sm font-semibold">Sort</span>
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
          className="focus-ring min-h-11 w-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A-Z</option>
        </select>
      </label>
    </section>
  )
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'focus-ring inline-flex min-h-11 shrink-0 items-center border px-4 text-sm font-medium transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95',
        active
          ? 'border-accent bg-accent text-white dark:border-slate-300 dark:bg-slate-200 dark:text-slate-950'
          : 'border-[var(--border)] text-[var(--foreground)]'
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
