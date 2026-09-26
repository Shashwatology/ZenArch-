import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminMerchandisingPage() {
  const [featuredProducts, bestSellers] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true, status: 'PUBLISHED' },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.product.findMany({
      where: { isBestSeller: true, status: 'PUBLISHED' },
      orderBy: { updatedAt: 'desc' }
    })
  ])

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-light tracking-wider text-white mb-2">Merchandising</h2>
        <p className="text-sm text-gray-400">Control product visibility and highlighting across the public site</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Featured Products */}
        <div className="bg-[#1E1E1E] border border-white/5 rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-medium text-white mb-2">Featured Products</h3>
            <p className="text-xs text-gray-500">
              These products appear prominently in collection views, search priority, and dedicated featured sections.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            {featuredProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No products are currently marked as featured.
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {featuredProducts.map(product => (
                  <li key={product.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex flex-col">
                      <Link href={`/admin/products/${product.id}`} className="font-medium text-white hover:text-[#C8A97E] text-sm">
                        {product.name}
                      </Link>
                      <span className="text-xs text-gray-500">{product.slug}</span>
                    </div>
                    <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">Featured</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 border-t border-white/5 bg-[#121212]">
            <Link href="/admin/products" className="text-xs text-[#C8A97E] hover:underline">
              Manage in Product Studio &rarr;
            </Link>
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-[#1E1E1E] border border-white/5 rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-medium text-white mb-2">Best Sellers</h3>
            <p className="text-xs text-gray-500">
              These products populate the "Best Sellers" ribbon on the homepage and store.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            {bestSellers.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No products are currently marked as best sellers.
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {bestSellers.map(product => (
                  <li key={product.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex flex-col">
                      <Link href={`/admin/products/${product.id}`} className="font-medium text-white hover:text-[#C8A97E] text-sm">
                        {product.name}
                      </Link>
                      <span className="text-xs text-gray-500">{product.slug}</span>
                    </div>
                    <span className="text-xs text-orange-500 bg-orange-500/10 px-2 py-1 rounded">Best Seller</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 border-t border-white/5 bg-[#121212]">
            <Link href="/admin/products" className="text-xs text-[#C8A97E] hover:underline">
              Manage in Product Studio &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
