import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2 } from 'lucide-react'
import type { PortableTextBlock } from '@/types'

import LayoutWrapper from '@/components/v2/LayoutWrapper'
import BlogContent from '@/components/BlogContent'
import styles from './BlogPost.module.scss'
import { client, BLOG_POST_BY_SLUG_QUERY, BLOG_POSTS_QUERY } from '@/lib/sanity'
import { adaptSanityBlogPost, type SanityBlogPost } from '@/types/sanity-adapters'
import type { BlogPost } from '@/types'

export const revalidate = 120

const PAGE_REVALIDATE_SECONDS = revalidate

type BlogPageProps = {
  params: Promise<{ slug: string }>
}

const formatDate = (isoDate: string) => {
  try {
    return format(new Date(isoDate), 'MMMM d, yyyy')
  } catch (error) {
    return isoDate
  }
}

const countWordsFromPortableText = (content: BlogPost['content']) => {
  return content.reduce((count, block) => {
    if ((block as PortableTextBlock)?._type === 'block') {
      const text = ((block as PortableTextBlock).children ?? [])
        .map((child) => (child as { text?: string }).text ?? '')
        .join(' ')
      return count + text.split(/\s+/).filter(Boolean).length
    }
    return count
  }, 0)
}

const estimateReadTime = (post: BlogPost) => {
  if (post.estimatedReadTime && post.estimatedReadTime > 0) {
    return post.estimatedReadTime
  }

  const wordCount = countWordsFromPortableText(post.content) + post.excerpt.split(/\s+/).length
  return Math.max(1, Math.round(wordCount / 220))
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const data = await client.fetch<SanityBlogPost | null>(
      BLOG_POST_BY_SLUG_QUERY,
      { slug },
      {
        cache: 'no-store',
        next: { revalidate: PAGE_REVALIDATE_SECONDS },
      },
    )

    return data ? adaptSanityBlogPost(data) : null
  } catch (error) {
    console.error(`Error fetching blog post for slug ${slug}:`, error)
    return null
  }
}

async function getMorePosts(excludeId: string): Promise<BlogPost[]> {
  try {
    const data = await client.fetch<SanityBlogPost[]>(
      BLOG_POSTS_QUERY,
      {},
      {
        cache: 'no-store',
        next: { revalidate: PAGE_REVALIDATE_SECONDS },
      },
    )

    return data
      .map(adaptSanityBlogPost)
      .filter((post) => post.id !== excludeId)
      .slice(0, 3)
  } catch (error) {
    console.error('Error fetching additional blog posts:', error)
    return []
  }
}

const buildCanonicalUrl = (slug: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com'
  return `${baseUrl.replace(/\/$/, '')}/blog/${slug}`
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Article not found',
      description: 'The article you are looking for does not exist.',
    }
  }

  const canonicalUrl = buildCanonicalUrl(slug)
  const title = post.seo?.title ?? post.title
  const description = post.seo?.description ?? post.excerpt

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: post.featuredImage?.url
        ? [
            {
              url: post.featuredImage.url,
              width: post.featuredImage.width ?? 1200,
              height: post.featuredImage.height ?? 630,
              alt: post.featuredImage.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
    },
  }
}

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'Twitter',
  facebook: 'Facebook',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  website: 'Website',
}

export default async function BlogArticlePage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const readTime = estimateReadTime(post)
  const canonicalUrl = buildCanonicalUrl(slug)
  const morePosts = await getMorePosts(post.id)

  const heroWidth = post.featuredImage?.width ?? 1600
  const heroHeight = post.featuredImage?.height ?? Math.round(heroWidth * 0.6)

  return (
    <LayoutWrapper currentPageName="Blog">
      <article className={styles.page}>
        <div className={styles.container}>
          <Link href="/blog" className={styles.backLink}>
            <ArrowLeft size={18} /> Back to blog
          </Link>

          <header className={styles.header}>
            <span className={styles.kicker}>Festival Journal</span>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <Calendar size={16} />
                {formatDate(post.publishedAt)}
              </span>
              <span className={styles.metaItem}>
                <Clock size={16} />
                {readTime} min read
              </span>
            </div>
          </header>

          {post.featuredImage?.url && (
            <div className={styles.heroImageBlock}>
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                width={heroWidth}
                height={heroHeight}
                className={styles.heroImage}
                sizes="(max-width: 1024px) 100vw, 1200px"
                placeholder={post.featuredImage.lqip ? 'blur' : 'empty'}
                blurDataURL={post.featuredImage.lqip}
                priority
              />
              {post.featuredImage.caption && (
                <div className={styles.heroCaption}>{post.featuredImage.caption}</div>
              )}
            </div>
          )}

          {post.excerpt && <p className={styles.lead}>{post.excerpt}</p>}

          <div className={styles.authorCard}>
            <div className={styles.authorAvatar}>
              {post.author.profileImage?.url ? (
                <Image
                  src={post.author.profileImage.url}
                  alt={post.author.profileImage.alt ?? post.author.name}
                  fill
                  sizes="64px"
                  placeholder={post.author.profileImage.lqip ? 'blur' : 'empty'}
                  blurDataURL={post.author.profileImage.lqip}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  color: 'rgba(255,255,255,0.8)',
                }}>
                  {post.author.name.charAt(0)}
                </div>
              )}
            </div>

            <div className={styles.authorDetails}>
              <span className={styles.authorName}>{post.author.name}</span>
              {post.author.bio && <p className={styles.authorBio}>{post.author.bio}</p>}
              <div className={styles.authorLinks}>
                {Object.entries(post.author.socialLinks)
                  .filter(([, url]) => Boolean(url))
                  .map(([platform, url]) => (
                    <a key={platform} href={url!} target="_blank" rel="noopener noreferrer">
                      {SOCIAL_LABELS[platform] ?? platform}
                    </a>
                  ))}
              </div>
            </div>
          </div>

          <div className={styles.contentWrap}>
            <BlogContent value={post.content} />

            <div className={styles.shareBar}>
              <Share2 size={18} />
              <span>Share this story</span>
              <div className={styles.shareLinks}>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.title)}`}
                  aria-label="Share on Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                  aria-label="Share on Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fb
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(canonicalUrl)}&title=${encodeURIComponent(post.title)}`}
                  aria-label="Share on LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  In
                </a>
              </div>
            </div>
          </div>

          {morePosts.length > 0 && (
            <section className={styles.moreStories} aria-labelledby="more-stories">
              <h2 id="more-stories" className={styles.moreTitle}>
                Keep Reading
              </h2>
              <div className={styles.moreGrid}>
                {morePosts.map((item) => (
                  <Link key={item.id} href={`/blog/${item.slug}`} className={styles.moreCard}>
                    <span className={styles.moreDate}>{formatDate(item.publishedAt)}</span>
                    <span className={styles.moreHeadline}>{item.title}</span>
                    <span className={styles.moreLink}>
                      Read story <ArrowRight size={16} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </LayoutWrapper>
  )
}

