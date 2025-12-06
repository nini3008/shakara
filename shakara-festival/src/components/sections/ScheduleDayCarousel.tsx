'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { ScheduleEvent } from '@/types'
import { SanityScheduleEvent } from '@/types/sanity-adapters'
import { GlowingEffect } from '@/components/ui/glowing-effect'

interface ScheduleDayCarouselProps {
  eventsByDay: Record<number, { event: ScheduleEvent; sanityEvent: SanityScheduleEvent }[]>
}

const dayDates: Record<number, string> = {
  1: 'Dec 18',
  2: 'Dec 19',
  3: 'Dec 20',
  4: 'Dec 21',
}

export default function ScheduleDayCarousel({ eventsByDay }: ScheduleDayCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const scrollAmount = 340
    const newScrollLeft = carouselRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
    carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
  }

  // Sort days
  const days = Object.keys(eventsByDay).map(Number).sort((a, b) => a - b)

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
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((day) => {
          const dayEvents = eventsByDay[day] || []
          // Only show featured events for this day
          const featuredDayEvents = dayEvents.filter(({ sanityEvent }) => sanityEvent?.featured)
          
          return (
            <div key={day} className="snap-start flex-shrink-0 w-[300px] md:w-[340px]">
              <div className="relative h-full rounded-2xl border border-gray-800 p-[1px] md:rounded-3xl">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  variant="default"
                />
                <div className="relative h-full flex flex-col gap-4 overflow-hidden rounded-2xl bg-black/40 p-5 backdrop-blur-sm">
                  {/* Day Header */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">Day {day}</h3>
                      <p className="text-orange-400 text-sm font-medium">{dayDates[day]}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-white/80 font-bold text-lg">{dayEvents.length}</span>
                      <span className="text-xs text-white/50 uppercase tracking-wider">Events</span>
                    </div>
                  </div>

                  {/* Featured Events List */}
                  <div className="flex-1 flex flex-col gap-3">
                  {featuredDayEvents.length > 0 ? (
                    featuredDayEvents.slice(0, 3).map(({ event, sanityEvent }) => (
                      <Link 
                        key={event.id}
                        href={`/lineup#${event.type === 'afterDark' ? 'afterDark' : 'livePerformance'}`}
                        className="flex flex-col gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors group/item border border-transparent hover:border-white/10"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-white/10">
                            {sanityEvent?.image ? (
                              <Image
                                src={urlFor(sanityEvent.image).width(100).height(100).url()}
                                alt={event.title}
                                fill
                                className="object-cover"
                              />
                            ) : (sanityEvent?.artist?.image) ? (
                              <Image
                                src={urlFor(sanityEvent.artist.image).width(100).height(100).url()}
                                alt={event.artist?.name || ''}
                                fill
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-white group-hover/item:text-orange-400 transition-colors leading-tight line-clamp-2">
                              {event.title}
                            </h4>
                            <time className="text-xs text-orange-400 font-medium mt-1 block">{event.time}</time>
                          </div>
                        </div>
                        {event.description && (
                          <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          {event.stage && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10">
                              {event.stage}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))
                  ) : (
                      <div className="flex-1 flex items-center justify-center text-white/40 text-sm italic">
                        More events coming soon
                      </div>
                    )}
                    
                    {featuredDayEvents.length > 3 && (
                      <p className="text-xs text-center text-white/40 mt-1">
                        + {featuredDayEvents.length - 3} more featured
                      </p>
                    )}
                  </div>

                {/* Action */}
                <Link
                  href={`/lineup?day=${day}`}
                  className="mt-auto w-full py-2 text-center text-sm font-semibold text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                >
                  View Day {day} Lineup
                </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
