// app/schedule/ScheduleContent.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { urlFor } from '@/lib/sanity';
import { ScheduleEvent } from '@/types';
import { SanityScheduleEvent } from '@/types/sanity-adapters';
import Image from 'next/image';
import Link from 'next/link';
import styles from './schedule.module.scss';

interface ScheduleContentProps {
  initialEvents: ScheduleEvent[];
  initialSanityEvents: SanityScheduleEvent[];
}

export default function ScheduleContent({ initialEvents, initialSanityEvents }: ScheduleContentProps) {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [selectedStage, setSelectedStage] = useState<string | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [isLightTheme, setIsLightTheme] = useState(false);

  // Detect current theme
  useEffect(() => {
    const checkTheme = () => {
      const themedContent = document.querySelector('.themed-content');
      setIsLightTheme(themedContent?.getAttribute('data-theme') === 'light');
    };
    
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    const themedContent = document.querySelector('.themed-content');
    if (themedContent) {
      observer.observe(themedContent, { attributes: true, attributeFilter: ['data-theme'] });
    }
    
    return () => observer.disconnect();
  }, []);

  // Get unique values for filters
  const days = useMemo(() => {
    const uniqueDays = [...new Set(initialEvents.map(event => event.day))].sort();
    return uniqueDays;
  }, [initialEvents]);

  const stages = useMemo(() => {
    const uniqueStages = [...new Set(initialEvents.map(event => event.stage).filter(Boolean))].sort();
    return uniqueStages;
  }, [initialEvents]);

  const types = useMemo(() => {
    const uniqueTypes = [...new Set(initialEvents.map(event => event.type))].sort();
    return uniqueTypes;
  }, [initialEvents]);

  // Filter events based on selected criteria
  const filteredEvents = useMemo(() => {
    return initialEvents.filter(event => {
      const matchesDay = selectedDay === 'all' || event.day === selectedDay;
      const matchesStage = selectedStage === 'all' || event.stage === selectedStage;
      const matchesType = selectedType === 'all' || event.type === selectedType;
      const matchesSearch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.artist?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDay && matchesStage && matchesType && matchesSearch;
    });
  }, [initialEvents, selectedDay, selectedStage, selectedType, searchQuery]);

  // Group filtered events by day for timeline view
  const eventsByDay = useMemo(() => {
    const grouped = filteredEvents.reduce((acc, event) => {
      const day = event.day;
      if (!acc[day]) acc[day] = [];
      acc[day].push({ 
        event, 
        sanityEvent: initialSanityEvents.find(se => se._id === event.id) 
      });
      return acc;
    }, {} as Record<number, Array<{ event: ScheduleEvent; sanityEvent?: SanityScheduleEvent }>>);

    // Sort events within each day by time
    Object.keys(grouped).forEach(day => {
      grouped[Number(day)].sort((a, b) => a.event.time.localeCompare(b.event.time));
    });

    return grouped;
  }, [filteredEvents, initialSanityEvents]);

  const formatTime = (time: string) => {
    return time;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      music: '🎵',
      panel: '🎤',
      vendors: '🛍️',
      afterparty: '🌙'
    };
    return icons[type as keyof typeof icons] || '🎵';
  };

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
          {initialEvents.length > 0 ? (
            <>
              {/* Filters and Controls */}
              <div className={styles.controlsSection}>
                <div className={styles.filtersRow}>
                  {/* Search */}
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      placeholder="Search events, artists..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={styles.searchInput}
                    />
                    <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Day Filter */}
                  <select 
                    value={selectedDay} 
                    onChange={(e) => setSelectedDay(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Days</option>
                    {days.map(day => (
                      <option key={day} value={day}>Day {day}</option>
                    ))}
                  </select>

                  {/* Stage Filter */}
                  <select 
                    value={selectedStage} 
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Stages</option>
                    {stages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>

                  {/* Type Filter */}
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Types</option>
                    {types.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.viewControls}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`${styles.viewControl} ${viewMode === 'grid' ? styles.active : ''}`}
                    style={{
                      background: viewMode === 'grid' 
                        ? 'linear-gradient(135deg, rgb(217, 119, 6), rgb(180, 83, 9))'
                        : isLightTheme 
                          ? 'rgba(255, 255, 255, 0.8)' 
                          : 'rgba(0, 0, 0, 0.5)',
                      color: viewMode === 'grid' 
                        ? '#ffffff'
                        : isLightTheme 
                          ? 'rgba(17, 24, 39, 0.7)' 
                          : 'rgba(255, 255, 255, 0.7)',
                      border: viewMode === 'grid'
                        ? '1px solid rgb(217, 119, 6)'
                        : '1px solid rgba(217, 119, 6, 0.3)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (viewMode !== 'grid') {
                        e.currentTarget.style.background = isLightTheme 
                          ? 'rgba(217, 119, 6, 0.1)' 
                          : 'rgba(217, 119, 6, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (viewMode !== 'grid') {
                        e.currentTarget.style.background = isLightTheme 
                          ? 'rgba(255, 255, 255, 0.8)' 
                          : 'rgba(0, 0, 0, 0.5)';
                        e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.3)';
                      }
                    }}
                  >
                    Grid View
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`${styles.viewControl} ${viewMode === 'timeline' ? styles.active : ''}`}
                    style={{
                      background: viewMode === 'timeline' 
                        ? 'linear-gradient(135deg, rgb(217, 119, 6), rgb(180, 83, 9))'
                        : isLightTheme 
                          ? 'rgba(255, 255, 255, 0.8)' 
                          : 'rgba(0, 0, 0, 0.5)',
                      color: viewMode === 'timeline' 
                        ? '#ffffff'
                        : isLightTheme 
                          ? 'rgba(17, 24, 39, 0.7)' 
                          : 'rgba(255, 255, 255, 0.7)',
                      border: viewMode === 'timeline'
                        ? '1px solid rgb(217, 119, 6)'
                        : '1px solid rgba(217, 119, 6, 0.3)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (viewMode !== 'timeline') {
                        e.currentTarget.style.background = isLightTheme 
                          ? 'rgba(217, 119, 6, 0.1)' 
                          : 'rgba(217, 119, 6, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (viewMode !== 'timeline') {
                        e.currentTarget.style.background = isLightTheme 
                          ? 'rgba(255, 255, 255, 0.8)' 
                          : 'rgba(0, 0, 0, 0.5)';
                        e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.3)';
                      }
                    }}
                  >
                    Timeline View
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <div className={styles.resultsInfo}>
                <p className={styles.resultsCount}>
                  Showing {filteredEvents.length} of {initialEvents.length} events
                </p>
              </div>

              {/* Schedule Display */}
              {viewMode === 'grid' ? (
                <div className={styles.eventsGrid}>
                  {filteredEvents.map((event) => {
                    const sanityEvent = initialSanityEvents.find(se => se._id === event.id);
                    return (
                      <article key={event.id} className={styles.eventCard} data-type={event.type}>
                        <div className={styles.eventHeader}>
                          <div className={styles.eventBadges}>
                            <span className={styles.dayBadge}>Day {event.day}</span>
                            <span className={styles.typeBadge} data-type={event.type}>
                              {getTypeIcon(event.type)} {event.type}
                            </span>
                          </div>
                          <time className={styles.eventTime}>{formatTime(event.time)}</time>
                        </div>

                        <div className={styles.eventContent}>
                          <div className={styles.eventImageContainer}>
                            {sanityEvent?.image ? (
                              <Image
                                src={urlFor(sanityEvent.image).width(120).height(120).url()}
                                alt={event.title}
                                width={120}
                                height={120}
                                className={styles.eventImage}
                              />
                            ) : event.artist && sanityEvent?.artist?.image ? (
                              <Image
                                src={urlFor(sanityEvent.artist.image).width(120).height(120).url()}
                                alt={event.artist.name}
                                width={120}
                                height={120}
                                className={styles.eventImage}
                              />
                            ) : (
                              <div className={styles.placeholderImage}>
                                <span className={styles.placeholderText}>
                                  {event.title.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className={styles.eventDetails}>
                            <h3 className={styles.eventTitle}>{event.title}</h3>
                            
                            {event.artist && (
                              <p className={styles.artistName}>{event.artist.name}</p>
                            )}

                            <div className={styles.eventMeta}>
                              {event.stage && (
                                <span className={styles.stage}>{event.stage}</span>
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
              ) : (
                <div className={styles.timelineView}>
                  {Object.entries(eventsByDay)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([day, dayEvents]) => (
                      <div key={day} className={styles.timelineDay}>
                        <div className={styles.dayHeader}>
                          <h2 className={styles.dayTitle}>Day {day}</h2>
                          <p className={styles.dayEventCount}>
                            {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                          </p>
                        </div>

                        <div className={styles.timelineEvents}>
                          {(dayEvents as Array<{ event: ScheduleEvent; sanityEvent?: SanityScheduleEvent }>).map(({ event, sanityEvent }) => (
                            <div key={event.id} className={styles.timelineEvent} data-type={event.type}>
                              <div className={styles.timelineLine}></div>
                              <div className={styles.timelineTime}>
                                {formatTime(event.time)}
                              </div>
                              <div className={styles.timelineCard}>
                                <div className={styles.timelineContent}>
                                  {(sanityEvent?.image || (sanityEvent?.artist?.image)) && (
                                    <div className={styles.timelineImage}>
                                      <Image
                                        src={sanityEvent?.image 
                                          ? urlFor(sanityEvent.image).width(80).height(80).url()
                                          : sanityEvent?.artist?.image 
                                            ? urlFor(sanityEvent.artist.image).width(80).height(80).url()
                                            : ''
                                        }
                                        alt={event.artist?.name || event.title}
                                        width={80}
                                        height={80}
                                        className={styles.timelineImageElement}
                                      />
                                    </div>
                                  )}

                                  <div className={styles.timelineDetails}>
                                    <div className={styles.timelineHeader}>
                                      <h4 className={styles.timelineTitle}>{event.title}</h4>
                                      <span className={styles.timelineType} data-type={event.type}>
                                        {getTypeIcon(event.type)} {event.type}
                                      </span>
                                    </div>

                                    {event.artist && (
                                      <p className={styles.timelineArtist}>{event.artist.name}</p>
                                    )}

                                    {event.stage && (
                                      <p className={styles.timelineStage}>{event.stage}</p>
                                    )}

                                    {event.description && (
                                      <p className={styles.timelineDescription}>{event.description}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {filteredEvents.length === 0 && (
                <div className={styles.noResults}>
                  <h3>No events found</h3>
                  <p>Try adjusting your filters or search terms.</p>
                  <button 
                    onClick={() => {
                      setSelectedDay('all');
                      setSelectedStage('all');
                      setSelectedType('all');
                      setSearchQuery('');
                    }}
                    className={styles.clearFiltersButton}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <h2>Schedule Coming Soon</h2>
              <p>The complete festival schedule will be announced soon. Stay tuned for updates!</p>
              <Link href="/" className={styles.backButton}>
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}