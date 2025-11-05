// app/schedule/page.tsx

import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import { client, SCHEDULE_QUERY } from '@/lib/sanity'
import { ScheduleEvent } from '@/types'
import { SanityScheduleEvent, adaptSanityScheduleEvent } from '@/types/sanity-adapters'
import ScheduleContent from '@/components/schedule/scheduleContext'
import styles from '@/components/schedule/schedule.module.scss'
import Reveal from '@/components/v2/Reveal'
import { createPageMetadata } from '@/lib/metadata-utils'

export const metadata = createPageMetadata({
  title: 'Shakara Festival Schedule | Shakara Festival | Dec 18-21, 2025',
  description:
    'Review the daily schedule for Shakara Festival 2025 and plan your experience across four unforgettable days.',
  path: '/schedule',
})

// Server component to fetch initial data
export default async function SchedulePage() {
  let initialEvents: ScheduleEvent[] = [];
  let initialSanityEvents: SanityScheduleEvent[] = [];

  try {
    const sanityData: SanityScheduleEvent[] = await client.fetch(SCHEDULE_QUERY);
    initialEvents = sanityData.map(adaptSanityScheduleEvent);
    initialSanityEvents = sanityData;
  } catch (error) {
    console.error('Error fetching initial schedule data:', error);
  }

  return (
    <V2Layout currentPageName="Schedule">
      <ThemedContent transparent>
        <main className={styles.scheduleWrapper}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <ScheduleContent
                initialEvents={initialEvents}
                initialSanityEvents={initialSanityEvents}
              />
            </Reveal>
          </div>
        </main>
      </ThemedContent>
    </V2Layout>
  )
}