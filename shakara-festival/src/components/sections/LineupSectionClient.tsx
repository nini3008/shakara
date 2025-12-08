'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { urlFor } from '@/lib/sanity'
import type { Artist } from '@/types'
import type { SanityArtist } from '@/types/sanity-adapters'

import styles from './LineupSection.module.scss'

type LineupEntry = {
  artist: Artist
  sanityArtist: SanityArtist | null
}

type LineupSectionClientProps = {
  entries: LineupEntry[]
}

const FESTIVAL_DAY_TO_DATE: Record<number, string> = {
  1: '2025-12-18',
  2: '2025-12-19',
  3: '2025-12-20',
  4: '2025-12-21',
}

const formatIsoToLabel = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, (month ?? 1) - 1, day ?? 1)
  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
}

interface GroupedEntries {
  livePerformance: LineupEntry[]
  afterDark: LineupEntry[]
  dj: LineupEntry[]
  speaker: LineupEntry[]
}

const roleLabels: Record<keyof GroupedEntries, string> = {
  livePerformance: 'Live Performances',
  afterDark: 'Shakara After Dark',
  dj: 'DJs',
  speaker: 'Speakers & Panels',
}

const roleDescriptions: Record<keyof GroupedEntries, string> = {
  livePerformance: 'Experience electrifying live performances from top artists',
  afterDark: 'Late-night vibes with exclusive after-dark performances',
  dj: 'Dance to the beats of world-class DJs',
  speaker: 'Engage with industry leaders and thought-provoking discussions',
}

