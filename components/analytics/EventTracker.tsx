'use client'

import { useEffect } from 'react'
import { trackClientEvent } from '@/lib/analytics/client'

export function EventTracker({ eventName, properties }: { eventName: string, properties?: Record<string, any> }) {
  useEffect(() => {
    trackClientEvent(eventName, properties)
  }, [eventName, properties])

  return null
}
