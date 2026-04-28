import { cn } from '@/lib/utils'

export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-4 animate-pulse bg-slate-200 dark:bg-slate-700',
            index === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
      <div className="aspect-[4/3] animate-pulse bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-24 animate-pulse bg-slate-200 dark:bg-slate-700" />
        <SkeletonText lines={3} />
      </div>
    </div>
  )
}
