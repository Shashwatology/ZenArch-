import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    
    // Webhook authentication (e.g. signature verification)
    const signature = req.headers.get('x-provider-signature')
    const secret = process.env.EMAIL_WEBHOOK_SECRET
    
    if (secret && signature) {
      const hash = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
      if (hash !== signature) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const payload = JSON.parse(rawBody)

    // Handle generic provider payload (this is an abstracted schema)
    // Expects: { messageId: string, event: 'delivered' | 'bounced' | 'complained', email: string, reason?: string }
    const { messageId, event, email, reason } = payload

    if (messageId && event) {
      const newStatus = event === 'delivered' ? 'DELIVERED' : event === 'bounced' ? 'BOUNCED' : event === 'complained' ? 'FAILED' : null
      
      if (newStatus) {
        // Update Email Log
        await prisma.emailLog.updateMany({
          where: { providerMessageId: messageId },
          data: { 
            status: newStatus,
            failureReason: reason || null
          }
        })
      }

      // Add to suppression if hard bounce or complaint
      if (event === 'bounced' || event === 'complained') {
        if (email) {
          await prisma.emailSuppression.upsert({
            where: { email },
            update: { reason: event.toUpperCase(), source: 'WEBHOOK' },
            create: { email, reason: event.toUpperCase(), source: 'WEBHOOK' }
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Email Webhook Error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
