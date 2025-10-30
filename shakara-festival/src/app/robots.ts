import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout', '/success'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: 'shakarafestival.com',
  }
}


