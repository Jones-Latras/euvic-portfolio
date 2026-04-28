import Link from 'next/link'
import { cn } from '@/lib/utils'

const variants = {
  primary:
    'border-accent bg-accent text-white hover:bg-accent-light hover:border-accent-light dark:border-slate-300 dark:bg-slate-200 dark:text-slate-950 dark:hover:bg-white',
  secondary:
    'border-white/70 bg-white/10 text-white hover:bg-white/20 dark:border-slate-300 dark:bg-transparent dark:text-slate-100',
  outline:
    'border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-slate-500',
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
        'focus-ring inline-flex min-h-11 items-center justify-center border px-5 text-sm font-semibold transition-all duration-150 ease-in-out active:scale-95 aria-disabled:pointer-events-none aria-disabled:opacity-50',
        variants[variant],
        className
      )}
    >
      {children}
    </Link>
  )
}
