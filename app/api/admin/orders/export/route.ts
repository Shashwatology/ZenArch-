import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/auth'
import * as XLSX from 'xlsx'

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

    // Prepare Sheet 1: Orders
    const ordersData = orders.map(order => ({
      'Order ID': order.orderId || order.id,
      'Order Date': new Date(order.createdAt).toISOString(),
      'Customer Name': `${order.user.customerProfile?.firstName || ''} ${order.user.customerProfile?.lastName || ''}`.trim(),
      'Customer Email': order.user.email,
      'Customer Phone': order.user.customerProfile?.phone || order.shippingPhone || '',
      'Order Status': order.status,
      'Payment Status': order.paymentStatus,
      'Fulfillment Status': order.fulfillmentStatus,
      'Total Amount': Number(order.totalAmount),
      'Delivery Partner': order.deliveryPartner || '',
      'Tracking ID': order.trackingId || '',
      'Tracking URL': order.trackingUrl || '',
      'Shipping Name': order.shippingName || '',
      'Shipping Address': order.shippingAddress || '',
      'City': order.shippingCity || '',
      'State': order.shippingState || '',
      'Pincode': order.shippingPincode || '',
      'Created At': new Date(order.createdAt).toISOString(),
      'Updated At': new Date(order.updatedAt).toISOString()
    }))

    // Prepare Sheet 2: Order Items
    const orderItemsData = orders.flatMap(order => 
      order.items.map(item => ({
        'Order ID': order.orderId || order.id,
        'Product': item.productNameAtTime || item.product.name,
        'Product Code': item.product.id,
        'Variant': item.variantNameAtTime || item.variant?.name || '',
        'Quantity': item.quantity,
        'Unit Price': Number(item.priceAtTime),
        'Promotion Discount': 0, // Mocked for now until promotion relations are active
        'Coupon Discount': 0, // Mocked for now
        'Line Total': Number(item.priceAtTime) * item.quantity
      }))
    )

    // Prepare Sheet 3: Customers
    // Group unique customers
    const uniqueUsers = Array.from(new Set(orders.map(o => o.user.id))).map(userId => {
      const userOrders = orders.filter(o => o.user.id === userId)
      const user = userOrders[0].user
      return {
        'Customer ID': user.id,
        'Name': `${user.customerProfile?.firstName || ''} ${user.customerProfile?.lastName || ''}`.trim(),
        'Email': user.email,
        'Phone': user.customerProfile?.phone || '',
        'Order Count': userOrders.length,
        'Latest Order Date': new Date(Math.max(...userOrders.map(o => new Date(o.createdAt).getTime()))).toISOString()
      }
    })

    const wb = XLSX.utils.book_new()
    
    const wsOrders = XLSX.utils.json_to_sheet(ordersData)
    XLSX.utils.book_append_sheet(wb, wsOrders, 'Orders')

    const wsItems = XLSX.utils.json_to_sheet(orderItemsData)
    XLSX.utils.book_append_sheet(wb, wsItems, 'Order Items')

    const wsCustomers = XLSX.utils.json_to_sheet(uniqueUsers)
    XLSX.utils.book_append_sheet(wb, wsCustomers, 'Customers')

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    const dateStr = new Date().toISOString().split('T')[0]
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="ZEN_ARCH_Orders_${dateStr}.xlsx"`
      }
    })
  } catch (err: any) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
}
