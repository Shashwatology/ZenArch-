'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function getClientSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sessionId = localStorage.getItem('za_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('za_session_id', sessionId)
  }
  return sessionId
}

export function trackClientEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return

  const sessionId = getClientSessionId()
  
  // Non-blocking fetch
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName,
      properties,
      sessionId
    })
  }).catch(err => console.warn('Analytics event failed silently:', err))
}

export function useAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views and attribution
  useEffect(() => {
    if (typeof window === 'undefined') return

    const sessionId = getClientSessionId()
    
    // Attribution logic
    const utmSource = searchParams?.get('utm_source')
    const utmMedium = searchParams?.get('utm_medium')
    const utmCampaign = searchParams?.get('utm_campaign')
    const referrer = document.referrer
    const landingPage = window.location.href

    // We only send attribution if there's UTM or referrer, or if it's the very first visit of the session
    const hasSentAttribution = sessionStorage.getItem('za_attribution_sent')
    if (!hasSentAttribution && (utmSource || utmMedium || referrer || true)) {
      fetch('/api/analytics/attribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          utmSource,
          utmMedium,
          utmCampaign,
          referrer,
          landingPage
        })
      }).catch(err => console.warn('Analytics attribution failed silently:', err))
      
      sessionStorage.setItem('za_attribution_sent', 'true')
    }

    // Track page view
    trackClientEvent('page_view', { path: pathname })
    
  }, [pathname, searchParams])
}
