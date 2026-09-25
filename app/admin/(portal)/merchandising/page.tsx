import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminMerchandisingPage() {
  const bestSellers = await prisma.product.findMany({
    where: { isBestSeller: true },
    select: { id: true, name: true, slug: true, status: true }
  })

  const featured = await prisma.product.findMany({
    where: { isFeatured: true },
    select: { id: true, name: true, slug: true, status: true }
  })

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-light tracking-wider text-white mb-2">Merchandising</h2>
        <p className="text-sm text-gray-400">Manage featured and best-selling products for the public website</p>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden p-6">
        <h3 className="text-lg font-medium text-white mb-4">Best Sellers</h3>
        <p className="text-sm text-gray-400 mb-6">These products appear in the "Best Sellers" section on the homepage.</p>
        
        {bestSellers.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No products marked as best sellers.</p>
        ) : (
          <ul className="space-y-2">
            {bestSellers.map(p => (
              <li key={p.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.slug}</p>
                </div>
                <Link href={`/admin/products/${p.id}`} className="text-[#C8A97E] text-xs font-medium hover:underline">
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden p-6">
        <h3 className="text-lg font-medium text-white mb-4">Featured Products</h3>
        <p className="text-sm text-gray-400 mb-6">These products are highlighted throughout the site.</p>
        
        {featured.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No products marked as featured.</p>
        ) : (
          <ul className="space-y-2">
            {featured.map(p => (
              <li key={p.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.slug}</p>
                </div>
                <Link href={`/admin/products/${p.id}`} className="text-[#C8A97E] text-xs font-medium hover:underline">
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
