// app/artists/[slug]/page.tsx - Following Site Design Pattern

import { client, urlFor } from '@/lib/sanity';
import { Artist } from '@/types';
import { SanityArtist, adaptSanityArtist } from '@/types/sanity-adapters';
import Image from 'next/image';
import Link from 'next/link';
import V2Layout from '@/components/v2/Layout';
import { notFound } from 'next/navigation';
import styles from '@/components/styles/ArtistDetail.module.scss';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata-utils';

const ARTIST_BY_SLUG_QUERY = `*[_type == "artist" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  image,
  genre,
  bio,
  socialLinks,
  performanceDay,
  performanceTime,
  stage,
  featured
}`;

async function getArtist(
  slug: string
): Promise<{ artist: Artist | null; sanityArtist: SanityArtist | null }> {
  try {
    const sanityArtist: SanityArtist = await client.fetch(
      ARTIST_BY_SLUG_QUERY,
      { slug }
    );
    if (!sanityArtist) return { artist: null, sanityArtist: null };
    const artist = adaptSanityArtist(sanityArtist);
    return { artist, sanityArtist };
  } catch (error) {
    console.error('Error fetching artist:', error);
    return { artist: null, sanityArtist: null };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { artist, sanityArtist } = await getArtist(slug)

  if (!artist || !sanityArtist) {
    return createPageMetadata({
      title: 'Artist Not Found | Shakara Festival',
      description: 'The artist you are looking for could not be found.',
      path: `/artists/${slug}`,
    })
  }

  const descriptionSource = artist.bio?.split('\n').join(' ') ?? ''
  const description = descriptionSource
    ? `${descriptionSource.slice(0, 155)}${descriptionSource.length > 155 ? '…' : ''}`
    : `Discover ${artist.name} performing live at Shakara Festival 2025 in Lagos, Nigeria.`

  const image = sanityArtist.image
    ? {
        url: urlFor(sanityArtist.image).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: `${artist.name} performing at Shakara Festival`,
      }
    : undefined

  return createPageMetadata({
    title: `${artist.name} | Shakara Festival 2025`,
    description,
    path: `/artists/${sanityArtist.slug.current}`,
    image,
    openGraph: {
      type: 'profile',
      firstName: artist.name?.split(' ')[0],
      lastName: artist.name?.split(' ').slice(1).join(' ') || undefined,
    },
  })
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { artist, sanityArtist } = await getArtist(slug);

  if (!artist || !sanityArtist) {
    notFound();
  }

  const stageName =
    {
      main: 'Main Stage',
      secondary: 'Secondary Stage',
      club: 'Club Stage',
      acoustic: 'Acoustic Stage',
    }[artist.stage || ''] || artist.stage;

  const dayName = artist.day ? `Day ${artist.day}` : null;

  return (
    <V2Layout>
      <div className={styles.artistPage}>
        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.container}>
            {/* Back Navigation */}
            <nav className={styles.breadcrumb}>
              <Link
                href="/lineup"
                className={styles.backLink}
                aria-label="Back to Lineup"
              >
                <svg
                  className={styles.backIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Lineup
              </Link>
            </nav>

          {/* Artist Content Grid */}
          <div className={styles.artistGrid}>
            {/* Artist Image Section */}
            <div className={styles.imageSection}>
              <div className={styles.imageContainer}>
                {sanityArtist.image ? (
                  <Image
                    src={urlFor(sanityArtist.image).width(800).height(800).url()}
                    alt={artist.name}
                    fill
                    className={styles.artistImage}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <span className={styles.placeholderText}>
                      {artist.name.charAt(0)}
                    </span>
                  </div>
                )}

                {sanityArtist.featured && (
                  <div className={styles.featuredBadge}>
                    <span>Featured Artist</span>
                  </div>
                )}
              </div>

              {/* Genre Badge - Mobile positioned here */}
              {artist.genre && (
                <div className={styles.genreBadgeMobile}>
                  {artist.genre}
                </div>
              )}
            </div>

            {/* Artist Details Section */}
            <div className={styles.detailsSection}>
              <header className={styles.artistHeader}>
                <h1 className={styles.artistName}>
                  {artist.name}
                </h1>

                {/* Genre Badge - Desktop positioned here */}
                {artist.genre && (
                  <div className={styles.genreBadgeDesktop}>
                    {artist.genre}
                  </div>
                )}
              </header>

              {/* Performance Details */}
              {(artist.day || artist.time || artist.stage) && (
                <section className={styles.performanceCard}>
                  <h2 className={styles.cardTitle}>Performance Details</h2>
                  <div className={styles.performanceGrid}>
                    {dayName && (
                      <div className={styles.performanceItem}>
                        <span className={styles.performanceLabel}>Day</span>
                        <span className={styles.performanceValue}>{dayName}</span>
                      </div>
                    )}
                    {artist.time && (
                      <div className={styles.performanceItem}>
                        <span className={styles.performanceLabel}>Time</span>
                        <span className={styles.performanceValue}>{artist.time}</span>
                      </div>
                    )}
                    {stageName && (
                      <div className={styles.performanceItem}>
                        <span className={styles.performanceLabel}>Stage</span>
                        <span className={styles.performanceValue}>{stageName}</span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Biography */}
              {artist.bio && (
                <section className={styles.bioSection}>
                  <h2 className={styles.sectionTitle}>Biography</h2>
                  <div className={styles.bioText}>
                    {artist.bio.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              )}

              {/* Social Links */}
              {artist.socialLinks &&
                Object.values(artist.socialLinks).some((link) => link) && (
                  <section className={styles.socialSection}>
                    <h2 className={styles.sectionTitle}>Follow</h2>
                    <div className={styles.socialLinks}>
                      {artist.socialLinks.instagram && (
                        <a
                          href={artist.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.socialLink} ${styles.instagram}`}
                          aria-label={`Follow ${artist.name} on Instagram`}
                        >
                          <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          Instagram
                        </a>
                      )}

                      {artist.socialLinks.twitter && (
                        <a
                          href={artist.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.socialLink} ${styles.twitter}`}
                          aria-label={`Follow ${artist.name} on Twitter`}
                        >
                          <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          Twitter
                        </a>
                      )}

                      {artist.socialLinks.spotify && (
                        <a
                          href={artist.socialLinks.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.socialLink} ${styles.spotify}`}
                          aria-label={`Listen to ${artist.name} on Spotify`}
                        >
                          <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                          Spotify
                        </a>
                      )}
                    </div>
                  </section>
                )}

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <Link href="/schedule" className={styles.ticketButton}>
                  View Full Schedule
                </Link>
                <Link href="/tickets" className={styles.ticketButton}>
                  Get Tickets
                </Link>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </V2Layout>
  );
}