import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseBrowserEnv } from '@/lib/supabase/config'
import { fallbackProjects } from '@/lib/data'
import { fallbackSettings } from '@/lib/data'
import type { ContactMessage, Project, SiteSetting } from '@/lib/supabase/types'

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
