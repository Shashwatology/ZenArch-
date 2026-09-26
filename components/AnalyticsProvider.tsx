'use client'

import { useAnalytics } from '@/lib/analytics/client'
import { Suspense } from 'react'

function AnalyticsComponent() {
  useAnalytics()
  return null
}

export function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <AnalyticsComponent />
    </Suspense>
  )
}
