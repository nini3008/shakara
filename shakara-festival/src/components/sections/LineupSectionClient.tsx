'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

export default function LineupSectionClient({ entries }: LineupSectionClientProps) {
  const [selectedDay, setSelectedDay] = useState<'all' | number>('all')

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

  const hasDayButtons = availableDays.length > 0

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
        <div className={styles.artistsGrid}>
          {filteredEntries.map(({ artist, sanityArtist }) => {
            const artistSlug = sanityArtist?.slug?.current
              ? `/artists/${sanityArtist.slug.current}`
              : '#'

            return (
              <div key={artist.id} className={styles.artistGroup}>
                <Link href={artistSlug} aria-label={`View details for ${artist.name}`}>
                  <div className={styles.artistCard}>
                    {sanityArtist?.image ? (
                      <div className={styles.imageContainer}>
                        <Image
                          src={urlFor(sanityArtist.image).width(400).height(400).url()}
                          alt={artist.name}
                          fill
                          className={styles.artistImage}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                        <div className={styles.imageOverlay} />
                        {sanityArtist.featured && (
                          <div className={styles.featuredBadge}>
                            <span className={styles.badge}>Featured</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={styles.placeholderImage}>
                        <span className={styles.placeholderText}>
                          {artist.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div className={styles.cardContent}>
                      <h3 className={styles.artistName}>{artist.name}</h3>

                      {artist.genre && (
                        <p className={styles.artistGenre}>{artist.genre}</p>
                      )}

                      {(artist.day || artist.stage) && (
                        <div className={styles.artistMeta}>
                          {artist.day && <span>Day {artist.day}</span>}
                          {artist.day && artist.stage && <span> • </span>}
                          {artist.stage && (
                            <span>
                              {artist.stage === 'main'
                                ? 'Main Stage'
                                : artist.stage === 'secondary'
                                  ? 'Secondary Stage'
                                  : artist.stage === 'club'
                                    ? 'Club Stage'
                                    : artist.stage === 'acoustic'
                                      ? 'Acoustic Stage'
                                      : artist.stage}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
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

