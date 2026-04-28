'use client'

import Image from 'next/image'
import { FileText, ImagePlus, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

type UploadState = {
  name: string
  progress: number
  error?: string
}

export function ImageUploader({
  projectId,
  images,
  coverImage,
  pdfUrl,
  onImagesChange,
  onCoverChange,
  onPdfChange,
}: {
  projectId: string
  images: string[]
  coverImage: string
  pdfUrl: string
  onImagesChange: (images: string[]) => void
  onCoverChange: (coverImage: string) => void
  onPdfChange: (pdfUrl: string) => void
}) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploads, setUploads] = useState<UploadState[]>([])

  async function uploadImages(files: FileList | File[]) {
    const incomingFiles = Array.from(files)
    const validFiles = incomingFiles.filter((file) => {
      const validType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      const validSize = file.size <= 20 * 1024 * 1024
      return validType && validSize
    })
    const rejectedFiles = incomingFiles.filter((file) => !validFiles.includes(file))

    if (rejectedFiles.length) {
      setUploads((current) => [
        ...current,
        ...rejectedFiles.map((file) => ({
          name: file.name,
          progress: 0,
          error: file.size > 20 * 1024 * 1024
            ? 'Image must be 20MB or smaller.'
            : 'Use a JPG, PNG, or WEBP image.',
        })),
      ])
    }

    if (!validFiles.length) return

    if (!hasSupabaseEnv) {
      setUploads(validFiles.map((file) => ({ name: file.name, progress: 0, error: 'Supabase is not configured.' })))
      return
    }

    const supabase = createClient()
    const nextImages = [...images]

    for (const file of validFiles) {
      setUploads((current) => [...current, { name: file.name, progress: 10 }])
      const path = `${projectId}/${crypto.randomUUID()}-${file.name}`
      const { error } = await supabase.storage.from(STORAGE_BUCKETS.projectImages).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

      if (error) {
        setUploads((current) =>
          current.map((item) =>
            item.name === file.name ? { ...item, progress: 100, error: error.message } : item
          )
        )
        continue
      }

      const { data } = supabase.storage.from(STORAGE_BUCKETS.projectImages).getPublicUrl(path)
      nextImages.push(data.publicUrl)
      setUploads((current) =>
        current.map((item) => (item.name === file.name ? { ...item, progress: 100 } : item))
      )
    }

    onImagesChange(nextImages)
    if (!coverImage && nextImages[0]) onCoverChange(nextImages[0])
  }

  async function uploadPdf(file?: File) {
    if (!file) return
    if (file.type !== 'application/pdf' || file.size > 50 * 1024 * 1024) {
      setUploads((current) => [
        ...current,
        { name: file.name, progress: 0, error: 'PDF must be 50MB or smaller.' },
      ])
      return
    }

    if (!hasSupabaseEnv) {
      setUploads((current) => [
        ...current,
        { name: file.name, progress: 0, error: 'Supabase is not configured.' },
      ])
      return
    }

    const supabase = createClient()
    const path = `${projectId}/${file.name}`
    setUploads((current) => [...current, { name: file.name, progress: 10 }])
    const { error } = await supabase.storage.from(STORAGE_BUCKETS.projectPdfs).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

    if (error) {
      setUploads((current) =>
        current.map((item) =>
          item.name === file.name ? { ...item, progress: 100, error: error.message } : item
        )
      )
      return
    }

    const { data } = supabase.storage.from(STORAGE_BUCKETS.projectPdfs).getPublicUrl(path)
    onPdfChange(data.publicUrl)
    setUploads((current) =>
      current.map((item) => (item.name === file.name ? { ...item, progress: 100 } : item))
    )
  }

  async function removeImage(image: string) {
    if (hasSupabaseEnv) {
      const path = storagePathFromPublicUrl(image, STORAGE_BUCKETS.projectImages)
      if (path) {
        const supabase = createClient()
        await supabase.storage.from(STORAGE_BUCKETS.projectImages).remove([path])
      }
    }
    const nextImages = images.filter((item) => item !== image)
    onImagesChange(nextImages)
    if (coverImage === image) onCoverChange(nextImages[0] || '')
  }

  async function removePdf() {
    if (hasSupabaseEnv && pdfUrl) {
      const path = storagePathFromPublicUrl(pdfUrl, STORAGE_BUCKETS.projectPdfs)
      if (path) {
        const supabase = createClient()
        await supabase.storage.from(STORAGE_BUCKETS.projectPdfs).remove([path])
      }
    }
    onPdfChange('')
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          void uploadImages(event.dataTransfer.files)
        }}
        className={cn(
          'border border-dashed border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-150 ease-in-out',
          dragging && 'border-slate-500'
        )}
      >
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) void uploadImages(event.target.files)
          }}
        />
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="focus-ring inline-flex min-h-11 items-center gap-2 border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
        >
          <ImagePlus aria-hidden="true" size={16} />
          Add Images
        </button>
      </div>

      {uploads.length ? (
        <div className="space-y-2">
          {uploads.map((upload, index) => (
            <div key={`${upload.name}-${index}`} className="space-y-1 text-sm">
              <div className="flex justify-between gap-4">
                <span className="break-words">{upload.name}</span>
                <span className="font-mono text-xs text-[var(--muted)]">{upload.progress}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700">
                <div className="h-full bg-[var(--foreground)]" style={{ width: `${upload.progress}%` }} />
              </div>
              {upload.error ? <p className="text-sm text-red-600 dark:text-red-300">{upload.error}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {images.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image} className="relative border border-[var(--border)] bg-[var(--surface)]">
              <div className="relative aspect-[4/3] bg-slate-200">
                <Image src={image} alt="Uploaded project image" fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
                  <input
                    type="radio"
                    name="coverImage"
                    checked={coverImage === image}
                    onChange={() => onCoverChange(image)}
                  />
                  Cover
                </label>
                <button
                  type="button"
                  onClick={() => void removeImage(image)}
                  className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
                  aria-label="Remove image"
                >
                  <Trash2 aria-hidden="true" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-3 border border-[var(--border)] bg-[var(--surface)] p-5">
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(event) => void uploadPdf(event.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => pdfInputRef.current?.click()}
          className="focus-ring inline-flex min-h-11 items-center gap-2 border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
        >
          <Upload aria-hidden="true" size={16} />
          Upload PDF
        </button>
        {pdfUrl ? (
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2 break-all text-[var(--muted)]">
              <FileText aria-hidden="true" size={16} />
              {pdfUrl}
            </span>
            <button
              type="button"
              onClick={() => void removePdf()}
              className="focus-ring inline-flex min-h-11 items-center px-3 font-semibold transition-all duration-150 ease-in-out hover:text-red-600 active:scale-95"
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function storagePathFromPublicUrl(url: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + marker.length))
}
