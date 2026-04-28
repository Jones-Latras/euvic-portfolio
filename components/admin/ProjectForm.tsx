'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Save, Trash2, Upload } from 'lucide-react'
import { PROJECT_CATEGORIES, PROJECT_TAGS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/lib/supabase/types'
import { slugify } from '@/lib/utils'
import { ImageUploader } from './ImageUploader'
import { queueToast, useToast } from '@/components/ui/Toast'

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const schema = z.object({
  title: z.string().min(2, 'Title is required.'),
  slug: z.string().min(2, 'Slug is required.'),
  short_desc: z.string().max(160, 'Keep the short description under 160 characters.').optional(),
  category: z.string().min(1, 'Choose a category.'),
  tags: z.array(z.string()),
  year: z.string().optional(),
  description: z.string().optional(),
  is_featured: z.boolean(),
})

type ProjectFields = z.infer<typeof schema>
type SpecRow = { id: string; key: string; value: string }

export function ProjectForm({
  projectId,
  initialProject,
}: {
  projectId: string
  initialProject?: Project | null
}) {
  const router = useRouter()
  const { showToast } = useToast()
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null)
  const [slugTouched, setSlugTouched] = useState(Boolean(initialProject?.slug))
  const [images, setImages] = useState<string[]>(initialProject?.images ?? [])
  const [coverImage, setCoverImage] = useState(initialProject?.cover_image ?? '')
  const [pdfUrl, setPdfUrl] = useState(initialProject?.pdf_url ?? '')
  const [specs, setSpecs] = useState<SpecRow[]>(() => {
    const value = initialProject?.tech_specs
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return [{ id: crypto.randomUUID(), key: '', value: '' }]
    }
    return Object.entries(value).map(([key, specValue]) => ({
      id: crypto.randomUUID(),
      key,
      value: String(specValue ?? ''),
    }))
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialProject?.title ?? '',
      slug: initialProject?.slug ?? '',
      short_desc: initialProject?.short_desc ?? '',
      category: initialProject?.category ?? PROJECT_CATEGORIES[0].value,
      tags: initialProject?.tags ?? [],
      year: initialProject?.year ?? '',
      description: initialProject?.description ?? '',
      is_featured: Boolean(initialProject?.is_featured),
    },
  })

  const shortDesc = watch('short_desc') || ''
  const description = watch('description') || ''
  const isEditing = Boolean(initialProject)

  const specObject = useMemo(
    () =>
      Object.fromEntries(
        specs
          .filter((spec) => spec.key.trim() && spec.value.trim())
          .map((spec) => [spec.key.trim(), spec.value.trim()])
      ),
    [specs]
  )

  function updateTitle(title: string) {
    setValue('title', title, { shouldValidate: true })
    if (!slugTouched) {
      setValue('slug', slugify(title), { shouldValidate: true })
    }
  }

  async function ensureUniqueSlug(slug: string) {
    if (!hasSupabaseEnv || !slug) return
    const supabase = createClient()
    const { data } = await supabase.from('projects').select('id, slug').eq('slug', slug).maybeSingle()
    const existing = data as Pick<Project, 'id' | 'slug'> | null
    if (existing && existing.id !== initialProject?.id) {
      setValue('slug', `${slug}-${Date.now().toString().slice(-4)}`, { shouldValidate: true })
    }
  }

  async function save(values: ProjectFields, publish: boolean) {
    setMessage('')
    setSaving(publish ? 'publish' : 'draft')

    if (!hasSupabaseEnv) {
      setSaving(null)
      setMessage('Supabase credentials are not configured yet.')
      showToast('Supabase credentials are not configured yet.', 'error')
      return
    }

    const payload = {
      id: projectId,
      title: values.title,
      slug: values.slug,
      short_desc: values.short_desc || null,
      category: values.category,
      tags: values.tags,
      year: values.year || null,
      description: values.description || null,
      tech_specs: specObject,
      cover_image: coverImage || images[0] || null,
      images,
      pdf_url: pdfUrl || null,
      is_featured: values.is_featured,
      is_published: publish,
    }

    const supabase = createClient()
    const { error } = isEditing
      ? await supabase.from('projects').update(payload as never).eq('id', projectId)
      : await supabase.from('projects').insert(payload as never)

    setSaving(null)
    if (error) {
      setMessage(error.message)
      showToast(error.message, 'error')
      return
    }

    queueToast('Project saved.', 'success')
    router.push('/admin/projects')
    router.refresh()
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit((values) => save(values, false))}>
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">Project Form</p>
        <h1 className="mt-2 text-3xl font-semibold">{isEditing ? 'Edit Project' : 'New Project'}</h1>
      </div>

      <section className="grid gap-5 border border-[var(--border)] bg-[var(--surface)] p-5 md:grid-cols-2">
        <Field label="Title" error={errors.title?.message}>
          <input
            id="title"
            type="text"
            className="focus-ring min-h-11 w-full border border-[var(--border)] bg-[var(--background)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
            {...register('title', { onChange: (event) => updateTitle(event.target.value) })}
          />
        </Field>
        <Field label="Slug" error={errors.slug?.message}>
          <input
            id="slug"
            type="text"
            className="focus-ring min-h-11 w-full border border-[var(--border)] bg-[var(--background)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
            {...register('slug', {
              onChange: () => setSlugTouched(true),
              onBlur: (event) => void ensureUniqueSlug(event.target.value),
            })}
          />
        </Field>
        <Field label="Category" error={errors.category?.message}>
          <select
            id="category"
            className="focus-ring min-h-11 w-full border border-[var(--border)] bg-[var(--background)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
            {...register('category')}
          >
            {PROJECT_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Year / Semester">
          <input
            id="year"
            type="text"
            className="focus-ring min-h-11 w-full border border-[var(--border)] bg-[var(--background)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
            {...register('year')}
          />
        </Field>
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="short_desc" className="text-sm font-semibold">
              Short Description
            </label>
            <span className="font-mono text-xs text-[var(--muted)]">{shortDesc.length}/160</span>
          </div>
          <textarea
            id="short_desc"
            rows={3}
            className="focus-ring w-full border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm leading-relaxed transition-all duration-150 ease-in-out hover:border-slate-500"
            {...register('short_desc')}
          />
          {errors.short_desc?.message ? (
            <p className="text-sm text-red-600 dark:text-red-300">{errors.short_desc.message}</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-4 border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold">Tags</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECT_TAGS.map((tag) => (
            <label key={tag} className="flex min-h-11 items-center gap-2 border border-[var(--border)] px-3 text-sm">
              <input type="checkbox" value={tag} {...register('tags')} />
              {tag}
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-5 border border-[var(--border)] bg-[var(--surface)] p-5 lg:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-semibold">
            Full Description
          </label>
          <textarea
            id="description"
            rows={14}
            className="focus-ring w-full border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm leading-relaxed transition-all duration-150 ease-in-out hover:border-slate-500"
            {...register('description')}
          />
        </div>
        <div className="min-h-80 border border-[var(--border)] bg-[var(--background)] p-4">
          <div className="max-w-prose text-sm leading-relaxed text-[var(--muted)]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
          </div>
        </div>
      </section>

      <section className="space-y-4 border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Technical Specs</h2>
          <button
            type="button"
            onClick={() => setSpecs((current) => [...current, { id: crypto.randomUUID(), key: '', value: '' }])}
            className="focus-ring inline-flex min-h-11 items-center gap-2 border border-[var(--border)] px-3 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
          >
            <Plus aria-hidden="true" size={16} />
            Add Spec
          </button>
        </div>
        <div className="space-y-3">
          {specs.map((spec) => (
            <div key={spec.id} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                type="text"
                value={spec.key}
                onChange={(event) =>
                  setSpecs((current) =>
                    current.map((item) => (item.id === spec.id ? { ...item, key: event.target.value } : item))
                  )
                }
                className="focus-ring min-h-11 border border-[var(--border)] bg-[var(--background)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(event) =>
                  setSpecs((current) =>
                    current.map((item) => (item.id === spec.id ? { ...item, value: event.target.value } : item))
                  )
                }
                className="focus-ring min-h-11 border border-[var(--border)] bg-[var(--background)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
              />
              <button
                type="button"
                onClick={() => setSpecs((current) => current.filter((item) => item.id !== spec.id))}
                className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
                aria-label="Remove spec"
              >
                <Trash2 aria-hidden="true" size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold">Files</h2>
        <ImageUploader
          projectId={projectId}
          images={images}
          coverImage={coverImage}
          pdfUrl={pdfUrl}
          onImagesChange={setImages}
          onCoverChange={setCoverImage}
          onPdfChange={setPdfUrl}
        />
      </section>

      <section className="flex flex-col gap-3 border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
          <input type="checkbox" {...register('is_featured')} />
          Featured
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={Boolean(saving)}
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--border)] px-5 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save aria-hidden="true" size={16} />
            {saving === 'draft' ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            disabled={Boolean(saving)}
            onClick={handleSubmit((values) => save(values, true))}
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--foreground)] bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--background)] transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload aria-hidden="true" size={16} />
            {saving === 'publish' ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </section>

      {message ? <p role="status" className="text-sm leading-relaxed text-[var(--muted)]">{message}</p> : null}
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      {children}
      {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  )
}
