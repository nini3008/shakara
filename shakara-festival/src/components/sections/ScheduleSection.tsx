// components/sections/ScheduleSection.tsx - Following AboutSection Pattern

import { client, SCHEDULE_QUERY, urlFor } from '@/lib/sanity';
import { ScheduleEvent } from '@/types';
import { SanityScheduleEvent, adaptSanityScheduleEvent } from '@/types/sanity-adapters';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ScheduleSection.module.scss';

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
  
  // Group events by day and get featured events for preview
  const eventsByDay = allEvents.reduce((acc, event) => {
    if (!acc[event.day]) acc[event.day] = [];
    acc[event.day].push(event);
    return acc;
  }, {} as Record<number, ScheduleEvent[]>);

  const featuredEvents = allEvents.filter((_, index) => allSanityEvents[index]?.featured).slice(0, 4);
  const featuredSanityEvents = allSanityEvents.filter(event => event.featured).slice(0, 4);
  const hasEvents = allEvents.length > 0;

  return (
    <section id="schedule" className={styles.scheduleSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Festival Schedule
        </h2>
        
        {hasEvents ? (
          <>
            {/* Schedule Overview - Visual summary of days */}
            <div className={styles.overviewGrid}>
              {Object.entries(eventsByDay)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([day, events]) => {
                  const sortedEvents = events.sort((a, b) => {
                    // Simple time sorting - you might want to improve this
                    return a.time.localeCompare(b.time);
                  });
                  
                  return (
                    <div key={day} className={styles.dayCard}>
                      <h3 className={styles.dayNumber}>
                        Day {day}
                      </h3>
                      <p className={styles.eventCount}>
                        {events.length} {events.length === 1 ? 'Event' : 'Events'}
                      </p>
                      <p className={styles.timeRange}>
                        {sortedEvents[0]?.time} - {sortedEvents[sortedEvents.length - 1]?.time || 'Late'}
                      </p>
                    </div>
                  );
                })
              }
            </div>

            {/* Featured Events Preview */}
            {featuredEvents.length > 0 && (
              <>
                <h3 className={styles.featuredTitle}>
                  Featured Performances
                </h3>
                <div className={styles.featuredGrid}>
                  {featuredEvents.map((event, index) => {
                    const sanityEvent = featuredSanityEvents[index];
                    return (
                      <article key={event.id} className={styles.eventCard}>
                        <div className={styles.eventContent}>
                          {sanityEvent?.image ? (
                            <div className={styles.eventImage}>
                              <Image
                                src={urlFor(sanityEvent.image).width(160).height(160).url()}
                                alt={event.title}
                                fill
                                className={styles.eventImageElement}
                                sizes="(max-width: 768px) 64px, 80px"
                              />
                            </div>
                          ) : event.artist && sanityEvent?.artist?.image ? (
                            <div className={styles.eventImage}>
                              <Image
                                src={urlFor(sanityEvent.artist.image).width(160).height(160).url()}
                                alt={event.artist.name}
                                fill
                                className={styles.eventImageElement}
                                sizes="(max-width: 768px) 64px, 80px"
                              />
                            </div>
                          ) : (
                            <div className={styles.placeholderImage}>
                              <span className={styles.placeholderText}>
                                {event.title.charAt(0)}
                              </span>
                            </div>
                          )}
                          
                          <div className={styles.eventDetails}>
                            <div className={styles.eventHeader}>
                              <h4 className={styles.eventTitle}>{event.title}</h4>
                              <span className={styles.dayBadge}>
                                Day {event.day}
                              </span>
                            </div>
                            
                            {event.artist && (
                              <p className={styles.artistName}>
                                {event.artist.name}
                              </p>
                            )}
                            
                            <div className={styles.eventMeta}>
                              <time dateTime={event.time}>{event.time}</time>
                              {event.stage && (
                                <>
                                  <span className={styles.metaSeparator}>•</span>
                                  <span>{event.stage}</span>
                                </>
                              )}
                            </div>
                            
                            {event.description && (
                              <p className={styles.eventDescription}>{event.description}</p>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
            
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