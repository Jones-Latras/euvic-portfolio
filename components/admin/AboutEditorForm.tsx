'use client'

import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FileText, ImagePlus, Plus, Save, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { STORAGE_BUCKETS } from '@/lib/constants'
import type { About, Education, Skill } from '@/lib/supabase/types'

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

type EducationRow = Education & { localId: string }
type SkillRow = Skill & { localId: string }

export function AboutEditorForm({
  about,
  education,
  skills,
}: {
  about: About
  education: Education[]
  skills: Skill[]
}) {
  const photoInputRef = useRef<HTMLInputElement>(null)
  const cvInputRef = useRef<HTMLInputElement>(null)
  const [bio, setBio] = useState(about.bio || '')
  const [photoUrl, setPhotoUrl] = useState(about.photo_url || '')
  const [cvUrl, setCvUrl] = useState(about.cv_url || '')
  const [educationRows, setEducationRows] = useState<EducationRow[]>(
    education.map((item) => ({ ...item, localId: item.id || crypto.randomUUID() }))
  )
  const [skillRows, setSkillRows] = useState<SkillRow[]>(
    skills.map((item) => ({ ...item, localId: item.id || crypto.randomUUID() }))
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function uploadProfileFile(file: File | undefined, type: 'photo' | 'cv') {
    if (!file) return
    setMessage('')

    const validPhoto = type === 'photo' && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    const validCv = type === 'cv' && file.type === 'application/pdf'
    if (!validPhoto && !validCv) {
      setMessage(type === 'photo' ? 'Use a JPG, PNG, or WEBP image.' : 'Use a PDF file.')
      return
    }

    if (!hasSupabaseEnv) {
      setMessage('Supabase credentials are not configured yet.')
      return
    }

    const supabase = createClient()
    const path = type === 'photo' ? `photo-${crypto.randomUUID()}-${file.name}` : 'cv.pdf'
    const { error } = await supabase.storage.from(STORAGE_BUCKETS.profile).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    const { data } = supabase.storage.from(STORAGE_BUCKETS.profile).getPublicUrl(path)
    if (type === 'photo') setPhotoUrl(data.publicUrl)
    else setCvUrl(data.publicUrl)
  }

  async function save() {
    setSaving(true)
    setMessage('')

    if (!hasSupabaseEnv) {
      setSaving(false)
      setMessage('Supabase credentials are not configured yet.')
      return
    }

    const supabase = createClient()
    const { error: aboutError } = await supabase.from('about').upsert({
      id: about.id,
      bio,
      photo_url: photoUrl || null,
      cv_url: cvUrl || null,
      updated_at: new Date().toISOString(),
    } as never)

    if (aboutError) {
      setSaving(false)
      setMessage(aboutError.message)
      return
    }

    await supabase.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    const educationPayload = educationRows
      .filter((item) => item.institution.trim() && item.program.trim())
      .map((item, index) => ({
        institution: item.institution,
        program: item.program,
        start_year: item.start_year || null,
        end_year: item.end_year || null,
        gpa: item.gpa || null,
        sort_order: index,
      }))
    if (educationPayload.length) {
      await supabase.from('education').insert(educationPayload as never)
    }

    await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    const skillPayload = skillRows
      .filter((item) => item.name.trim() && item.category.trim())
      .map((item, index) => ({
        name: item.name,
        category: item.category,
        level: item.level || 1,
        icon_slug: item.icon_slug || null,
        sort_order: index,
      }))
    if (skillPayload.length) {
      await supabase.from('skills').insert(skillPayload as never)
    }

    setSaving(false)
    setMessage('About page saved.')
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: ['/about'] }),
    }).catch(() => undefined)
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-5 border border-[var(--border)] bg-[var(--surface)] p-5 lg:grid-cols-[16rem_1fr]">
        <div className="space-y-3">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => void uploadProfileFile(event.target.files?.[0], 'photo')}
          />
          <div className="relative h-[200px] w-[200px] overflow-hidden rounded-full bg-slate-200">
            {photoUrl ? <Image src={photoUrl} alt="Profile preview" fill sizes="200px" className="object-cover" /> : null}
          </div>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="focus-ring inline-flex min-h-11 items-center gap-2 border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
          >
            <ImagePlus aria-hidden="true" size={16} />
            Profile Photo
          </button>
          <input
            ref={cvInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => void uploadProfileFile(event.target.files?.[0], 'cv')}
          />
          <button
            type="button"
            onClick={() => cvInputRef.current?.click()}
            className="focus-ring inline-flex min-h-11 items-center gap-2 border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
          >
            <FileText aria-hidden="true" size={16} />
            CV PDF
          </button>
          {cvUrl ? <p className="break-all text-xs text-[var(--muted)]">{cvUrl}</p> : null}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-semibold">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={14}
              className="focus-ring w-full border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm leading-relaxed transition-all duration-150 ease-in-out hover:border-slate-500"
            />
          </div>
          <div className="min-h-80 border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="max-w-prose text-sm leading-relaxed text-[var(--muted)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{bio}</ReactMarkdown>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 border border-[var(--border)] bg-[var(--surface)] p-5">
        <RowHeader title="Education" onAdd={() => setEducationRows((rows) => [...rows, blankEducation()])} />
        <div className="space-y-3">
          {educationRows.map((item, index) => (
            <div key={item.localId} className="grid gap-3 lg:grid-cols-[1fr_1fr_8rem_8rem_6rem_auto]">
              <Input value={item.institution} onChange={(value) => updateEducation(index, 'institution', value)} placeholder="Institution" />
              <Input value={item.program} onChange={(value) => updateEducation(index, 'program', value)} placeholder="Program" />
              <Input value={item.start_year || ''} onChange={(value) => updateEducation(index, 'start_year', value)} placeholder="Start" />
              <Input value={item.end_year || ''} onChange={(value) => updateEducation(index, 'end_year', value)} placeholder="End" />
              <Input value={item.gpa || ''} onChange={(value) => updateEducation(index, 'gpa', value)} placeholder="GPA" />
              <DeleteButton onClick={() => setEducationRows((rows) => rows.filter((row) => row.localId !== item.localId))} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 border border-[var(--border)] bg-[var(--surface)] p-5">
        <RowHeader title="Skills" onAdd={() => setSkillRows((rows) => [...rows, blankSkill()])} />
        <div className="space-y-3">
          {skillRows.map((item, index) => (
            <div key={item.localId} className="grid gap-3 lg:grid-cols-[1fr_1fr_7rem_1fr_auto]">
              <Input value={item.name} onChange={(value) => updateSkill(index, 'name', value)} placeholder="Name" />
              <Input value={item.category} onChange={(value) => updateSkill(index, 'category', value)} placeholder="Category" />
              <select
                value={item.level || 1}
                onChange={(event) => updateSkill(index, 'level', Number(event.target.value))}
                className="focus-ring min-h-11 border border-[var(--border)] bg-[var(--background)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <Input value={item.icon_slug || ''} onChange={(value) => updateSkill(index, 'icon_slug', value)} placeholder="Icon slug" />
              <DeleteButton onClick={() => setSkillRows((rows) => rows.filter((row) => row.localId !== item.localId))} />
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--foreground)] bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--background)] transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save aria-hidden="true" size={16} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
        {message ? <p role="status" className="text-sm leading-relaxed text-[var(--muted)]">{message}</p> : null}
      </div>
    </div>
  )

  function updateEducation<K extends keyof EducationRow>(index: number, key: K, value: EducationRow[K]) {
    setEducationRows((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)))
  }

  function updateSkill<K extends keyof SkillRow>(index: number, key: K, value: SkillRow[K]) {
    setSkillRows((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)))
  }
}

function RowHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <button
        type="button"
        onClick={onAdd}
        className="focus-ring inline-flex min-h-11 items-center gap-2 border border-[var(--border)] px-3 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
      >
        <Plus aria-hidden="true" size={16} />
        Add
      </button>
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="focus-ring min-h-11 border border-[var(--border)] bg-[var(--background)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
    />
  )
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] transition-all duration-150 ease-in-out hover:border-red-500 hover:text-red-600 active:scale-95"
      aria-label="Delete row"
    >
      <Trash2 aria-hidden="true" size={16} />
    </button>
  )
}

function blankEducation(): EducationRow {
  return {
    id: crypto.randomUUID(),
    localId: crypto.randomUUID(),
    institution: '',
    program: '',
    start_year: '',
    end_year: '',
    gpa: '',
    sort_order: 0,
  }
}

function blankSkill(): SkillRow {
  return {
    id: crypto.randomUUID(),
    localId: crypto.randomUUID(),
    name: '',
    category: '',
    level: 3,
    icon_slug: '',
    sort_order: 0,
  }
}
