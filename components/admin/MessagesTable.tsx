'use client'

import { Eye, MailOpen, Mail, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ContactMessage } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export function MessagesTable({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter()
  const [openId, setOpenId] = useState<string | null>(messages[0]?.id ?? null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  async function toggleRead(message: ContactMessage) {
    setNotice('')
    setBusyId(message.id)

    if (!hasSupabaseEnv) {
      setBusyId(null)
      setNotice('Supabase credentials are not configured yet.')
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: !message.is_read } as never)
      .eq('id', message.id)

    setBusyId(null)
    if (error) {
      setNotice(error.message)
      return
    }

    router.refresh()
  }

  async function deleteMessage(message: ContactMessage) {
    setNotice('')
    if (!window.confirm(`Delete message from ${message.name}?`)) return
    setBusyId(message.id)

    if (!hasSupabaseEnv) {
      setBusyId(null)
      setNotice('Supabase credentials are not configured yet.')
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from('contact_messages').delete().eq('id', message.id)

    setBusyId(null)
    if (error) {
      setNotice(error.message)
      return
    }

    if (openId === message.id) setOpenId(null)
    router.refresh()
  }

  if (!messages.length) {
    return (
      <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold">No Messages</h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--muted)]">
          Contact form submissions will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)]">
              <th scope="col" className="px-4 py-3 font-semibold">
                From
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Subject
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Date
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => {
              const unread = !message.is_read
              return (
                <>
                  <tr
                    key={message.id}
                    className={cn(
                      'border-b border-[var(--border)]',
                      unread && 'bg-slate-50 font-semibold dark:bg-slate-800'
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {unread ? <span className="h-2 w-2 bg-[var(--foreground)]" /> : null}
                        <div>
                          <p>{message.name}</p>
                          <p className="text-xs font-normal text-[var(--muted)]">{message.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{message.subject || 'No subject'}</td>
                    <td className="px-4 py-3">{formatDate(message.created_at)}</td>
                    <td className="px-4 py-3">{unread ? 'Unread' : 'Read'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setOpenId(openId === message.id ? null : message.id)}
                          className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
                          aria-label="View message"
                        >
                          <Eye aria-hidden="true" size={16} />
                        </button>
                        <button
                          type="button"
                          disabled={busyId === message.id}
                          onClick={() => void toggleRead(message)}
                          className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={unread ? 'Mark as read' : 'Mark as unread'}
                        >
                          {unread ? <MailOpen aria-hidden="true" size={16} /> : <Mail aria-hidden="true" size={16} />}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === message.id}
                          onClick={() => void deleteMessage(message)}
                          className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] transition-all duration-150 ease-in-out hover:border-red-500 hover:text-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Delete message"
                        >
                          <Trash2 aria-hidden="true" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {openId === message.id ? (
                    <tr key={`${message.id}-detail`} className="border-b border-[var(--border)]">
                      <td colSpan={5} className="px-4 py-4">
                        <div className="max-w-prose whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
                          {message.message}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
      {notice ? <p role="status" className="text-sm leading-relaxed text-[var(--muted)]">{notice}</p> : null}
    </div>
  )
}

function formatDate(date: string | null) {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}
