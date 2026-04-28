'use client'

import { Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CONTACT_SUBJECTS } from '@/lib/constants'

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
          className="focus-ring min-h-11 w-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
          {...register('name')}
        />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="focus-ring min-h-11 w-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
          {...register('email')}
        />
      </Field>
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-semibold">
          Subject
        </label>
        <select
          id="subject"
          className="focus-ring min-h-11 w-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm transition-all duration-150 ease-in-out hover:border-slate-500"
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
          className="focus-ring w-full resize-y border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm leading-relaxed transition-all duration-150 ease-in-out hover:border-slate-500"
          {...register('message')}
        />
        {errors.message?.message ? (
          <p className="text-sm text-red-600 dark:text-red-300">{errors.message.message}</p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="focus-ring inline-flex min-h-11 items-center gap-2 border border-accent bg-accent px-5 text-sm font-semibold text-white transition-all duration-150 ease-in-out hover:bg-accent-light active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-300 dark:bg-slate-200 dark:text-slate-950"
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
