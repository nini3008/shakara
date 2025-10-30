// app/page.tsx

import HeroSection from '@/components/sections/HeroSection'
import ParallaxHero from '@/components/v2/ParallaxHero'
import LayoutWrapper from '@/components/v2/LayoutWrapper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shakara Festival 2025 | Lagos, Nigeria',
  description:
    "4 Days Celebrating the Best Music of African Origin. December 18-21, 2025 at Victoria Island, Lagos.",
  openGraph: {
    title: 'Shakara Festival 2025 | Lagos, Nigeria',
    description:
      "4 Days Celebrating the Best Music of African Origin. December 18-21, 2025 at Victoria Island, Lagos.",
    url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com') + '/',
    siteName: 'Shakara Festival',
    images: [
      {
        url: '/images/SHAKARAGradient.png',
        width: 1200,
        height: 630,
        alt: 'Shakara Festival',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shakara Festival 2025 | Lagos, Nigeria',
    description:
      "4 Days Celebrating the Best Music of African Origin. December 18-21, 2025 at Victoria Island, Lagos.",
    images: ['/images/SHAKARAGradient.png'],
  },
}

// Lineup section hidden
// Sponsors section hidden

export default async function Home() {
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
            url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com') + '/',
            location: {
              '@type': 'Place',
              name: 'Victoria Island',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Lagos',
                addressCountry: 'NG',
              },
            },
            image: [
              (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com') + '/images/SHAKARAGradient.png',
            ],
            organizer: {
              '@type': 'Organization',
              name: 'Shakara Festival',
              url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com',
            },
          }),
        }}
      />
      <div className="relative z-30 h-screen overflow-hidden">
        <ParallaxHero>
          <HeroSection />
        </ParallaxHero>
      </div>

      {/* Lineup Lamp Section - Hidden for now */}
      {/* <div className="relative z-10">
        <LineupLampSection />
      </div> */}

      {/* Sponsors section hidden */}
    </LayoutWrapper>
  )
}