'use client'

import { useEffect } from 'react'

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    void fetch('/api/increment-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch(() => undefined)
  }, [slug])

  return null
}
