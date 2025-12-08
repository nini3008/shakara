// components/sections/ScheduleSection.tsx - Following AboutSection Pattern

import { client, SCHEDULE_QUERY } from '@/lib/sanity';
import { ScheduleEvent } from '@/types';
import { SanityScheduleEvent, adaptSanityScheduleEvent } from '@/types/sanity-adapters';
import Link from 'next/link';
import styles from './ScheduleSection.module.scss';
import ScheduleDayCarousel from './ScheduleDayCarousel';

async function getScheduleEvents(): Promise<{ events: ScheduleEvent[], sanityEvents: SanityScheduleEvent[] }> {
  try {
    const sanityEvents: SanityScheduleEvent[] = await client.fetch(SCHEDULE_QUERY);
    const events = sanityEvents.map(adaptSanityScheduleEvent);
    return { events, sanityEvents };
  } catch (error) {
    console.error('Error fetching schedule events:', error);
    return { events: [], sanityEvents: [] };
  }
}

export default async function ScheduleSection() {
  const { events: allEvents, sanityEvents: allSanityEvents } = await getScheduleEvents();
  
  // Group events by day
  const eventsByDay = allEvents.reduce((acc, event, index) => {
    const sanityEvent = allSanityEvents[index];
    if (!acc[event.day]) acc[event.day] = [];
    acc[event.day].push({ event, sanityEvent });
    return acc;
  }, {} as Record<number, { event: ScheduleEvent, sanityEvent: SanityScheduleEvent }[]>);

  const hasEvents = allEvents.length > 0;

  return (
    <section id="schedule" className={styles.scheduleSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Festival Days
        </h2>
        
        {hasEvents ? (
          <>
            {/* Grouped Day Carousel */}
            <ScheduleDayCarousel eventsByDay={eventsByDay} />
            
            <div className={styles.buttonContainer}>
              <Link 
                href="/schedule" 
                className={styles.viewScheduleButton}
                aria-label="View complete festival schedule"
              >
                View Full Schedule
                <svg 
                  className={styles.buttonIcon} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            {/* <div className={styles.emptyIcon} role="img" aria-label="Calendar emoji"><span>📅</span></div> */}
            <h3 className={styles.emptyTitle}>Four Days of Music</h3>
            <p className={styles.emptyDescription}>
              Our full lineup and schedule will be revealed soon. Get ready for four incredible days of African music, culture, and community celebration.
            </p>
            <div className={styles.daysPreview}>
              {[1, 2, 3, 4].map((day) => (
                <div key={day} className={styles.dayPreview}>
                  <div className={styles.dayPreviewNumber}>
                    Day {day}
                  </div>
                  <div className={styles.dayPreviewLabel}>
                    Coming Soon
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}