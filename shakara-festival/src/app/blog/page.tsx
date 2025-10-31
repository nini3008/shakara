import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowRight, Calendar, Clock } from 'lucide-react'

import LayoutWrapper from '@/components/v2/LayoutWrapper'
import styles from './Blog.module.scss'
import { client, BLOG_POSTS_QUERY } from '@/lib/sanity'
import { adaptSanityBlogPost, type SanityBlogPost } from '@/types/sanity-adapters'
import type { BlogPost } from '@/types'

export const revalidate = 120

const PAGE_REVALIDATE_SECONDS = revalidate

export const metadata: Metadata = {
  title: 'Festival Blog',
  description:
    'Stories, announcements, and behind-the-scenes notes from the Shakara Festival team. Discover artist spotlights, festival guides, and culture features.',
  openGraph: {
    title: 'Shakara Festival Blog',
    description:
      'Stories, announcements, and behind-the-scenes notes from the Shakara Festival team. Discover artist spotlights, festival guides, and culture features.',
    url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com') + '/blog',
    type: 'website',
    images: [
      {
        url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com') + '/images/SHAKARAGradient.png',
        width: 1200,
        height: 630,
        alt: 'Shakara Festival Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shakara Festival Blog',
    description: 'Catch the latest Shakara Festival news and editorials.',
    images: [
      (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com') + '/images/SHAKARAGradient.png',
    ],
  },
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await client.fetch<SanityBlogPost[]>(
      BLOG_POSTS_QUERY,
      {},
      {
        cache: 'no-store',
        next: { revalidate: PAGE_REVALIDATE_SECONDS },
      },
    )

    const mapped = data.map(adaptSanityBlogPost)
    const filtered = mapped.filter((post) => {
      const hasSlug = Boolean(post.slug && post.slug.trim())
      const isPublished = post.status === 'published'
      return hasSlug && isPublished
    })
    return filtered
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

const formatDate = (isoDate: string) => {
  try {
    return format(new Date(isoDate), 'MMMM d, yyyy')
  } catch (error) {
    return isoDate
  }
}

const truncate = (text: string, charLimit = 180) => {
  if (!text) return ''
  if (text.length <= charLimit) return text
  return `${text.slice(0, charLimit).trimEnd()}…`
}

type FeaturedPostProps = {
  post: BlogPost
}

function FeaturedPost({ post }: FeaturedPostProps) {
  const hasSlug = Boolean(post.slug && post.slug.trim())
  const href = hasSlug ? `/blog/${post.slug}` : '#'

  return (
    <article className={styles.hero}>
      {post.featuredImage?.url && (
        <div className={styles.heroImageWrapper}>
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt ?? post.title}
            fill
            priority
            className={styles.heroImage}
            sizes="(max-width: 768px) 100vw, 1160px"
          />
        </div>
      )}

      <div className={styles.heroContent}>
        <div className={styles.heroMeta}>
          <span>
            <Calendar size={16} />
            {formatDate(post.publishedAt)}
          </span>
          {post.estimatedReadTime && post.estimatedReadTime > 0 && (
            <span>
              <Clock size={16} />
              {post.estimatedReadTime} min read
            </span>
          )}
        </div>

        <h2 className={styles.heroTitle}>{post.title}</h2>
        {post.excerpt && <p className={styles.heroExcerpt}>{truncate(post.excerpt, 220)}</p>}

        <div className={styles.heroActions}>
          <Link
            href={href}
            className={`${styles.heroButton} ${!hasSlug ? styles.disabledButton : ''}`}
            prefetch={hasSlug}
            aria-disabled={!hasSlug}
            onClick={(event) => {
              if (!hasSlug) {
                event.preventDefault()
              }
            }}
          >
            Read full story
            <ArrowRight size={18} />
          </Link>

          {post.author && (
            <span className={styles.heroAuthor}>
              {post.author.profileImage?.url && (
                <Image
                  src={post.author.profileImage.url}
                  alt={post.author.profileImage.alt ?? post.author.name}
                  width={32}
                  height={32}
                />
              )}
              By {post.author.name}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

type PostCardProps = {
  post: BlogPost
}

function PostCard({ post }: PostCardProps) {
  const hasSlug = Boolean(post.slug && post.slug.trim())
  const href = hasSlug ? `/blog/${post.slug}` : '#'

  return (
    <article className={styles.postCard}>
      {post.featuredImage?.url && (
        <div className={styles.postImageWrapper}>
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt ?? post.title}
            fill
            className={styles.postImage}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}

      <div className={styles.postContent}>
        <div className={styles.postMeta}>{formatDate(post.publishedAt)}</div>
        <h3 className={styles.postTitle}>{post.title}</h3>
        {post.excerpt && <p className={styles.postExcerpt}>{truncate(post.excerpt)}</p>}
        <Link
          href={href}
          className={`${styles.readMore} ${!hasSlug ? styles.disabledLink : ''}`}
          prefetch={hasSlug}
          aria-disabled={!hasSlug}
          onClick={(event) => {
            if (!hasSlug) {
              event.preventDefault()
            }
          }}
        >
          Read more
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  const featuredPost = posts.find((post) => post.featured) ?? posts[0]
  const restPosts = featuredPost
    ? posts.filter((post) => post.id !== featuredPost.id)
    : posts

  return (
    <LayoutWrapper currentPageName="Blog">
      <section className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.kicker}>Festival Journal</div>
            <h1 className={styles.title}>Stories from Shakara</h1>
            <p className={styles.subtitle}>
              Dive into artist spotlights, cultural deep-dives, planning guides, and exclusive updates from the team building Africa&apos;s
              most electric festival experience.
            </p>
          </header>

          {featuredPost ? (
            <FeaturedPost post={featuredPost} />
          ) : (
            <div className={styles.emptyState}>
              We&apos;re crafting our first stories. Check back soon for festival news, interviews, and insider updates.
            </div>
          )}

          {restPosts.length > 0 && (
            <section className={styles.postsSection} aria-labelledby="latest-stories">
              <div className={styles.sectionHeading}>
                <h2 id="latest-stories" className={styles.sectionTitle}>
                  Latest Stories
                </h2>
              </div>

              <div className={styles.postsGrid}>
                {restPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </LayoutWrapper>
  )
}
