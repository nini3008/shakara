import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com'
  const now = new Date()

  const staticPaths = [
    '/',
    '/about',
    '/lineup',
    '/schedule',
    '/artists',
    '/tickets',
    '/vendors',
    '/partnership',
    '/faq',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '/' ? 1 : 0.7,
  }))

  // Dynamic artist pages
  const artistSlugs: string[] = await client.fetch(
    "*[_type == 'artist' && defined(slug.current)][].slug.current"
  )

  const artistEntries: MetadataRoute.Sitemap = (artistSlugs || []).map((slug) => ({
    url: `${base}/artists/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticEntries, ...artistEntries]
}


