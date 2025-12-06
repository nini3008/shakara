'use client'

import { useState, useMemo } from 'react'
import { urlFor } from '@/lib/sanity'
import { ScheduleEvent } from '@/types'
import { SanityScheduleEvent } from '@/types/sanity-adapters'
import Image from 'next/image'
import Link from 'next/link'
import styles from './schedule.module.scss'
import { convertTo24Hour } from '@/lib/utils'

interface ScheduleGroupedContentProps {
  initialEvents: ScheduleEvent[]
  initialSanityEvents: SanityScheduleEvent[]
}

type EventType = 'livePerformance' | 'dj' | 'speaker' | 'afterDark' | 'vendors' | 'workshop' | 'food' | 'art' | 'meetgreet'

const eventTypeLabels: Record<EventType, string> = {
  livePerformance: 'Live Performances',
  dj: 'DJ Sets',
  speaker: 'Speakers & Panels',
  afterDark: 'Shakara After Dark',
  vendors: 'Vendors & Market',
  workshop: 'Workshops',
  food: 'Food & Drinks',
  art: 'Art Installations',
  meetgreet: 'Meet & Greet',
}

const eventTypeIcons: Record<EventType, string> = {
  livePerformance: '🎵',
  dj: '🎧',
  speaker: '🎤',
  afterDark: '🌙',
  vendors: '🛍️',
  workshop: '🎨',
  food: '🍽️',
  art: '🖼️',
  meetgreet: '👋',
}

const dayDates: Record<number, string> = {
  1: 'Wednesday, Dec 18',
  2: 'Thursday, Dec 19',
  3: 'Friday, Dec 20',
  4: 'Saturday, Dec 21',
}

