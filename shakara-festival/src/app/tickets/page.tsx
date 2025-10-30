import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import TicketsSection from '@/components/sections/TicketsSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tickets | Shakara Festival 2025',
  description: 'Get tickets for Shakara Festival 2025 in Lagos. Choose GA, VIP and more.',
  openGraph: {
    title: 'Tickets | Shakara Festival 2025',
    description: 'Get tickets for Shakara Festival 2025 in Lagos. Choose GA, VIP and more.',
    url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com') + '/tickets',
    siteName: 'Shakara Festival',
    images: [
      {
        url: '/images/SHAKARAGradient.png',
        width: 1200,
        height: 630,
        alt: 'Shakara Festival Tickets',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tickets | Shakara Festival 2025',
    description: 'Get tickets for Shakara Festival 2025 in Lagos. Choose GA, VIP and more.',
    images: ['/images/SHAKARAGradient.png'],
  },
}

export default function TicketsPage() {
  return (
    <V2Layout currentPageName="Tickets">
      <ThemedContent transparent>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: 'Shakara Festival 2025 - Tickets',
              description: 'Tickets for Shakara Festival 2025 in Lagos, Nigeria.',
              startDate: '2025-12-18',
              endDate: '2025-12-21',
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shakarafestival.com') + '/tickets',
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
        <TicketsSection />
      </ThemedContent>
    </V2Layout>
  )
}


