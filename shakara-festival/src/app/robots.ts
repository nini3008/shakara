import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/metadata-utils'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()
  const host = (() => {
    try {
      return new URL(base).hostname
    } catch {
      return 'shakarafestival.com'
    }
  })()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout', '/success'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host,
  }
}