export default function LineupSectionClient({ entries }: LineupSectionClientProps) {
  const searchParams = useSearchParams()
  const [selectedDay, setSelectedDay] = useState<'all' | number>('all')
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Handle URL day parameter
  useEffect(() => {
    const dayParam = searchParams.get('day')
    if (dayParam) {
      const day = parseInt(dayParam, 10)
      if (!isNaN(day) && [1, 2, 3, 4].includes(day)) {
        setSelectedDay(day)
      }
    }
  }, [searchParams])

  const availableDays = useMemo(() => {
    const uniqueDays = new Set<number>()
    entries.forEach(({ artist }) => {
      if (typeof artist.day === 'number') {
        uniqueDays.add(artist.day)
      }
    })

    return [1, 2, 3, 4].filter((day) => uniqueDays.has(day)).map((day) => ({
      day,
      iso: FESTIVAL_DAY_TO_DATE[day],
      label: FESTIVAL_DAY_TO_DATE[day]
        ? formatIsoToLabel(FESTIVAL_DAY_TO_DATE[day])
        : `Day ${day}`,
    }))
  }, [entries])

  const filteredEntries = useMemo(() => {
    if (selectedDay === 'all') {
      return entries
    }

    return entries.filter(({ artist }) => artist.day === selectedDay)
  }, [entries, selectedDay])

  const groupedEntries = useMemo(() => {
    const groups: GroupedEntries = {
      livePerformance: [],
      afterDark: [],
      dj: [],
      speaker: [],
    }

    filteredEntries.forEach((entry) => {
      const roles = entry.artist.roles || []
      const performanceWindow = entry.artist.performanceWindow || 'main'

      if (performanceWindow === 'afterDark') {
        groups.afterDark.push(entry)
      } else if (roles.includes('livePerformance')) {
        groups.livePerformance.push(entry)
      } else if (roles.includes('dj')) {
        groups.dj.push(entry)
      } else if (roles.includes('speaker')) {
        groups.speaker.push(entry)
      } else {
        groups.livePerformance.push(entry)
      }
    })

    // Sort each group by performance date/day
    Object.keys(groups).forEach((key) => {
      groups[key as keyof GroupedEntries].sort((a, b) => {
        if (a.artist.performanceDate && b.artist.performanceDate) {
          return new Date(a.artist.performanceDate).getTime() - new Date(b.artist.performanceDate).getTime()
        }
        if (a.artist.day && b.artist.day) {
          return a.artist.day - b.artist.day
        }
        return 0
      })
    })

    return groups
  }, [filteredEntries])

  const scrollCarousel = (groupKey: string, direction: 'left' | 'right') => {
    const container = carouselRefs.current[groupKey]
    if (!container) return

    const scrollAmount = 300
    const newScrollLeft = container.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
  }

  const hasDayButtons = availableDays.length > 0

  const formatDay = (day?: number) => {
    if (!day) return ''
    const dates = ['Dec 18', 'Dec 19', 'Dec 20', 'Dec 21']
    return dates[day - 1] || `Day ${day}`
  }

  return (
    <>
      <div className={styles.datePicker}>
        <div className={styles.datePickerContent}>
          <div>
            <span className={styles.datePickerEyebrow}>Filter by day</span>
            <h3 className={styles.datePickerHeading}>Choose your festival day</h3>
            <p className={styles.datePickerDescription}>
              View artists performing on a specific day or explore the full lineup.
            </p>
          </div>
          <div className={styles.dateButtonsRow}>
            <button
              type="button"
              className={styles.dateToggle}
              data-selected={selectedDay === 'all'}
              aria-pressed={selectedDay === 'all'}
              onClick={() => setSelectedDay('all')}
            >
              All
            </button>

            {(hasDayButtons ? availableDays : [1, 2, 3, 4].map((day) => ({
              day,
              iso: FESTIVAL_DAY_TO_DATE[day],
              label: FESTIVAL_DAY_TO_DATE[day]
                ? formatIsoToLabel(FESTIVAL_DAY_TO_DATE[day])
                : `Day ${day}`,
            }))).map(({ day, label }) => (
              <button
                key={day}
                type="button"
                className={styles.dateToggle}
                data-selected={selectedDay === day}
                aria-pressed={selectedDay === day}
                onClick={() => setSelectedDay(day)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredEntries.length > 0 ? (
        <div className="space-y-12">
          {(Object.keys(groupedEntries) as Array<keyof GroupedEntries>).map((groupKey) => {
            const groupItems = groupedEntries[groupKey]
            if (groupItems.length === 0) return null

            return (
              <div key={groupKey} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                    {roleLabels[groupKey]}
                  </h2>
                  <p className="text-white/60">
                    {roleDescriptions[groupKey]}
                  </p>
                  <div className="mt-2 text-sm text-white/50">
                    {groupItems.length} {groupItems.length === 1 ? 'artist' : 'artists'}
                  </div>
                </div>

                <div className="relative group">
                  <button
                    onClick={() => scrollCarousel(groupKey, 'left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 md:opacity-100 -translate-x-1/2 shadow-lg border border-white/10 backdrop-blur-sm"
                    aria-label="Scroll left"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollCarousel(groupKey, 'right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 md:opacity-100 translate-x-1/2 shadow-lg border border-white/10 backdrop-blur-sm"
                    aria-label="Scroll right"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <div
                    ref={(el) => {
                      carouselRefs.current[groupKey] = el
                    }}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {groupItems.map(({ artist, sanityArtist }) => (
                      <div key={artist.id} className="snap-start flex-shrink-0 w-[280px] md:w-[300px]">
                        <Link 
                          href={sanityArtist?.slug?.current ? `/artists/${sanityArtist.slug.current}` : '#'} 
                          className={styles.artistCard}
                        >
                          <div className={styles.imageContainer}>
                            {sanityArtist?.image ? (
                              <Image
                                src={urlFor(sanityArtist.image).width(400).height(400).url()}
                                alt={artist.name}
                                fill
                                className={styles.artistImage}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              />
                            ) : (
                              <div className={styles.placeholderImage}>
                                <span className={styles.placeholderText}>{artist.name.charAt(0)}</span>
                              </div>
                            )}
                            <div className={styles.imageOverlay} />
                            {artist.day && (
                              <div className={styles.featuredBadge}>
                                <span className={styles.badge}>{formatDay(artist.day)}</span>
                              </div>
                            )}
                          </div>
                          <div className={styles.cardContent}>
                            <h3 className={styles.artistName}>{artist.name}</h3>
                            {artist.genre && <p className={styles.artistGenre}>{artist.genre}</p>}
                            {artist.time && <p className={styles.artistMeta}>{artist.time}</p>}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className={styles.noArtists}>
          <h3>No artists announced for this day yet</h3>
          <p>Try another date or view the full lineup to explore every performance.</p>
        </div>
      )}
    </>
  )
}
