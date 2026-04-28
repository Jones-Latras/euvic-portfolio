import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hasSupabaseBrowserEnv } from '@/lib/supabase/config'

const allowedPaths = ['/', '/projects', '/about', '/contact']

export async function POST(request: Request) {
  if (hasSupabaseBrowserEnv) {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const body = (await request.json().catch(() => ({}))) as { paths?: string[] }
  const paths = body.paths?.length ? body.paths : allowedPaths

  for (const path of paths) {
    if (allowedPaths.includes(path) || path.startsWith('/projects/')) {
      revalidatePath(path)
    }
  }

  return NextResponse.json({ success: true })
}