export default function ScheduleGroupedContent({
  initialEvents,
  initialSanityEvents,
}: ScheduleGroupedContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all')

  const days = useMemo(() => {
    return [...new Set(initialEvents.map((event) => event.day))].sort()
  }, [initialEvents])

  const stages = useMemo(() => {
    return [...new Set(initialEvents.map((event) => event.stage).filter(Boolean))]
  }, [initialEvents])

  // Filter events
  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      const matchesDay = selectedDay === 'all' || event.day === selectedDay
      const matchesSearch =
        searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.artist?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesDay && matchesSearch
    })
  }, [initialEvents, selectedDay, searchQuery])

  // Group by day and event type
  const groupedSchedule = useMemo(() => {
    const grouped: Record<
      number,
      Record<EventType, Array<{ event: ScheduleEvent; sanityEvent?: SanityScheduleEvent }>>
    > = {}

    filteredEvents.forEach((event) => {
      const day = event.day
      if (!grouped[day]) {
        grouped[day] = {
          livePerformance: [],
          dj: [],
          speaker: [],
          afterDark: [],
          vendors: [],
          workshop: [],
          food: [],
          art: [],
          meetgreet: [],
        }
      }

      const sanityEvent = initialSanityEvents.find((se) => se._id === event.id)
      const eventData = { event, sanityEvent }

      // Categorize by type
      const type = event.type as EventType
      if (grouped[day][type]) {
        grouped[day][type].push(eventData)
      } else {
        // Default to live performance if type doesn't match
        grouped[day].livePerformance.push(eventData)
      }
    })

    // Sort events within each group by time
    Object.keys(grouped).forEach((dayKey) => {
      const day = Number(dayKey)
      Object.keys(grouped[day]).forEach((typeKey) => {
        const type = typeKey as EventType
        grouped[day][type].sort((a, b) => {
          const timeA = convertTo24Hour(a.event.time)
          const timeB = convertTo24Hour(b.event.time)
          return timeA.localeCompare(timeB)
        })
      })
    })

    return grouped
  }, [filteredEvents, initialSanityEvents])

  return (
    <div className={styles.scheduleWrapper}>
      <div className={styles.scheduleHeader}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Festival Schedule</h1>
            <p className={styles.pageDescription}>
              Complete lineup and schedule for all four days of Shakara Festival 2025
            </p>

            <div className={styles.scheduleStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{initialEvents.length}</span>
                <span className={styles.statLabel}>Events</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{days.length}</span>
                <span className={styles.statLabel}>Days</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stages.length}</span>
                <span className={styles.statLabel}>Stages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scheduleContent}>
        <div className={styles.container}>
          {/* Filters */}
          <div className={styles.controlsSection}>
            <div className={styles.filtersRow}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search events, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className={styles.filterSelect}
              >
                <option value="all">All Days</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    Day {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grouped Schedule */}
          <div className="space-y-12">
            {Object.entries(groupedSchedule)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([dayKey, dayGroups]) => {
                const day = Number(dayKey)
                const totalEvents = Object.values(dayGroups).reduce((sum, arr) => sum + arr.length, 0)

                return (
                  <div key={day} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                    {/* Day Header */}
                    <div className="border-b border-white/10 pb-4 mb-6">
                      <h2 className="text-3xl font-bold gradient-text">Day {day}</h2>
                      <p className="text-white/60 text-lg mt-1">{dayDates[day]}</p>
                      <p className="text-white/50 text-sm mt-1">
                        {totalEvents} {totalEvents === 1 ? 'event' : 'events'}
                      </p>
                    </div>

                    {/* Event Type Groups */}
                    <div className="space-y-8">
                      {(Object.keys(dayGroups) as EventType[]).map((type) => {
                        const events = dayGroups[type]
                        if (events.length === 0) return null

                        return (
                          <div key={type} className="space-y-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{eventTypeIcons[type]}</span>
                              <h3 className="text-xl font-semibold text-white">{eventTypeLabels[type]}</h3>
                              <span className="text-white/50 text-sm">({events.length})</span>
                            </div>

                            <div className={`grid gap-4 ${
                              events.length === 1 ? 'grid-cols-1' :
                              events.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            }`}>
                              {events.map(({ event, sanityEvent }) => {
                                // Determine the appropriate link based on event type
                                const getEventLink = () => {
                                  if (event.type === 'vendors') {
                                    return { href: '/vendors', label: 'View Vendors' }
                                  } else if (['livePerformance', 'dj', 'speaker', 'afterDark'].includes(event.type)) {
                                    return { href: `/lineup?day=${event.day}`, label: 'View Day Lineup' }
                                  } else if (event.type === 'workshop') {
                                    return { href: '/schedule', label: 'View Details' }
                                  } else {
                                    return { href: '/schedule', label: 'Learn More' }
                                  }
                                }
                                const eventLink = getEventLink()

                                return (
                                  <article
                                    key={event.id}
                                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-white/20 transition-all h-full flex flex-col"
                                  >
                                    <div className="flex items-start gap-4 mb-3">
                                      {(sanityEvent?.image || sanityEvent?.artist?.image) && (
                                        <div className="flex-shrink-0">
                                          <Image
                                            src={
                                              sanityEvent?.image
                                                ? urlFor(sanityEvent.image).width(80).height(80).url()
                                                : sanityEvent?.artist?.image
                                                ? urlFor(sanityEvent.artist.image).width(80).height(80).url()
                                                : ''
                                            }
                                            alt={event.artist?.name || event.title}
                                            width={80}
                                            height={80}
                                            className="rounded-lg"
                                          />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <time className="text-sm text-orange-400 font-semibold">{event.time}</time>
                                        <h4 className="text-white font-semibold mt-1 leading-tight">{event.title}</h4>
                                        {event.artist && (
                                          <p className="text-white/70 text-sm mt-1">{event.artist.name}</p>
                                        )}
                                      </div>
                                    </div>
                                    {event.description && (
                                      <p className="text-white/60 text-xs leading-relaxed mb-3">
                                        {event.description}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-2 mt-auto">
                                      {event.stage && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10">
                                          {event.stage}
                                        </span>
                                      )}
                                      <Link
                                        href={eventLink.href}
                                        className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                                      >
                                        {eventLink.label}
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </Link>
                                    </div>
                                  </article>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>

          {filteredEvents.length === 0 && (
            <div className={styles.noResults}>
              <h3>No events found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button
                onClick={() => {
                  setSelectedDay('all')
                  setSearchQuery('')
                }}
                className={styles.clearFiltersButton}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


