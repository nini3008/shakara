// app/schedule/page.tsx

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ThemedContent from '@/components/ThemedContent';
import { client, SCHEDULE_QUERY } from '@/lib/sanity';
import { ScheduleEvent } from '@/types';
import { SanityScheduleEvent, adaptSanityScheduleEvent } from '@/types/sanity-adapters';
import ScheduleContent from '@/components/schedule/scheduleContext';
import styles from '@/components/schedule/schedule.module.scss';

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
    <div className="min-h-screen">
      <Navigation />
      <ThemedContent>
        <main className={`pt-16 ${styles.scheduleWrapper}`}>
          <ScheduleContent 
            initialEvents={initialEvents} 
            initialSanityEvents={initialSanityEvents} 
          />
        </main>
        <Footer />
      </ThemedContent>
    </div>
  );
}