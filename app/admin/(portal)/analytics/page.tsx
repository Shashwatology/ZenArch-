import prisma from '@/lib/prisma'
import { AnalyticsClient } from './AnalyticsClient'
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  noStore()
  
  // Aggregate basic overview data
  const totalEvents = await prisma.analyticsEvent.count()
  
  const pageViews = await prisma.analyticsEvent.count({
    where: { eventName: 'page_view' }
  })
  
  const productViews = await prisma.analyticsEvent.count({
    where: { eventName: 'product_view' }
  })
  
  const quotesCreated = await prisma.analyticsEvent.count({
    where: { eventName: 'quote_created' }
  })
  
  const topProducts = await prisma.analyticsEvent.groupBy({
    by: ['properties'],
    where: { eventName: 'product_view' },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5
  })
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-light tracking-wider text-white">Unified Analytics</h1>
          <p className="text-sm text-gray-400 mt-2">First-party metrics, attribution, and business funnel.</p>
        </div>
      </div>
      
      <AnalyticsClient 
        initialData={{
          totalEvents,
          pageViews,
          productViews,
          quotesCreated,
          topProducts
        }}
      />
    </div>
  )
}
