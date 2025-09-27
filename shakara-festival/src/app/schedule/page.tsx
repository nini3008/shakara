// app/schedule/page.tsx

import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import { client, SCHEDULE_QUERY } from '@/lib/sanity'
import { ScheduleEvent } from '@/types'
import { SanityScheduleEvent, adaptSanityScheduleEvent } from '@/types/sanity-adapters'
import ScheduleContent from '@/components/schedule/scheduleContext'
import styles from '@/components/schedule/schedule.module.scss'
import PaperSection from '@/components/v2/PaperSection'
import Reveal from '@/components/v2/Reveal'

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
        <PaperSection bgImage="/images/torn-paper-background.png">
          <main className={`pt-16 ${styles.scheduleWrapper}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal>
                <ScheduleContent
                  initialEvents={initialEvents}
                  initialSanityEvents={initialSanityEvents}
                />
              </Reveal>
            </div>
          </main>
        </PaperSection>
      </ThemedContent>
    </V2Layout>
  )
}