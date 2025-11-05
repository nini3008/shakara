import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import TicketsSection from '@/components/sections/TicketsSection'
import { createPageMetadata, getSiteUrl } from '@/lib/metadata-utils'

export const metadata = createPageMetadata({
  title: 'Shakara Festival Tickets | Buy Early Bird & VIP Passes',
  description: 'Get tickets for Shakara Festival 2025 in Lagos. Choose GA, VIP and more.',
  path: '/tickets',
})

export default function TicketsPage() {
  const siteUrl = getSiteUrl()

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
              url: `${siteUrl}/tickets`,
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
        <TicketsSection />
      </ThemedContent>
    </V2Layout>
  )
}


