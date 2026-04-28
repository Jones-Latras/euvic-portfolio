import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatYear(year?: string | null): string {
  return year || 'N/A'
}

export function absoluteUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined
  if (pathOrUrl.startsWith('http')) return pathOrUrl
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return new URL(pathOrUrl, baseUrl).toString()
}
