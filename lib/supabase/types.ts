export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Project = {
  id: string
  title: string
  slug: string
  short_desc: string | null
  description: string | null
  category: string
  tags: string[] | null
  year: string | null
  tech_specs: Json | null
  cover_image: string | null
  images: string[] | null
  pdf_url: string | null
  is_featured: boolean | null
  is_published: boolean | null
  view_count: number | null
  created_at: string | null
  updated_at: string | null
}

export type About = {
  id: string
  bio: string | null
  photo_url: string | null
  cv_url: string | null
  updated_at: string | null
}

export type Education = {
  id: string
  institution: string
  program: string
  start_year: string | null
  end_year: string | null
  gpa: string | null
  sort_order: number | null
}

export type Skill = {
  id: string
  name: string
  category: string
  level: number | null
  icon_slug: string | null
  sort_order: number | null
}

export type SiteSetting = {
  key: string
  value: string | null
  updated_at: string | null
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project
        Insert: Partial<Project> & Pick<Project, 'title' | 'slug' | 'category'>
        Update: Partial<Project>
      }
      about: {
        Row: About
        Insert: Partial<About>
        Update: Partial<About>
      }
      education: {
        Row: Education
        Insert: Partial<Education> & Pick<Education, 'institution' | 'program'>
        Update: Partial<Education>
      }
      skills: {
        Row: Skill
        Insert: Partial<Skill> & Pick<Skill, 'name' | 'category'>
        Update: Partial<Skill>
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          is_read: boolean | null
          created_at: string | null
        }
        Insert: {
          name: string
          email: string
          subject?: string | null
          message: string
          is_read?: boolean | null
        }
        Update: Partial<Database['public']['Tables']['contact_messages']['Row']>
      }
      site_settings: {
        Row: SiteSetting
        Insert: SiteSetting
        Update: Partial<SiteSetting>
      }
    }
    Functions: {
      increment_view_count: {
        Args: { project_slug: string }
        Returns: undefined
      }
    }
  }
}
