import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowRight, Calendar, Clock } from 'lucide-react'

import LayoutWrapper from '@/components/v2/LayoutWrapper'
import styles from './Blog.module.scss'
import { client, BLOG_POSTS_QUERY } from '@/lib/sanity'
import { adaptSanityBlogPost, type SanityBlogPost } from '@/types/sanity-adapters'
import type { BlogPost } from '@/types'
import { createPageMetadata } from '@/lib/metadata-utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const PAGE_REVALIDATE_SECONDS = 0

export const metadata = createPageMetadata({
  title: 'Shakara Festival Blog | News, Lineup Drops & Festival Guides',
  description:
    'Stories, announcements, and behind-the-scenes notes from the Shakara Festival team. Discover artist spotlights, festival guides, and culture features.',
  path: '/blog',
})

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

    console.log('data', data)

    const mapped = data.map(adaptSanityBlogPost)
    console.log('mapped', mapped)
    const filtered = mapped.filter((post) => {
      const hasSlug = Boolean(post.slug && post.slug.trim())
      const isPublished = post.status === 'published'
      return hasSlug && isPublished
    })
    console.log('filtered', filtered)
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
            <article className={styles.hero}>
              {featuredPost.featuredImage?.url && (
                <div className={styles.heroImageWrapper}>
                  <Image
                    src={featuredPost.featuredImage.url}
                    alt={featuredPost.featuredImage.alt ?? featuredPost.title}
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
                    {formatDate(featuredPost.publishedAt)}
                  </span>
                  {featuredPost.estimatedReadTime && featuredPost.estimatedReadTime > 0 && (
                    <span>
                      <Clock size={16} />
                      {featuredPost.estimatedReadTime} min read
                    </span>
                  )}
                </div>

                <h2 className={styles.heroTitle}>{featuredPost.title}</h2>
                {featuredPost.excerpt && <p className={styles.heroExcerpt}>{truncate(featuredPost.excerpt, 220)}</p>}

                <div className={styles.heroActions}>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className={styles.heroButton}
                    prefetch
                  >
                    Read full story
                    <ArrowRight size={18} />
                  </Link>

                  {featuredPost.author && (
                    <span className={styles.heroAuthor}>
                      {featuredPost.author.profileImage?.url && (
                        <Image
                          src={featuredPost.author.profileImage.url}
                          alt={featuredPost.author.profileImage.alt ?? featuredPost.author.name}
                          width={32}
                          height={32}
                        />
                      )}
                      By {featuredPost.author.name}
                    </span>
                  )}
                </div>
              </div>
            </article>
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
                  <article key={post.id} className={styles.postCard}>
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
                      <Link href={`/blog/${post.slug}`} className={styles.readMore} prefetch>
                        Read more
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </LayoutWrapper>
  )
}
