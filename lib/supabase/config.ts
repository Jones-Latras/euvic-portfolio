export const hasSupabaseBrowserEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const hasSupabaseAdminEnv =
  hasSupabaseBrowserEnv && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
