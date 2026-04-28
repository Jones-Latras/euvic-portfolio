import { createClient } from '@/lib/supabase/server'
import { hasSupabaseBrowserEnv } from '@/lib/supabase/config'
import type { About, Education, Project, SiteSetting, Skill } from '@/lib/supabase/types'

export const fallbackSettings = {
  student_name: 'Your Name',
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
}

export const fallbackProjects: Project[] = [
  {
    id: 'sample-residence',
    title: 'Compact Residence Drafting Set',
    slug: 'compact-residence-drafting-set',
    short_desc: 'A residential drawing package focused on efficient space planning and clear construction documentation.',
    description:
      'A complete student drafting study for a compact residence. The package emphasizes proportion, circulation, notation discipline, and coordinated drawing sheets for academic review.',
    category: 'floor-plan',
    tags: ['autocad', 'residential', 'hand-drawn'],
    year: '2026',
    tech_specs: {
      Scale: '1:100',
      Software: 'AutoCAD',
      Scope: 'Plans, elevations, sections',
    },
    cover_image:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=75',
    images: [
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=75',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=75',
    ],
    pdf_url: null,
    is_featured: true,
    is_published: true,
    view_count: 0,
    created_at: '2026-04-01T00:00:00.000Z',
    updated_at: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'sample-studio',
    title: 'Studio Elevation Study',
    slug: 'studio-elevation-study',
    short_desc: 'A facade composition exercise using rhythm, shadow, and material contrast.',
    description:
      'This elevation study explores facade depth, window cadence, and the visual hierarchy between structural lines and finish materials.',
    category: 'elevation',
    tags: ['revit', 'commercial', 'adobe-suite'],
    year: '2025',
    tech_specs: {
      Scale: '1:50',
      Software: 'Revit, Photoshop',
      Drawing: 'Front and side elevations',
    },
    cover_image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=75',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=75',
    ],
    pdf_url: null,
    is_featured: true,
    is_published: true,
    view_count: 0,
    created_at: '2026-03-20T00:00:00.000Z',
    updated_at: '2026-03-20T00:00:00.000Z',
  },
  {
    id: 'sample-render',
    title: 'Courtyard Render Concept',
    slug: 'courtyard-render-concept',
    short_desc: 'A daylight-focused 3D concept showing a quiet internal courtyard and circulation edge.',
    description:
      'A concept render for a courtyard-centered scheme, prepared to test material warmth, daylight behavior, and human scale.',
    category: '3d-render',
    tags: ['sketchup', 'archicad', 'residential'],
    year: '2025',
    tech_specs: {
      Software: 'SketchUp, Lumion',
      Focus: 'Daylight and atmosphere',
      Phase: 'Conceptual',
    },
    cover_image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=75',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=75',
    ],
    pdf_url: null,
    is_featured: true,
    is_published: true,
    view_count: 0,
    created_at: '2026-02-11T00:00:00.000Z',
    updated_at: '2026-02-11T00:00:00.000Z',
  },
]

export const fallbackAbout: About = {
  id: 'about',
  bio:
    'Architectural drafting design student focused on precise documentation, thoughtful space planning, and clear visual communication. This portfolio collects coursework and independent studies across floor plans, elevations, 3D renders, and technical drawing sets.',
  photo_url:
    'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=75',
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
  return Object.fromEntries(
    (data as SiteSetting[] | null)?.map((setting) => [setting.key, setting.value || '']) ?? []
  ) as typeof fallbackSettings
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
