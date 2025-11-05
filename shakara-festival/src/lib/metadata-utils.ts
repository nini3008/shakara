import type { Metadata } from 'next'

const DEFAULT_SITE_URL = 'https://shakarafestival.com'

type ImageInput = {
  url: string
  width?: number
  height?: number
  alt?: string
}

export type CreateMetadataOptions = {
  title: Metadata['title']
  description: string
  path?: string
  image?: ImageInput
  images?: ImageInput[]
  keywords?: string[]
  robots?: Metadata['robots']
  openGraph?: Partial<NonNullable<Metadata['openGraph']>>
  twitter?: Partial<NonNullable<Metadata['twitter']>>
  extra?: Partial<Metadata>
}

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export const getSiteUrl = (): string => {
  const envValue = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!envValue) {
    return DEFAULT_SITE_URL
  }

  try {
    const url = new URL(envValue)
    return trimTrailingSlash(url.toString())
  } catch {
    // If the env value is not a valid URL, fall back to the default
    return DEFAULT_SITE_URL
  }
}

export const buildCanonicalUrl = (path: string = '/'): string => {
  const baseUrl = trimTrailingSlash(getSiteUrl())

  if (!path || path === '/') {
    return `${baseUrl}/`
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

export const toAbsoluteUrl = (value: string): string => {
  if (!value) {
    return buildCanonicalUrl('/')
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  const normalized = value.startsWith('/') ? value : `/${value}`
  return `${trimTrailingSlash(getSiteUrl())}${normalized}`
}

export const createPageMetadata = ({
  title,
  description,
  path = '/',
  image,
  images,
  keywords,
  robots,
  openGraph,
  twitter,
  extra,
}: CreateMetadataOptions): Metadata => {
  const resolvedTitle = typeof title === 'string' ? title : title?.default ?? 'Shakara Festival'
  const canonical = buildCanonicalUrl(path)
  const metadataBase = new URL(getSiteUrl() + '/')
  const imageList = (images ?? (image ? [image] : [DEFAULT_IMAGE])).map((item) => ({
    ...item,
    url: toAbsoluteUrl(item.url),
  }))

  const defaultOpenGraph: NonNullable<Metadata['openGraph']> = {
    title: resolvedTitle,
    description,
    url: canonical,
    siteName: 'Shakara Festival',
    locale: 'en_US',
    type: 'website',
    images: imageList,
  }

  const defaultTwitter: NonNullable<Metadata['twitter']> = {
    card: 'summary_large_image',
    title: resolvedTitle,
    description,
    images: imageList.map((item) => item.url),
  }

  const computedMetadata: Metadata = {
    metadataBase,
    title,
    description,
    keywords,
    robots,
    alternates: {
      canonical,
    },
    openGraph: {
      ...defaultOpenGraph,
      ...openGraph,
    },
    twitter: {
      ...defaultTwitter,
      ...twitter,
    },
  }

  const mergedMetadata: Metadata = {
    ...extra,
    ...computedMetadata,
    alternates: {
      ...(extra?.alternates ?? {}),
      ...(computedMetadata.alternates ?? {}),
    },
    openGraph: {
      ...(computedMetadata.openGraph ?? {}),
      ...(extra?.openGraph ?? {}),
    },
    twitter: {
      ...(computedMetadata.twitter ?? {}),
      ...(extra?.twitter ?? {}),
    },
  }

  if (mergedMetadata.openGraph) {
    mergedMetadata.openGraph.images = mergedMetadata.openGraph.images ?? imageList
  }

  if (mergedMetadata.twitter) {
    mergedMetadata.twitter.images = mergedMetadata.twitter.images ?? imageList.map((item) => item.url)
  }

  return mergedMetadata
}

export const DEFAULT_IMAGE: ImageInput = {
  url: '/images/SHAKARAGradient.png',
  width: 1200,
  height: 630,
  alt: 'Shakara Festival',
}


