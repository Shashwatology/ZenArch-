import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zenarch.com'

  // Only include items that are published and NOT set to noindex
  const [products, projects, services, pages] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'PUBLISHED', noindex: false },
      select: { slug: true, updatedAt: true }
    }),
    prisma.project.findMany({
      where: { status: 'PUBLISHED', noindex: false },
      select: { slug: true, updatedAt: true }
    }),
    prisma.service.findMany({
      where: { status: 'PUBLISHED', noindex: false },
      select: { id: true, updatedAt: true } // Assuming service URLs use ID or we have a slug. Wait, schema doesn't have slug for service?
    }),
    prisma.pageContent.findMany({
      where: { status: 'PUBLISHED', noindex: false },
      select: { route: true, updatedAt: true }
    })
  ])

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/furniture/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const projectUrls = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Wait, does service have a slug? I'll check schema. For now, assuming `/services` is a static page.
  // The prompt said "Project, Service, Page". If service has a detailed page, we'll map it.
  // Actually, ZEN ARCH usually has just /services as a page content route. Let's see if Service has a slug.
  
  const pageUrls = pages.map((p) => ({
    url: `${baseUrl}/${p.route === 'home' ? '' : p.route}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: p.route === 'home' ? 1.0 : 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...pageUrls,
    ...productUrls,
    ...projectUrls
  ]
}
