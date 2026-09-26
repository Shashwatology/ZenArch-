import { getProductBySlug } from '@/lib/catalog/products'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CheckoutClient } from './CheckoutClient'
import prisma from '@/lib/prisma'

export default async function CheckoutPage({ 
  params,
  searchParams
}: { 
  params: { slug: string }
  searchParams: { variant?: string }
}) {
  const { slug } = await params
  const { variant } = await searchParams

  const dbProduct = await getProductBySlug(slug)
  if (!dbProduct) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to login with a returnUrl if we had a way, but simple redirect is fine
    redirect(`/login?redirect=/checkout/${slug}?variant=${variant || 0}`)
  }

  // Ensure DB user
  let dbUser = await prisma.user.findUnique({
    where: { email: user.email! }
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email!,
        role: 'CUSTOMER',
        customerProfile: { create: {} }
      }
    })
  }

  const variantIndex = variant ? parseInt(variant, 10) : 0
  const selectedVariant = dbProduct.variants[variantIndex] || dbProduct.variants[0]

  let price = selectedVariant?.priceInr?.toNumber() || dbProduct.basePrice?.toNumber() || 0

  return (
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-serif text-4xl mb-8">Secure Checkout</h1>
        
        <div className="mb-12 p-6 bg-white border border-zen-border">
          <h2 className="font-sans text-xs uppercase tracking-widest text-zen-taupe mb-4">Order Summary</h2>
          <div className="flex justify-between items-start pb-4 border-b border-zen-border">
            <div>
              <p className="font-serif text-xl">{dbProduct.name}</p>
              {selectedVariant && <p className="text-sm text-zen-charcoal">Variant: {selectedVariant.name}</p>}
            </div>
            <p className="font-mono">₹{price.toLocaleString('en-IN')}</p>
          </div>
          <div className="flex justify-between items-center pt-4 font-bold">
            <p>Total (Excl. Shipping)</p>
            <p className="font-mono text-xl text-zen-accent">₹{price.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <CheckoutClient 
          productId={dbProduct.id} 
          variantId={selectedVariant?.id} 
          price={price} 
        />
      </div>
    </div>
  )
}
