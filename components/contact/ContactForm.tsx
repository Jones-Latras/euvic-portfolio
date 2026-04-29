'use client'

import { Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CONTACT_SUBJECTS } from '@/lib/constants'

const fieldClassName =
  'focus-ring min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)]/70 px-4 text-sm transition-all duration-200 ease-out hover:border-slate-500 focus-visible:border-slate-300 focus-visible:shadow-[0_0_0_3px_rgba(148,163,184,0.15)]'

type Status = 'idle' | 'loading' | 'success' | 'error'

const schema = z.object({
  name: z.string().min(2, 'Enter your name.'),
  email: z.string().email('Enter a valid email.'),
  subject: z.string(),
  message: z.string().min(10, 'Enter at least 10 characters.'),
  website: z.string().optional(),
})

type ContactFields = z.infer<typeof schema>

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: CONTACT_SUBJECTS[0],
      website: '',
    },
  })

  async function submit(payload: ContactFields) {
    setStatus('loading')
    setMessage('')
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    if (!response.ok) {
      setStatus('error')
      setMessage(body.error || 'Unable to send message.')
      return
    }
    setStatus('success')
    setMessage('Message sent.')
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>
      <Field label="Name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={fieldClassName}
          {...register('name')}
        />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={fieldClassName}
          {...register('email')}
        />
      </Field>
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-semibold">
          Subject
        </label>
        <select
          id="subject"
          className={fieldClassName}
          {...register('subject')}
        >
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          className={`${fieldClassName} resize-y py-3 leading-relaxed`}
          {...register('message')}
        />
        {errors.message?.message ? (
          <p className="text-sm text-red-600 dark:text-red-300">{errors.message.message}</p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-100 px-5 text-sm font-bold text-slate-950 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send aria-hidden="true" size={16} />
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
      {message ? (
        <p
          role="status"
          className="text-sm leading-relaxed text-[var(--muted)]"
        >
          {message}
        </p>
      ) : null}
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  const id = label.toLowerCase()
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  )
}
