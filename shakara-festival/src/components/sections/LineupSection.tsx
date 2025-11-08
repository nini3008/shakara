// components/sections/LineupSection.tsx - Updated to use CMS data

import { client, urlFor, FEATURED_ARTISTS_QUERY, ARTIST_QUERY, LINEUP_SECTION_QUERY } from '@/lib/sanity';
import { Artist } from '@/types';
import { SanityArtist, SanityLineupSection, adaptSanityArtist, adaptSanityLineupSection } from '@/types/sanity-adapters';
import Image from 'next/image';
import Link from 'next/link';
import styles from './LineupSection.module.scss';

async function getFeaturedArtists(): Promise<{ artists: Artist[], sanityArtists: SanityArtist[] }> {
  try {
    // First try to get featured artists
    const featuredSanityArtists: SanityArtist[] = await client.fetch(FEATURED_ARTISTS_QUERY);

    if (featuredSanityArtists.length > 0) {
      const artists = featuredSanityArtists.map(adaptSanityArtist);
      return { artists, sanityArtists: featuredSanityArtists };
    }

    // If no featured artists, get all artists as fallback
    const allSanityArtists: SanityArtist[] = await client.fetch(ARTIST_QUERY);
    const artists = allSanityArtists.map(adaptSanityArtist);
    return { artists, sanityArtists: allSanityArtists };
  } catch (error) {
    console.error('Error fetching artists:', error);
    return { artists: [], sanityArtists: [] };
  }
}

async function getLineupSectionData() {
  try {
    const lineupSectionData: SanityLineupSection = await client.fetch(LINEUP_SECTION_QUERY);
    return lineupSectionData ? adaptSanityLineupSection(lineupSectionData) : null;
  } catch (error) {
    console.error('Error fetching lineup section data:', error);
    return null;
  }
}

export default async function LineupSection() {
  const { artists, sanityArtists } = await getFeaturedArtists();
  const sectionData = await getLineupSectionData();

  // Fallback data if CMS fails
  const fallbackData = {
    title: 'Festival Lineup',
    introText: 'Experience the best of African music with world-class artists across multiple stages and genres.',
    stats: {
      artistCount: '50+',
      stageCount: '1',
      genreCount: '15'
    },
    ctaSection: {
      text: "Don't miss these incredible performances!",
      primaryButton: {
        text: 'Get Your Tickets',
        url: '/tickets',
        enabled: true
      },
      secondaryButton: {
        text: 'View Schedule',
        url: '#schedule',
        enabled: true
      }
    },
    emptyState: {
      title: 'Lineup Coming Soon',
      description: 'Get ready for an incredible lineup announcement featuring the best of African music!',
      buttonText: 'Get Notified',
      buttonUrl: '/newsletter'
    },
    featuredArtistCount: 8
  };

  const lineupData = sectionData || fallbackData;

  // Create a map of artist ID to sanity artist for reliable matching
  const artistIdToSanityMap = new Map<string, SanityArtist>();
  artists.forEach((artist, index) => {
    artistIdToSanityMap.set(artist.id, sanityArtists[index]);
  });

  // Sort artists by performance day (Day 1, Day 2, Day 3, etc.)
  const sortedArtists = [...artists].sort((a, b) => {
    // If both have days, sort by day number
    if (a.day && b.day) {
      return a.day - b.day;
    }
    // If only one has a day, put the one with day first
    if (a.day && !b.day) return -1;
    if (!a.day && b.day) return 1;
    // If neither has a day, maintain original order
    return 0;
  });

  // Create corresponding sorted sanity artists array using the map
  const sortedSanityArtists = sortedArtists.map(artist => {
    return artistIdToSanityMap.get(artist.id)!;
  });

  return (
    <section id="lineup" className={styles.lineupSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {lineupData.title}
        </h2>
        
        {/* Lineup intro with stats - now from CMS */}
        <div className={styles.lineupIntro}>
          <p className={styles.introText}>
            {lineupData.introText}
          </p>
          
          <div className={styles.lineupStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{lineupData.stats.artistCount}</span>
              <span className={styles.statLabel}>Artists</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{lineupData.stats.stageCount}</span>
              <span className={styles.statLabel}>{lineupData.stats.stageCount === '1' ? 'Stage' : 'Stages'}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{lineupData.stats.genreCount}</span>
              <span className={styles.statLabel}>Genres</span>
            </div>
          </div>
        </div>
        
        {/* Artist grid */}
        {sortedArtists.length > 0 ? (
          <>
            <div className={styles.artistsGrid}>
              {sortedArtists.slice(0, lineupData.featuredArtistCount).map((artist, index) => {
                const sanityArtist = sortedSanityArtists[index];
                return (
                  <div key={artist.id} className={styles.artistGroup}>
                    <Link href={`/artists/${sanityArtist.slug.current}`}>
                      <div className={styles.artistCard}>
                        {sanityArtist.image ? (
                          <div className={styles.imageContainer}>
                            <Image
                              src={urlFor(sanityArtist.image).width(400).height(400).url()}
                              alt={artist.name}
                              fill
                              className={styles.artistImage}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            />
                            <div className={styles.imageOverlay} />
                            {index < 3 && (
                              <div className={styles.featuredBadge}>
                                <span className={styles.badge}>
                                  Featured
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={styles.placeholderImage}>
                            <span className={styles.placeholderText}>
                              {artist.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        
                        <div className={styles.cardContent}>
                          <h3 className={styles.artistName}>{artist.name}</h3>
                          
                          {artist.genre && (
                            <p className={styles.artistGenre}>
                              {artist.genre}
                            </p>
                          )}
                          
                          {(artist.day || artist.stage) && (
                            <div className={styles.artistMeta}>
                              {artist.day && (
                                <span>Day {artist.day}</span>
                              )}
                              {artist.day && artist.stage && <span> • </span>}
                              {artist.stage && (
                                <span>
                                  {artist.stage === 'main' ? 'Main Stage' : 
                                   artist.stage === 'secondary' ? 'Secondary Stage' :
                                   artist.stage === 'club' ? 'Club Stage' :
                                   artist.stage === 'acoustic' ? 'Acoustic Stage' : artist.stage}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
            
            {/* Enhanced CTA section - now from CMS */}
            <div className={styles.ctaSection}>
              <p className={styles.ctaText}>
                {lineupData.ctaSection.text}
              </p>
              <div className={styles.buttonContainer}>
                {lineupData.ctaSection.primaryButton.enabled && (
                  <Link 
                    href={lineupData.ctaSection.primaryButton.url}
                    className={styles.viewAllButton}
                    aria-label="Get tickets to see these artists perform"
                  >
                    {lineupData.ctaSection.primaryButton.text}
                    <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </Link>
                )}
                
                {lineupData.ctaSection.secondaryButton.enabled && (
                  <Link 
                    href={lineupData.ctaSection.secondaryButton.url}
                    className={styles.secondaryButton}
                    aria-label="View performance schedule"
                  >
                    {lineupData.ctaSection.secondaryButton.text}
                    <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} role="img" aria-label="Microphone emoji">🎤</div>
            <h3 className={styles.emptyTitle}>{lineupData.emptyState.title}</h3>
            <p className={styles.emptyDescription}>
              {lineupData.emptyState.description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}