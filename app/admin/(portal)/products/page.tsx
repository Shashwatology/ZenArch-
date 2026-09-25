import prisma from '@/lib/prisma'
import Link from 'next/link'


export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      collection: true,
      category: true,
      inventory: true
    },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Products</h2>
          <p className="text-sm text-gray-400">Manage your catalogue</p>
        </div>
        <button className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Add Product
        </button>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Collection</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{product.name}</span>
                      <span className="text-xs text-gray-500 mt-1">{product.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {product.basePrice ? `₹${product.basePrice.toLocaleString('en-IN')}` : 'ON REQUEST'}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {product.collection?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/products/${product.id}`}
                      className="text-[#C8A97E] hover:text-white transition-colors text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
