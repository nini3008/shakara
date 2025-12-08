// app/page.tsx

import HeroSection from '@/components/sections/HeroSection'
import ParallaxHero from '@/components/v2/ParallaxHero'
import LayoutWrapper from '@/components/v2/LayoutWrapper'
import { createPageMetadata, getSiteUrl } from '@/lib/metadata-utils'
import { LineupLampSection } from '@/components/sections/LineupLampSection'
import { LineupGlowingSection } from '@/components/sections/LineupGlowingSection'
import ScheduleSection from '@/components/sections/ScheduleSection'
import { client, FEATURED_ARTISTS_QUERY } from '@/lib/sanity'
import { SanityArtist, adaptSanityArtist } from '@/types/sanity-adapters'
import { Artist } from '@/types'

export const metadata = createPageMetadata({
  title: 'Shakara Festival 2025 | Lagos Music Festival | Dec 18-21, 2025',
  description:
    "4 Days Celebrating the Best Music of African Origin. December 18-21, 2025 at Lekki Peninsula, Lagos.",
  path: '/',
})

export default async function Home() {
  const siteUrl = getSiteUrl()

  // Fetch featured artists
  let featuredArtists: { artist: Artist; sanityArtist: SanityArtist }[] = []
  try {
    const sanityArtists: SanityArtist[] = await client.fetch(FEATURED_ARTISTS_QUERY)
    featuredArtists = sanityArtists.map(sanityArtist => ({
      artist: adaptSanityArtist(sanityArtist),
      sanityArtist
    }))
  } catch (error) {
    console.error('Error fetching featured artists:', error)
  }

  return (
    <LayoutWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MusicFestival',
            name: 'Shakara Festival 2025',
            description:
              '4 Days Celebrating the Best Music of African Origin in Lagos, Nigeria.',
            startDate: '2025-12-18',
            endDate: '2025-12-21',
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            url: `${siteUrl}/`,
            location: {
              '@type': 'Place',
              name: 'Lekki Peninsula',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Lagos',
                addressCountry: 'NG',
              },
            },
            image: [
              `${siteUrl}/images/SHAKARAGradient.png`,
            ],
            organizer: {
              '@type': 'Organization',
              name: 'Shakara Festival',
              url: siteUrl,
            },
          }),
        }}
      />
      <div className="relative z-30 h-screen overflow-hidden">
        <ParallaxHero>
          <HeroSection />
        </ParallaxHero>
      </div>

      {/* Combined Featured Section */}
      <div className="relative z-10">
        <LineupLampSection>
          <div className="w-full mb-12">
            <LineupGlowingSection featuredArtists={featuredArtists} />
          </div>
          <div className="w-full">
            <ScheduleSection />
          </div>
        </LineupLampSection>
      </div>
    </LayoutWrapper>
  )
}