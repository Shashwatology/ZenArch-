import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zenarch.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/account/',
        '/api/',
        '/_next/',
        '/shared/board/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
