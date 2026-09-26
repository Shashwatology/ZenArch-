import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/auth'

export async function GET(request: Request) {
  try {
    await requireAdmin()

    const orders = await prisma.order.findMany({
      include: {
        user: { include: { customerProfile: true } },
        items: { include: { product: true, variant: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const headers = [
      'Order ID',
      'Date',
      'Customer Email',
      'Customer Name',
      'Status',
      'Total Amount',
      'Currency',
      'Payment Status',
      'Fulfillment Status',
      'Shipping Name',
      'Shipping Address',
      'Shipping City',
      'Shipping State',
      'Shipping Pincode',
      'Shipping Phone',
      'Delivery Partner',
      'Tracking ID',
      'Items'
    ]

    const rows = orders.map(order => {
      const itemsStr = order.items.map(item => `${item.quantity}x ${item.productNameAtTime} (${item.variantNameAtTime || 'Base'})`).join('; ')
      
      return [
        order.orderId || order.id,
        new Date(order.createdAt).toISOString(),
        order.user.email,
        `${order.user.customerProfile?.firstName || ''} ${order.user.customerProfile?.lastName || ''}`.trim(),
        order.status,
        order.totalAmount,
        order.currency,
        order.paymentStatus,
        order.fulfillmentStatus,
        order.shippingName || '',
        order.shippingAddress || '',
        order.shippingCity || '',
        order.shippingState || '',
        order.shippingPincode || '',
        order.shippingPhone || '',
        order.deliveryPartner || '',
        order.trackingId || '',
        itemsStr
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="zenarch_orders_export.csv"'
      }
    })
  } catch (err: any) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
}
