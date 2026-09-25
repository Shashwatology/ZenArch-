import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getSavedProducts } from '@/lib/actions/wishlist'

export default async function WishlistPage() {
  const products = await getSavedProducts()

  return (
    <div className="p-8 md:p-12 space-y-8">
      <div className="border-b border-zen-border pb-6">
        <h1 className="font-serif text-3xl text-zen-black">Saved Products</h1>
        <p className="text-sm text-zen-taupe mt-2 font-light">Your curated selection of Zen Arch pieces.</p>
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center text-zen-taupe text-sm">
          You haven't saved any products yet.
          <div className="mt-4">
            <Link href="/furniture" className="text-zen-black border-b border-zen-black pb-1 hover:text-zen-accent hover:border-zen-accent transition-colors">
              Explore Collections
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <Link href={`/furniture/${p.slug}`} key={p.id} className="group flex flex-col h-full border border-zen-border p-4 hover:border-zen-black transition-colors bg-zen-ivory">
              <div className="relative aspect-square mb-4 bg-zen-stone/10 overflow-hidden">
                {p.images[0] ? (
                  <Image
                    src={p.images[0].url}
                    alt={p.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zen-taupe text-xs font-mono">NO IMAGE</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-zen-black">{p.name}</h3>
                <span className="text-[10px] uppercase font-mono tracking-widest text-zen-charcoal">
                  {p.collection?.name || 'Collection'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
