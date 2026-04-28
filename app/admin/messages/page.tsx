import { MessagesTable } from '@/components/admin/MessagesTable'
import { getAdminMessages } from '@/lib/admin-data'

export default async function AdminMessagesPage() {
  const messages = await getAdminMessages()
  const unread = messages.filter((message) => !message.is_read).length

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--muted)]">Inbox</p>
        <h1 className="mt-2 text-3xl font-semibold">Messages</h1>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--muted)]">
          {unread} unread of {messages.length} total messages.
        </p>
      </div>
      <MessagesTable messages={messages} />
    </div>
  )
}
