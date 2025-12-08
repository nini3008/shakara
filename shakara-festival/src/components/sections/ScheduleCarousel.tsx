'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { ScheduleEvent } from '@/types'
import { SanityScheduleEvent } from '@/types/sanity-adapters'
import styles from './ScheduleSection.module.scss'

interface ScheduleCarouselProps {
  events: ScheduleEvent[]
  sanityEvents: SanityScheduleEvent[]
}

export default function ScheduleCarousel({ events, sanityEvents }: ScheduleCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const scrollAmount = 340
    const newScrollLeft = carouselRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
    carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
  }

  return (
    <div className="relative group">
      <button
        onClick={() => scrollCarousel('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 md:opacity-100 -translate-x-1/2 shadow-lg border border-white/10 backdrop-blur-sm"
        aria-label="Scroll left"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => scrollCarousel('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 md:opacity-100 translate-x-1/2 shadow-lg border border-white/10 backdrop-blur-sm"
        aria-label="Scroll right"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {events.map((event, index) => {
          const sanityEvent = sanityEvents[index]
          return (
            <div key={event.id} className="snap-start flex-shrink-0 w-[300px] md:w-[340px]">
              <article className={styles.eventCard} style={{ height: '100%' }}>
                <div className={styles.eventContent}>
                  {sanityEvent?.image ? (
                    <div className={styles.eventImage}>
                      <Image
                        src={urlFor(sanityEvent.image).width(340).height(200).url()}
                        alt={event.title}
                        fill
                        className={styles.eventImageElement}
                        sizes="(max-width: 768px) 300px, 340px"
                      />
                    </div>
                  ) : event.artist && sanityEvent?.artist?.image ? (
                    <div className={styles.eventImage}>
                      <Image
                        src={urlFor(sanityEvent.artist.image).width(340).height(200).url()}
                        alt={event.artist.name}
                        fill
                        className={styles.eventImageElement}
                        sizes="(max-width: 768px) 300px, 340px"
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
                    
                    <Link 
                      href={`/lineup#${
                        event.type === 'afterDark' ? 'afterDark' :
                        event.type === 'dj' ? 'dj' :
                        event.type === 'speaker' ? 'speaker' :
                        'livePerformance'
                      }`}
                      className={styles.eventCta}
                    >
                      View in Lineup →
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </div>
  )
}

