import { NextRequest, NextResponse } from 'next/server'
import { captureAttribution } from '@/lib/analytics/tracker'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const body = await req.json()
    const { sessionId, utmSource, utmMedium, utmCampaign, referrer, landingPage } = body
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }
    
    const searchParams = new URLSearchParams()
    if (utmSource) searchParams.set('utm_source', utmSource)
    if (utmMedium) searchParams.set('utm_medium', utmMedium)
    if (utmCampaign) searchParams.set('utm_campaign', utmCampaign)
    
    await captureAttribution(
      searchParams, 
      referrer || '', 
      landingPage || '', 
      sessionId, 
      user?.id
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Analytics API] Error capturing attribution', error)
    return NextResponse.json({ success: true, warning: 'Failed to persist' })
  }
}
