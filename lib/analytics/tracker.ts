import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
export type EventName = 
  | 'page_view' | 'product_view' | 'collection_view' | 'service_view' | 'project_view' 
  | 'search' | 'search_result_click' | 'search_zero_results' 
  | 'wishlist_add' 
  | 'quote_started' | 'quote_submitted' | 'quote_created' | 'quote_sent' | 'quote_accepted' | 'quote_rejected'
  | 'lead_created' | 'lead_assigned' | 'lead_status_changed' 
  | 'followup_created' | 'followup_completed' 
  | 'order_created' | 'order_status_changed' 
  | 'promotion_applied' | 'coupon_applied' 
  | 'board_created' | 'board_shared' | 'board_approved' 
  | 'ai_agent_invoked' | 'ai_tool_called' | 'ai_recommendation_generated' | 'ai_action_approved' | 'ai_action_rejected'
  | string;

export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('za_session_id')?.value
  
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    // We cannot set cookies here safely during all server paths, 
    // so ideally a middleware sets it, or we rely on client-side JS to initialize the session
    // For now, returning a new one
  }
  return sessionId
}

export async function trackEvent(
  eventName: EventName,
  properties?: Record<string, any>,
  options?: { userId?: string, source?: 'CLIENT' | 'SERVER', overrideSessionId?: string }
) {
  try {
    const sessionId = options?.overrideSessionId || await getSessionId()
    
    await prisma.analyticsEvent.create({
      data: {
        eventName,
        sessionId,
        userId: options?.userId || null,
        properties: properties || {},
        source: options?.source || 'SERVER',
      }
    })
  } catch (error) {
    // Analytics failures must be non-blocking
    console.error(`[Analytics Error] Failed to track ${eventName}:`, error)
  }
}

export async function captureAttribution(
  searchParams: URLSearchParams,
  referrer: string,
  landingPage: string,
  overrideSessionId?: string,
  userId?: string
) {
  try {
    const sessionId = overrideSessionId || await getSessionId()
    
    const utmSource = searchParams.get('utm_source')
    const utmMedium = searchParams.get('utm_medium')
    const utmCampaign = searchParams.get('utm_campaign')
    
    // Only capture if we have some attribution data
    if (!utmSource && !utmMedium && !referrer) return

    // Create session attribution
    await prisma.sessionAttribution.upsert({
      where: { sessionId },
      update: {}, // Don't override if already exists for this session
      create: {
        sessionId,
        userId: userId || null,
        utmSource,
        utmMedium,
        utmCampaign,
        referrer,
        landingPage
      }
    })

    // Create first touch if it doesn't exist for the user (only if they are logged in)
    if (userId) {
      const existingFirstTouch = await prisma.firstTouchAttribution.findUnique({
        where: { userId }
      })

      if (!existingFirstTouch) {
        await prisma.firstTouchAttribution.create({
          data: {
            sessionId,
            userId,
            utmSource,
            utmMedium,
            utmCampaign,
            referrer,
            landingPage
          }
        })
      }
    } else {
      // For anonymous users, track by session ID
      const existingFirstTouch = await prisma.firstTouchAttribution.findUnique({
        where: { sessionId }
      })

      if (!existingFirstTouch) {
        await prisma.firstTouchAttribution.create({
          data: {
            sessionId,
            utmSource,
            utmMedium,
            utmCampaign,
            referrer,
            landingPage
          }
        })
      }
    }
  } catch (error) {
    console.error('[Analytics Error] Failed to capture attribution:', error)
  }
}
