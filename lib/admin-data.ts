import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseBrowserEnv } from '@/lib/supabase/config'
import { fallbackProjects } from '@/lib/data'
import { fallbackSettings } from '@/lib/data'
import { getAboutData } from '@/lib/data'
import type { About, ContactMessage, Education, Project, SiteSetting, Skill } from '@/lib/supabase/types'

export async function getAdminDashboardData() {
  noStore()

  if (!hasSupabaseBrowserEnv) {
    return {
      projects: fallbackProjects,
      messages: [] as ContactMessage[],
    }
  }

  const supabase = await createClient()
  const [{ data: projects }, { data: messages }] = await Promise.all([
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return {
    projects: (projects ?? []) as Project[],
    messages: (messages ?? []) as ContactMessage[],
  }
}

export async function getAdminProjectById(id: string) {
  noStore()

  if (!hasSupabaseBrowserEnv) {
    return fallbackProjects.find((project) => project.id === id) ?? null
  }

  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
  return (data as Project | null) ?? null
}

export async function getAdminMessages() {
  noStore()

  if (!hasSupabaseBrowserEnv) {
    return [] as ContactMessage[]
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (data ?? []) as ContactMessage[]
}

export async function getAdminSettingsData() {
  noStore()

  if (!hasSupabaseBrowserEnv) {
    return {
      settings: fallbackSettings,
      projects: fallbackProjects,
    }
  }

  const supabase = await createClient()
  const [{ data: settings }, { data: projects }] = await Promise.all([
    supabase.from('site_settings').select('*'),
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
  ])

  return {
    settings: {
      ...fallbackSettings,
      ...Object.fromEntries(
        ((settings ?? []) as SiteSetting[]).map((setting) => [setting.key, setting.value || ''])
      ),
    },
    projects: (projects ?? []) as Project[],
  }
}

export async function getAdminAboutEditorData() {
  noStore()

  if (!hasSupabaseBrowserEnv) {
    return getAboutData()
  }

  const supabase = await createClient()
  const [{ data: aboutRows }, { data: education }, { data: skills }] = await Promise.all([
    supabase.from('about').select('*').limit(1),
    supabase.from('education').select('*').order('sort_order'),
    supabase.from('skills').select('*').order('sort_order'),
  ])

  const fallback = await getAboutData()
  return {
    about: ((aboutRows?.[0] as About | undefined) ?? fallback.about),
    education: ((education ?? []) as Education[]).length ? ((education ?? []) as Education[]) : fallback.education,
    skills: ((skills ?? []) as Skill[]).length ? ((skills ?? []) as Skill[]) : fallback.skills,
  }
}
