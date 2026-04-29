import { createClient } from '@/lib/supabase/server'
import { hasSupabaseBrowserEnv } from '@/lib/supabase/config'
import type { About, Education, Project, SiteSetting, Skill } from '@/lib/supabase/types'

export const fallbackSettings = {
  student_name: 'Euvic G. Abellano',
  tagline: 'Architectural Drafting & Design',
  email: 'you@email.com',
  linkedin_url: '',
  behance_url: '',
  github_url: '',
  hero_image_url:
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=2400&q=85',
  seo_title: 'Portfolio | Architectural Design',
  seo_description: 'Showcasing architectural drafting and design work.',
  seo_og_image: '',
  cv_url: '',
  quote_1_text: '',
  quote_1_author: '',
}

export const fallbackProjects: Project[] = []

export const fallbackAbout: About = {
  id: 'about',
  bio:
    'Architectural drafting design student focused on precise documentation, thoughtful space planning, and clear visual communication. This portfolio collects coursework and independent studies across floor plans, elevations, 3D renders, and technical drawing sets.',
  photo_url: '/profile.jpg',
  cv_url: '',
  updated_at: null,
}

export const fallbackEducation: Education[] = [
  {
    id: 'education-1',
    institution: 'Architecture and Design Program',
    program: 'Architectural Drafting Design',
    start_year: '2024',
    end_year: 'Present',
    gpa: null,
    sort_order: 0,
  },
]

export const fallbackSkills: Skill[] = [
  { id: '1', name: 'AutoCAD', category: 'Drafting Software', level: 5, icon_slug: 'autocad', sort_order: 0 },
  { id: '2', name: 'Revit', category: 'Drafting Software', level: 4, icon_slug: 'revit', sort_order: 1 },
  { id: '3', name: 'SketchUp', category: 'Design Tools', level: 4, icon_slug: 'sketchup', sort_order: 2 },
  { id: '4', name: 'Adobe Suite', category: 'Presentation', level: 4, icon_slug: 'adobe-suite', sort_order: 3 },
  { id: '5', name: 'Hand Drafting', category: 'Core Skills', level: 5, icon_slug: 'hand-drawn', sort_order: 4 },
]

export async function getSettings() {
  if (!hasSupabaseBrowserEnv) return fallbackSettings
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('*')
  const settings = { ...fallbackSettings }

  for (const setting of (data as SiteSetting[] | null) ?? []) {
    if (setting.key in settings && setting.value?.trim()) {
      settings[setting.key as keyof typeof fallbackSettings] = setting.value
    }
  }

  return settings
}

export async function getProjects() {
  if (!hasSupabaseBrowserEnv) return fallbackProjects
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  return data?.length ? data : fallbackProjects
}

export async function getFilteredProjects({
  category,
  tag,
  sort,
  page = 1,
  pageSize = 12,
}: {
  category?: string
  tag?: string
  sort?: string
  page?: number
  pageSize?: number
}) {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1
  const offset = (safePage - 1) * pageSize

  const getFallbackResult = () => {
    const filtered = filterProjects(fallbackProjects, { category, tag, sort })

    return {
      projects: filtered.slice(offset, offset + pageSize),
      total: filtered.length,
      page: safePage,
      pageSize,
    }
  }

  if (!hasSupabaseBrowserEnv) return getFallbackResult()

  const supabase = await createClient()
  let query = supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('is_published', true)

  if (category) query = query.eq('category', category)
  if (tag) query = query.contains('tags', [tag])
  if (sort === 'oldest') query = query.order('created_at', { ascending: true })
  else if (sort === 'az') query = query.order('title', { ascending: true })
  else query = query.order('created_at', { ascending: false })

  const { data, count } = await query.range(offset, offset + pageSize - 1)

  if (!data?.length && !category && !tag && !sort) {
    return getFallbackResult()
  }

  return {
    projects: data?.length ? data : [],
    total: count ?? 0,
    page: safePage,
    pageSize,
  }
}

function filterProjects(
  projects: Project[],
  {
    category,
    tag,
    sort,
  }: {
    category?: string
    tag?: string
    sort?: string
  }
) {
  return projects
    .filter((project) => (!category ? true : project.category === category))
    .filter((project) => (!tag ? true : project.tags?.includes(tag)))
    .sort((a, b) => {
      if (sort === 'oldest') return String(a.created_at).localeCompare(String(b.created_at))
      if (sort === 'az') return a.title.localeCompare(b.title)
      return String(b.created_at).localeCompare(String(a.created_at))
    })
}

export async function getFeaturedProjects() {
  const projects = await getProjects()
  return projects.filter((project) => project.is_featured).slice(0, 3)
}

export async function getProjectBySlug(slug: string) {
  if (!hasSupabaseBrowserEnv) return fallbackProjects.find((project) => project.slug === slug) ?? null
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()
  return data ?? fallbackProjects.find((project) => project.slug === slug) ?? null
}

export async function getAboutData() {
  if (!hasSupabaseBrowserEnv) {
    return { about: fallbackAbout, education: fallbackEducation, skills: fallbackSkills }
  }
  const supabase = await createClient()
  const [{ data: aboutRows }, { data: education }, { data: skills }] = await Promise.all([
    supabase.from('about').select('*').limit(1),
    supabase.from('education').select('*').order('sort_order'),
    supabase.from('skills').select('*').order('sort_order'),
  ])
  return {
    about: aboutRows?.[0] ?? fallbackAbout,
    education: education?.length ? education : fallbackEducation,
    skills: skills?.length ? skills : fallbackSkills,
  }
}
