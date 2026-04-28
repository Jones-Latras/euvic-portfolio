import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({ slug: z.string().min(1) })

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (
    parsed.success &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    const supabase = createAdminClient()
    await supabase.rpc('increment_view_count', { project_slug: parsed.data.slug } as never)
  }

  return NextResponse.json({ success: true })
}
