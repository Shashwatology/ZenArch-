import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/analytics/tracker'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const body = await req.json()
    const { eventName, properties, sessionId } = body
    
    if (!eventName) {
      return NextResponse.json({ error: 'Missing eventName' }, { status: 400 })
    }
    
    // We get the sessionId from the payload, because the client extracts it from localStorage or cookies
    // to keep it consistent
    
    await trackEvent(eventName, properties, {
      userId: user?.id,
      source: 'CLIENT',
      overrideSessionId: sessionId
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    // Non-blocking analytics
    console.error('[Analytics API] Error tracking event', error)
    return NextResponse.json({ success: true, warning: 'Failed to persist' })
  }
}
