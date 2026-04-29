import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  subject: z.string().max(120).optional().default('Other'),
  message: z.string().min(10).max(5000),
  website: z.string().optional().default(''),
})

const submissions = new Map<string, number[]>()
const limitWindowMs = 60 * 60 * 1000
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>'

export async function POST(request: NextRequest) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the form fields and try again.' }, { status: 400 })
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const now = Date.now()
  const recent = (submissions.get(ip) || []).filter((time) => now - time < limitWindowMs)
  if (recent.length >= 3) {
    return NextResponse.json({ error: 'Too many submissions. Try again later.' }, { status: 429 })
  }
  submissions.set(ip, [...recent, now])

  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = createAdminClient()
      await supabase.from('contact_messages').insert({
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
      } as never)
    }

    if (process.env.RESEND_API_KEY && process.env.CONTACT_FORM_TO_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: resendFromEmail,
        to: process.env.CONTACT_FORM_TO_EMAIL,
        subject: `New inquiry: ${parsed.data.subject}`,
        text: `From: ${parsed.data.name} (${parsed.data.email})\n\n${parsed.data.message}`,
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unable to send message.' }, { status: 500 })
  }
}
