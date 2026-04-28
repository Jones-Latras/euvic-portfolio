'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Edit, Eye, EyeOff, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/lib/supabase/types'
import { STORAGE_BUCKETS } from '@/lib/constants'

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export function AdminProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  async function togglePublished(project: Project) {
    setMessage('')
    setBusyId(project.id)

    if (!hasSupabaseEnv) {
      setBusyId(null)
      setMessage('Supabase credentials are not configured yet.')
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .update({ is_published: !project.is_published } as never)
      .eq('id', project.id)
    setBusyId(null)

    if (error) {
      setMessage(error.message)
      return
    }
    router.refresh()
  }

  async function deleteProject(project: Project) {
    setMessage('')
    if (!window.confirm(`Delete ${project.title}?`)) return
    setBusyId(project.id)

    if (!hasSupabaseEnv) {
      setBusyId(null)
      setMessage('Supabase credentials are not configured yet.')
      return
    }

    const supabase = createClient()
    const imagePaths = (project.images ?? [])
      .map((url) => storagePathFromPublicUrl(url, STORAGE_BUCKETS.projectImages))
      .filter(Boolean) as string[]
    const pdfPath = project.pdf_url
      ? storagePathFromPublicUrl(project.pdf_url, STORAGE_BUCKETS.projectPdfs)
      : null

    if (imagePaths.length) {
      await supabase.storage.from(STORAGE_BUCKETS.projectImages).remove(imagePaths)
    }
    if (pdfPath) {
      await supabase.storage.from(STORAGE_BUCKETS.projectPdfs).remove([pdfPath])
    }

    const { error } = await supabase.from('projects').delete().eq('id', project.id)
    setBusyId(null)

    if (error) {
      setMessage(error.message)
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full min-w-[58rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)]">
              <th scope="col" className="px-4 py-3 font-semibold">
                Cover
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Title
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Category
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Views
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Created
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-[var(--border)]">
                <td className="px-4 py-3">
                  <div className="relative h-14 w-20 bg-slate-200">
                    {project.cover_image ? (
                      <Image
                        src={project.cover_image}
                        alt={`${project.title} cover thumbnail`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold">{project.title}</td>
                <td className="px-4 py-3">{project.category}</td>
                <td className="px-4 py-3">{project.is_published ? 'Published' : 'Draft'}</td>
                <td className="px-4 py-3">{project.view_count || 0}</td>
                <td className="px-4 py-3">{formatDate(project.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
                      aria-label={`Edit ${project.title}`}
                    >
                      <Edit aria-hidden="true" size={16} />
                    </Link>
                    <button
                      type="button"
                      disabled={busyId === project.id}
                      onClick={() => void togglePublished(project)}
                      className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={project.is_published ? 'Move to draft' : 'Publish project'}
                    >
                      {project.is_published ? <EyeOff aria-hidden="true" size={16} /> : <Eye aria-hidden="true" size={16} />}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === project.id}
                      onClick={() => void deleteProject(project)}
                      className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] transition-all duration-150 ease-in-out hover:border-red-500 hover:text-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Delete ${project.title}`}
                    >
                      <Trash2 aria-hidden="true" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {message ? <p role="status" className="text-sm leading-relaxed text-[var(--muted)]">{message}</p> : null}
    </div>
  )
}

function formatDate(date: string | null) {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

function storagePathFromPublicUrl(url: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + marker.length))
}
