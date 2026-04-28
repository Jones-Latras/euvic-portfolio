'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
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

type MenuOption = {
  label: string
  value: string
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
  const sortValue = sort || 'newest'
  const hasFilters = Boolean(category || tag || sort)

  const typeOptions: MenuOption[] = [
    { label: 'All Types', value: 'all' },
    ...PROJECT_CATEGORIES.map((item) => ({ label: item.label, value: item.value })),
  ]
  const toolOptions: MenuOption[] = [
    { label: 'Tools', value: 'all' },
    ...PROJECT_TAGS.map((item) => ({ label: tagLabels[item] ?? item, value: item })),
  ]
  const sortOptions: MenuOption[] = [
    { label: 'Sort: Newest', value: 'newest' },
    { label: 'Sort: Oldest', value: 'oldest' },
    { label: 'Sort: A-Z', value: 'az' },
  ]

  function pushHref(next: { category?: string; tag?: string; sort?: string }) {
    const params = new URLSearchParams()
    if (next.category) params.set('category', next.category)
    if (next.tag) params.set('tag', next.tag)
    if (next.sort && next.sort !== 'newest') params.set('sort', next.sort)
    const query = params.toString()
    router.push(query ? `/projects?${query}` : '/projects')
  }

  return (
    <section className="border-y border-[var(--border)] py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <SlidersHorizontal aria-hidden="true" size={16} className="text-[var(--muted)]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Gallery
          </p>
          <span className="hidden h-4 w-px bg-[var(--border)] sm:block" aria-hidden="true" />
          <p className="text-sm font-semibold text-[var(--muted)]">
            {total} {total === 1 ? 'Project' : 'Projects'}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FilterMenu
            label="Project type"
            value={category || 'all'}
            options={typeOptions}
            onSelect={(value) =>
              pushHref({
                category: value === 'all' ? undefined : value,
                tag,
                sort: sortValue,
              })
            }
          />
          <FilterMenu
            label="Tools"
            value={tag || 'all'}
            options={toolOptions}
            onSelect={(value) =>
              pushHref({
                category,
                tag: value === 'all' ? undefined : value,
                sort: sortValue,
              })
            }
          />
          <FilterMenu
            label="Sort"
            value={sortValue}
            options={sortOptions}
            onSelect={(value) => pushHref({ category, tag, sort: value })}
          />

          {hasFilters ? (
            <Link
              href="/projects"
              className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--border)] px-3 text-sm font-semibold text-[var(--muted)] transition-all duration-200 ease-out hover:border-slate-500 hover:text-[var(--foreground)] active:scale-95"
            >
              <RotateCcw aria-hidden="true" size={14} />
              Reset
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function FilterMenu({
  label,
  value,
  options,
  onSelect,
}: {
  label: string
  value: string
  options: MenuOption[]
  onSelect: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value) ?? options[0]

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onBlur={(event) => {
          if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
            setOpen(false)
          }
        }}
        className="focus-ring inline-flex min-h-10 w-full items-center justify-between gap-4 rounded-full border border-[var(--border)] bg-transparent px-3.5 text-sm font-semibold text-[var(--foreground)] transition-all duration-200 ease-out hover:border-slate-500 sm:w-auto sm:min-w-40"
      >
        {selected.label}
        <ChevronDown
          aria-hidden="true"
          size={15}
          className={cn(
            'text-[var(--muted)] transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-2xl shadow-slate-950/30"
        >
          {options.map((option) => {
            const active = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setOpen(false)
                  onSelect(option.value)
                }}
                className={cn(
                  'focus-ring flex min-h-10 w-full items-center rounded-lg px-3 text-left text-sm font-semibold transition-all duration-150 ease-out',
                  active
                    ? 'bg-slate-100 text-slate-950 dark:bg-slate-100 dark:text-slate-950'
                    : 'text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]'
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
