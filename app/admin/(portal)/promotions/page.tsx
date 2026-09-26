import prisma from '@/lib/prisma'
import { PromotionsClient } from './PromotionsClient'

export const dynamic = 'force-dynamic'

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return <PromotionsClient promotions={promotions} />
}
