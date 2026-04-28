import Link from 'next/link'
import { cn } from '@/lib/utils'

const variants = {
  primary:
    'border-slate-50 bg-slate-50 text-slate-950 shadow-lg shadow-slate-950/15 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl active:translate-y-0 active:bg-white dark:border-slate-50 dark:bg-slate-50 dark:!text-slate-950 dark:hover:bg-white',
  secondary:
    'border-white/40 bg-white/[0.06] text-white backdrop-blur-md hover:-translate-y-0.5 hover:border-white/65 hover:bg-white/15 active:translate-y-0 active:bg-white active:!text-slate-950 dark:border-white/35 dark:bg-white/[0.06] dark:text-white',
  outline:
    'border-[var(--border)] bg-transparent text-[var(--foreground)] hover:-translate-y-0.5 hover:border-slate-500 active:translate-y-0 active:bg-[var(--foreground)] active:!text-[var(--background)]',
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className,
}: {
  href: string
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'focus-ring inline-flex min-h-12 items-center justify-center rounded-xl border px-6 text-sm font-bold transition-all duration-200 ease-out aria-disabled:pointer-events-none aria-disabled:opacity-50',
        variants[variant],
        className
      )}
    >
      {children}
    </Link>
  )
}
