'use client'

import Image from 'next/image'
import { ImagePlus, Save } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { STORAGE_BUCKETS } from '@/lib/constants'
import type { Project } from '@/lib/supabase/types'
import { useToast } from '@/components/ui/Toast'
import { ImageCropDialog } from '@/components/admin/ImageCropDialog'

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

type SettingsFields = {
  student_name: string
  tagline: string
  email: string
  contact_number: string
  linkedin_url: string
  behance_url: string
  github_url: string
  seo_title: string
  seo_description: string
  hero_image_url: string
  seo_og_image: string
}

export function SiteSettingsForm({
  settings,
  projects,
}: {
  settings: SettingsFields
  projects: Project[]
}) {
  const heroInputRef = useRef<HTMLInputElement>(null)
  const ogInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const { showToast } = useToast()
  const [heroImage, setHeroImage] = useState(settings.hero_image_url || '')
  const [ogImage, setOgImage] = useState(settings.seo_og_image || '')
  const [pendingCrop, setPendingCrop] = useState<{
    file: File
    key: 'hero_image_url' | 'seo_og_image'
  } | null>(null)
  const [featuredIds, setFeaturedIds] = useState(
    projects.filter((project) => project.is_featured).map((project) => project.id).slice(0, 3)
  )
  const { register, handleSubmit } = useForm<SettingsFields>({
    defaultValues: settings,
  })

  async function uploadAsset(file: File | undefined, key: 'hero_image_url' | 'seo_og_image') {
    if (!file) return
    setMessage('')

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage('Use a JPG, PNG, or WEBP image.')
      showToast('Use a JPG, PNG, or WEBP image.', 'error')
      return
    }

    if (!hasSupabaseEnv) {
      setMessage('Supabase credentials are not configured yet.')
      showToast('Supabase credentials are not configured yet.', 'error')
      return
    }

    const supabase = createClient()
    const path = `${key}-${crypto.randomUUID()}-${file.name}`
    const { error } = await supabase.storage.from(STORAGE_BUCKETS.siteAssets).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

    if (error) {
      setMessage(error.message)
      showToast(error.message, 'error')
      return
    }

    const { data } = supabase.storage.from(STORAGE_BUCKETS.siteAssets).getPublicUrl(path)
    if (key === 'hero_image_url') setHeroImage(data.publicUrl)
    else setOgImage(data.publicUrl)
  }

  function selectAssetFile(file: File | undefined, key: 'hero_image_url' | 'seo_og_image') {
    if (!file) return
    setMessage('')

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage('Use a JPG, PNG, or WEBP image.')
      showToast('Use a JPG, PNG, or WEBP image.', 'error')
      resetFileInput(key)
      return
    }

    setPendingCrop({ file, key })
  }

  function resetFileInput(key: 'hero_image_url' | 'seo_og_image') {
    const input = key === 'hero_image_url' ? heroInputRef.current : ogInputRef.current
    if (input) input.value = ''
  }

  function toggleFeatured(projectId: string) {
    setFeaturedIds((current) => {
      if (current.includes(projectId)) return current.filter((id) => id !== projectId)
      if (current.length >= 3) return current
      return [...current, projectId]
    })
  }

  async function save(values: SettingsFields) {
    setSaving(true)
    setMessage('')

    if (!hasSupabaseEnv) {
      setSaving(false)
      setMessage('Supabase credentials are not configured yet.')
      showToast('Supabase credentials are not configured yet.', 'error')
      return
    }

    const supabase = createClient()
    const entries = {
      ...values,
      hero_image_url: heroImage,
      seo_og_image: ogImage,
    }
    const { error: settingsError } = await supabase.rpc('save_site_settings', {
      settings_payload: entries,
      featured_project_ids: featuredIds,
    } as never)

    if (settingsError) {
      setSaving(false)
      setMessage(settingsError.message)
      showToast(settingsError.message, 'error')
      return
    }

    setSaving(false)
    setMessage('Settings saved.')
    showToast('Settings saved.', 'success')
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: ['/', '/projects', '/about', '/contact'] }),
    }).catch(() => undefined)
  }

  return (
    <form onSubmit={handleSubmit(save)} className="space-y-8">
      {pendingCrop ? (
        <ImageCropDialog
          file={pendingCrop.file}
          title={pendingCrop.key === 'hero_image_url' ? 'Crop Hero Image' : 'Crop SEO OG Image'}
          onCancel={() => {
            resetFileInput(pendingCrop.key)
            setPendingCrop(null)
          }}
          onCrop={(file) => {
            const key = pendingCrop.key
            resetFileInput(key)
            setPendingCrop(null)
            void uploadAsset(file, key)
          }}
        />
      ) : null}
      <section className="grid gap-5 border border-[var(--border)] bg-[var(--surface)] p-5 md:grid-cols-2">
        <TextField label="Student Name" id="student_name" register={register('student_name')} />
        <TextField label="Tagline" id="tagline" register={register('tagline')} />
        <TextField label="Email" id="email" type="email" register={register('email')} />
        <TextField label="Contact Number" id="contact_number" type="tel" register={register('contact_number')} />
        <TextField label="LinkedIn URL" id="linkedin_url" register={register('linkedin_url')} />
        <TextField label="Behance URL" id="behance_url" register={register('behance_url')} />
        <TextField label="GitHub URL" id="github_url" register={register('github_url')} />
      </section>

      <section className="grid gap-5 border border-[var(--border)] bg-[var(--surface)] p-5 md:grid-cols-2">
        <AssetPicker
          title="Hero Image"
          image={heroImage}
          inputRef={heroInputRef}
          onFile={(file) => selectAssetFile(file, 'hero_image_url')}
        />
        <AssetPicker
          title="SEO OG Image"
          image={ogImage}
          inputRef={ogInputRef}
          onFile={(file) => selectAssetFile(file, 'seo_og_image')}
        />
      </section>

      <section className="space-y-4 border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold">Featured Projects</h2>
        <p className="max-w-prose text-sm leading-relaxed text-[var(--muted)]">
          Select up to 3 published projects.
        </p>
        <div className="grid gap-2 md:grid-cols-2">
          {projects
            .filter((project) => project.is_published)
            .map((project) => (
              <label key={project.id} className="flex min-h-11 items-center gap-2 border border-[var(--border)] px-3 text-sm">
                <input
                  type="checkbox"
                  checked={featuredIds.includes(project.id)}
                  onChange={() => toggleFeatured(project.id)}
                />
                {project.title}
              </label>
            ))}
        </div>
      </section>

      <section className="grid gap-5 border border-[var(--border)] bg-[var(--surface)] p-5">
        <TextField label="SEO Title" id="seo_title" register={register('seo_title')} />
        <div className="space-y-2">
          <label htmlFor="seo_description" className="text-sm font-semibold">
            SEO Description
          </label>
          <textarea
            id="seo_description"
            rows={4}
            className="focus-ring w-full border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm leading-relaxed transition-all duration-150 ease-in-out hover:border-slate-500"
            {...register('seo_description')}
          />
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={saving}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--foreground)] bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--background)] transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save aria-hidden="true" size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {message ? <p role="status" className="text-sm leading-relaxed text-[var(--muted)]">{message}</p> : null}
      </div>
    </form>
  )
}

function TextField({
  label,
  id,
  type = 'text',
  register,
}: {
  label: string
  id: string
  type?: string
  register: Record<string, unknown>
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="focus-ring min-h-11 w-full border border-[var(--border)] bg-[var(--background)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
        {...register}
      />
    </div>
  )
}

function AssetPicker({
  title,
  image,
  inputRef,
  onFile,
}: {
  title: string
  image: string
  inputRef: React.RefObject<HTMLInputElement | null>
  onFile: (file?: File) => void
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => onFile(event.target.files?.[0])}
      />
      <div className="relative aspect-[16/9] bg-slate-200">
        {image ? (
          <Image src={image} alt={`${title} preview`} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="focus-ring inline-flex min-h-11 items-center gap-2 border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
      >
        <ImagePlus aria-hidden="true" size={16} />
        Choose Image
      </button>
    </div>
  )
}
