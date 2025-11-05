// Remove 'use client' and make it a server component
// components/sections/HeroSection.tsx

import { CalendarDays, MapPin, Music, Users } from 'lucide-react'
import styles from './HeroSection.module.scss'
import { client, urlFor, getFileUrl, HERO_SECTION_QUERY } from '@/lib/sanity'
import { HeroSectionData } from '@/types'
import { SanityHeroSection, adaptSanityHeroSection } from '@/types/sanity-adapters'
import HeroContent from './HeroContent' // We'll create this client component

async function getHeroSectionData(): Promise<{ heroData: HeroSectionData | null, sanityData: SanityHeroSection | null }> {
  try {
    const sanityData: SanityHeroSection = await client.fetch(HERO_SECTION_QUERY);
    if (!sanityData) {
      console.log('No hero section found in Sanity. Using fallback data.');
      return { heroData: null, sanityData: null };
    }
    const heroData = adaptSanityHeroSection(sanityData);
    return { heroData, sanityData };
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return { heroData: null, sanityData: null };
  }
}

export default async function HeroSection() {
  const { heroData, sanityData } = await getHeroSectionData();

  // Default/fallback data if no CMS data is provided
  const defaultData: HeroSectionData = {
    id: 'default',
    name: 'Default Hero',
    festivalName: 'SHAKARA FESTIVAL',
    badge: '🌍 Africa\'s Premier Music Festival',
    dates: {
      start: '2025-12-18',
      end: '2025-12-21'
    },
    location: {
      venue: 'Lekki Peninsula',
      city: 'Lagos',
      country: 'Nigeria'
    },
    stats: {
      artistCount: 50,
      expectedAttendance: '50K+',
      dayCount: 4
    },
    showScrollIndicator: true,
    showStats: true,
    showSocialLinks: false
  };

  // Use CMS data if available, otherwise use defaults
  const data = heroData || defaultData;

  // Get hero video URL if available (takes precedence over image)
  const heroVideoUrl = sanityData?.heroVideo?.asset?._ref ? getFileUrl(sanityData.heroVideo.asset._ref) : null;
  
  // Get hero image URL if available (fallback when no video)
  const heroImageUrl = sanityData?.heroImage ? urlFor(sanityData.heroImage).width(1920).height(1080).url() : null;

  return (
    <section className={styles.heroSection}>
      {/* Background Effects - With Optional Hero Video or Image */}
      <div className={styles.backgroundContainer}>
        {heroVideoUrl ? (
          <video
            className={styles.heroVideo}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.4,
              zIndex: 1
            }}
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        ) : heroImageUrl ? (
          <div 
            className={styles.heroImage}
            style={{
              backgroundImage: `url(${heroImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.3,
              zIndex: 1
            }}
          />
        ) : null}
        <div className={styles.baseGradient} />
        <div className={styles.bottomFade} />
      </div>

      {/* Pass data to client component for animations */}
      <HeroContent data={data} />
    </section>
  );
}