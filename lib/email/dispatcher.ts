import prisma from '@/lib/prisma'
import { sendEmailViaProvider } from './provider'
import { renderEmailTemplate } from './renderer'

type BaseEventPayload = {
  idempotencyKey?: string
}

type EmailEvent = 
  | ({ type: 'welcome', recipient: string, userId: string, name: string } & BaseEventPayload)
  | ({ type: 'quote.sent', recipient: string, customerId: string, quoteRequestId: string, leadId?: string, quoteUrl: string } & BaseEventPayload)
  | ({ type: 'lead.assigned', recipient: string, leadId: string, staffName: string, leadName: string } & BaseEventPayload)
  | ({ type: 'order.created', recipient: string, customerId: string, orderId: string, orderNumber: string, amount: string } & BaseEventPayload)
  | ({ type: 'order.status_update', recipient: string, customerId: string, orderId: string, status: string } & BaseEventPayload)
  | ({ type: 'order.tracking_added', recipient: string, customerId: string, orderId: string, trackingId: string, deliveryPartner: string } & BaseEventPayload)
  | ({ type: 'board.shared', recipient: string, designBoardId: string, boardName: string, shareUrl: string } & BaseEventPayload)

export async function dispatchEmailEvent(event: EmailEvent) {
  const { type, recipient, idempotencyKey } = event

  // Check Suppression
  const suppression = await prisma.emailSuppression.findUnique({ where: { email: recipient } })
  if (suppression) {
    console.warn(`[EMAIL] Suppressed event ${type} to ${recipient} (Reason: ${suppression.reason})`)
    return { success: false, reason: 'SUPPRESSED' }
  }

  // Check Idempotency
  if (idempotencyKey) {
    const existing = await prisma.emailLog.findUnique({ where: { idempotencyKey } })
    if (existing) {
      console.log(`[EMAIL] Idempotent drop for event ${type} to ${recipient} (Key: ${idempotencyKey})`)
      return { success: true, messageId: existing.providerMessageId, cached: true }
    }
  }

  // Render content
  let subject = ''
  let html = ''

  switch (event.type) {
    case 'welcome':
      subject = 'Welcome to ZEN ARCH'
      html = renderEmailTemplate(
        subject,
        `<p>Dear ${event.name},</p><p>Welcome to ZEN ARCH. We are thrilled to help you design your perfect space.</p>`,
        { text: 'Explore Collections', url: `${process.env.NEXT_PUBLIC_SITE_URL}/furniture` }
      )
      break
    case 'quote.sent':
      subject = 'Your ZEN ARCH Quote is Ready'
      html = renderEmailTemplate(
        subject,
        `<p>Your custom quote is ready for review.</p>`,
        { text: 'View Quote', url: event.quoteUrl }
      )
      break
    case 'lead.assigned':
      subject = 'New Lead Assignment'
      html = renderEmailTemplate(
        subject,
        `<p>Hi ${event.staffName},</p><p>A new lead (<strong>${event.leadName}</strong>) has been assigned to you.</p>`,
        { text: 'View Lead', url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads/${event.leadId}` }
      )
      break
    case 'order.created':
      subject = `Order Confirmation: ${event.orderNumber}`
      html = renderEmailTemplate(
        subject,
        `<p>Thank you for your order.</p><p><strong>Order Number:</strong> ${event.orderNumber}<br><strong>Total:</strong> ₹${event.amount}</p>`,
        { text: 'View Order', url: `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders` }
      )
      break
    case 'order.status_update':
      subject = `Order Status Update - ${event.orderId}`
      html = renderEmailTemplate(
        subject,
        `<p>Your order status has been updated to <strong>${event.status}</strong>.</p>`,
        { text: 'Track Order', url: `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${event.orderId}` }
      )
      break
    case 'order.tracking_added':
      subject = `Order Dispatched - ${event.orderId}`
      html = renderEmailTemplate(
        subject,
        `<p>Your order has been dispatched via ${event.deliveryPartner}.</p><p>Tracking ID: <strong>${event.trackingId}</strong></p>`,
        { text: 'Track Shipment', url: `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${event.orderId}` }
      )
      break
    case 'board.shared':
      subject = `A Design Board was shared with you: ${event.boardName}`
      html = renderEmailTemplate(
        subject,
        `<p>You have been invited to collaborate on the design board: <strong>${event.boardName}</strong>.</p>`,
        { text: 'Open Board', url: event.shareUrl }
      )
      break
    default:
      throw new Error(`Unknown email event type`)
  }

  // Send via Provider
  const result = await sendEmailViaProvider({
    to: recipient,
    subject,
    html,
    idempotencyKey
  })

  // Determine linkage
  let userId = 'userId' in event ? event.userId : null
  if (!userId && 'customerId' in event) userId = event.customerId

  // Log to EmailLog
  const log = await prisma.emailLog.create({
    data: {
      recipientEmail: recipient,
      eventType: type,
      template: type,
      subject,
      providerMessageId: result.messageId,
      idempotencyKey,
      status: result.success ? 'SENT' : 'FAILED',
      failureReason: result.error,
      sentAt: result.success ? new Date() : null,
      userId,
      leadId: 'leadId' in event ? event.leadId : null,
      quoteRequestId: 'quoteRequestId' in event ? event.quoteRequestId : null,
      orderId: 'orderId' in event ? event.orderId : null,
      designBoardId: 'designBoardId' in event ? event.designBoardId : null,
    }
  })

  return { success: result.success, logId: log.id, messageId: result.messageId, error: result.error }
}
