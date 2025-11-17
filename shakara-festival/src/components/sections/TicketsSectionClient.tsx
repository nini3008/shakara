// components/sections/TicketsSectionClient.tsx
'use client';

import { useState, FormEvent, useEffect, useMemo } from 'react';
import { TicketType } from '@/types';
import { SanityTicket } from '@/types/sanity-adapters';
import { useCart } from '@/contexts/CartContext';
import { CART_ENABLED } from '@/lib/featureFlags';
import { trackAddToCart } from '@/lib/analytics';
import styles from './TicketsSection.module.scss';
import TicketsSectionAddonsUpsell from './TicketsSectionAddonsUpsell';
import Link from 'next/link';

interface TicketsSectionClientProps {
  initialTickets: TicketType[];
  initialSanityTickets: SanityTicket[];
  showAddonsUpsell?: boolean;
}

const durationToDays = (duration?: string | null) => {
  if (!duration) return 1
  const parsed = parseInt(duration, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

const formatDateLabel = (dates: string[]): string => {
  if (!dates || dates.length === 0) return ''
  const sorted = [...dates].sort()
  if (sorted.length === 1) {
    return ` - ${new Date(sorted[0]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
  }
  if (sorted.length === 2) {
    const [first, second] = sorted
    return ` - ${new Date(first).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} & ${new Date(second).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
  }
  const first = new Date(sorted[0]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const last = new Date(sorted[sorted.length - 1]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return ` - ${first} to ${last}`
}

const formatSelectedDatesSummary = (dates: string[]): string => {
  if (!dates || dates.length === 0) return ''
  const formatted = [...dates]
    .sort()
    .map((date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))

  if (formatted.length === 1) return formatted[0]
  if (formatted.length === 2) return `${formatted[0]} & ${formatted[1]}`
  return `${formatted[0]} - ${formatted[formatted.length - 1]}`
}

export default function TicketsSectionClient({ initialTickets, initialSanityTickets, showAddonsUpsell = false }: TicketsSectionClientProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [selectionConfirmed, setSelectionConfirmed] = useState(false);
  const [showBundlesOnly, setShowBundlesOnly] = useState(false);
  const { addItem } = useCart();
  const idToTicket = new Map(initialTickets.map((t) => [t.id, t]));
  const bundlesByTarget = new Map(
     (initialSanityTickets || [])
      .filter((t) => t.isBundle && t.bundle?.targetSku)
      .map((t) => [t.bundle?.targetSku as string, t])
  );

  // Day selector - now supports multiple selection
  // Always show all festival days
  const allFestivalDays = ['2025-12-18', '2025-12-19', '2025-12-20', '2025-12-21'];
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set([allFestivalDays[0]]));

  // Filter tickets based on selected days and duration
  const sortedSelectedDays = useMemo(() => Array.from(selectedDays).sort(), [selectedDays])

  const filteredTickets = useMemo(() => {
    const numDaysSelected = selectedDays.size;

    const eligibleTickets = (initialSanityTickets || [])
      .filter(st => st.type !== 'addon')
      .filter(st => {
        const duration = durationToDays(st.duration);

        if (st.day) {
          return selectedDays.has(st.day);
        }

        if (!st.day && duration > 1) {
          return duration === numDaysSelected;
        }

        return numDaysSelected === 1;
      });

    const getFirstVisibleDate = (ticket: SanityTicket): string | undefined => {
      if (ticket.day) return ticket.day;
      return sortedSelectedDays[0];
    };

    const getVisibleDayCount = (ticket: SanityTicket): number => {
      if (ticket.day) return 1;
      if (ticket.bundle?.dayCount && ticket.bundle.dayCount > 0) return ticket.bundle.dayCount;
      return durationToDays(ticket.duration);
    };

    const getOrderValue = (ticket: SanityTicket): number => {
      return typeof ticket.order === 'number' ? ticket.order : Number.MAX_SAFE_INTEGER;
    };

    return eligibleTickets.slice().sort((a, b) => {
      const aIsBundle = Boolean(a.isBundle);
      const bIsBundle = Boolean(b.isBundle);

      if (aIsBundle !== bIsBundle) {
        return aIsBundle ? -1 : 1;
      }

      const aDate = getFirstVisibleDate(a);
      const bDate = getFirstVisibleDate(b);

      if (aDate && bDate) {
        const dateComparison = aDate.localeCompare(bDate);
        if (dateComparison !== 0) {
          return dateComparison;
        }
      } else if (aDate || bDate) {
        return aDate ? -1 : 1;
      }

      const dayCountComparison = getVisibleDayCount(a) - getVisibleDayCount(b);
      if (dayCountComparison !== 0) {
        return dayCountComparison;
      }

      const orderComparison = getOrderValue(a) - getOrderValue(b);
      if (orderComparison !== 0) {
        return orderComparison;
      }

      return a.name.localeCompare(b.name);
    });
  }, [initialSanityTickets, selectedDays, sortedSelectedDays]);
  const displayedTickets = useMemo(() => {
    if (showBundlesOnly) {
      return filteredTickets.filter((ticket) => ticket.isBundle)
    }
    return filteredTickets
  }, [filteredTickets, showBundlesOnly])

  const visibleBundleSkus = useMemo(() => new Set(
    displayedTickets
      .filter(st => st.isBundle && st.sku)
      .map(st => String(st.sku))
  ), [displayedTickets])

  const selectionSummary = useMemo(() => formatSelectedDatesSummary(sortedSelectedDays), [sortedSelectedDays])

  const handleConfirmSelection = () => {
    setSelectionConfirmed(true)
  }

  const handleEditSelection = () => {
    setSelectionConfirmed(false)
  }

  const handleToggleBundlesFilter = () => {
    setShowBundlesOnly((prev) => !prev)
  }

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

  // Prices are intentionally hidden on ticket cards

  const handleNotifySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          firstName: firstName || 'Festival Fan',
          interests: ['Ticket Notifications']
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setShowSuccess(true);
        setEmail('');
        setFirstName('');
      } else {
        setError(result.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      setError('Failed to subscribe. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable curated fallback; if CMS has no tickets, show the "Tickets Coming Soon" empty state
  const showCurated = false
  const curatedTiers = [
    {
      id: 'pit',
      name: 'Pit Access',
      price: 250000,
      originalPrice: 0,
      currency: '₦',
      badge: 'Front Row',
      theme: 'pit',
      description: 'Closest to the action in the pit for the biggest headline sets.',
      features: [
        'Exclusive pit access at headliners',
        'Dedicated pit entry lane',
        'Limited capacity for optimal comfort',
        'Souvenir lanyard and credential',
      ],
    },
    {
      id: 'general',
      name: 'General Admission',
      price: 75000,
      originalPrice: 95000,
      currency: '₦',
      badge: 'Most Popular',
      theme: 'general',
      description: 'Access to festival grounds, main stages, and general amenities for all days.',
      features: [
        'All-day access to main festival areas',
        'Access to food courts and merch village',
        'Free water refill stations',
        'Festival app and schedule access',
      ],
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 180000,
      originalPrice: 220000,
      currency: '₦',
      badge: 'Premium',
      theme: 'vip',
      description: 'Elevated experience with faster entry, premium viewing, and exclusive lounges.',
      features: [
        'Dedicated VIP fast-track entry',
        'VIP viewing zones at main stages',
        'Access to VIP lounges and premium bars',
        'Private restrooms and concierge support',
      ],
    },
    {
      id: 'vvip',
      name: 'VVIP',
      price: 400000,
      originalPrice: 0,
      currency: '₦',
      badge: 'Elite',
      theme: 'vvip',
      description: 'White-glove hospitality with backstage vibes, hosted lounges, and valet.',
      features: [
        'Backstage-inspired hosted lounge',
        'Complimentary drinks and canapés',
        'Valet drop-off and dedicated support',
        'Best-in-venue stage viewing access',
      ],
    },
  ]

  // Toggle day selection
  const toggleDay = (day: string) => {
    const newSelectedDays = new Set(selectedDays);
    if (newSelectedDays.has(day)) {
      // Don't allow deselecting the last day
      if (newSelectedDays.size > 1) {
        newSelectedDays.delete(day);
      }
    } else {
      newSelectedDays.add(day);
    }
    setSelectedDays(newSelectedDays);
    setSelectionConfirmed(false);
    setShowBundlesOnly(false);
  };

  return (
    <>
    <section id="tickets" className={styles.ticketsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Tickets
        </h2>
        <div
          className={styles.deeplinkCallout}
          role="complementary"
          aria-label="Plan which tickets to buy"
        >
          <div className={styles.deeplinkCopy}>
            <p className={styles.deeplinkEyebrow}>Dropped in from a link?</p>
            <p className={styles.deeplinkBody}>
              Preview each day&apos;s schedule and artist line up to decide which passes fit your vibe
              before you checkout tickets.
            </p>
          </div>
          <div className={styles.deeplinkActions}>
            <Link href="/schedule" className={styles.deeplinkLink}>
              View schedule
            </Link>
            <Link href="/lineup" className={styles.deeplinkLinkSecondary}>
              See lineup
            </Link>
          </div>
        </div>
        
        {(!showCurated && initialTickets.length > 0) ? (
          <>
            <div className={`${styles.stepHeader} ${selectionConfirmed ? styles.stepMuted : ''}`}>
              <span className={styles.stepBadge} aria-label="Step 1">1</span>
              <div className={styles.stepHeaderContent}>
                <h3 className={styles.stepTitle}>Select your festival days</h3>
                <p className={styles.stepDescription}>
                  {selectionConfirmed && selectionSummary
                    ? `Tickets unlocked for ${selectionSummary}.`
                    : 'Pick one or multiple days, then confirm to unlock tickets.'}
                </p>
              </div>
              {selectionConfirmed && (
                <button
                  type="button"
                  onClick={handleEditSelection}
                  className={styles.editSelectionButton + ' clickable'}
                >
                  Change selection
                </button>
              )}
            </div>

            <div className={`${styles.dateSelectionPanel} ${selectionConfirmed ? styles.stepMutedPanel : ''}`}>
              <div className={styles.dateButtonsRow}>
                {allFestivalDays.map((day) => {
                  const isSelected = selectedDays.has(day);
                  const label = new Date(day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      aria-pressed={isSelected}
                      className={styles.dateToggle + ' clickable'}
                      data-selected={isSelected ? 'true' : 'false'}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {!selectionConfirmed ? (
                <button
                  type="button"
                  onClick={handleConfirmSelection}
                  className={styles.confirmSelectionButton + ' clickable'}
                >
                  Confirm dates
                </button>
              ) : (
                <div className={styles.selectionSummary}>
                  <span className={styles.selectionSummaryLabel}>Confirmed:</span>
                  <span className={styles.selectionSummaryValue}>{selectionSummary}</span>
                </div>
              )}
            </div>

            <div className={styles.stepHeader}>
              <span className={styles.stepBadge} aria-label="Step 2">2</span>
              <div className={styles.stepHeaderContent}>
                <h3 className={styles.stepTitle}>Browse ticket options</h3>
                <p className={styles.stepDescription}>
                  {selectionConfirmed
                    ? 'Add tickets that match your confirmed dates.'
                    : 'Submit your dates to unlock the tickets grid.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleBundlesFilter}
                className={styles.bundleToggle + ' clickable'}
                aria-pressed={showBundlesOnly}
                disabled={!selectionConfirmed}
              >
                {showBundlesOnly ? 'Show all tickets' : 'Show bundles only'}
              </button>
            </div>

            <div className={styles.ticketsGridWrapper}>
              <div className={`${styles.ticketsGrid} ${!selectionConfirmed ? styles.ticketsGridLocked : ''}`}>
                {displayedTickets.length === 0 ? (
                  <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
                  <div className={styles.emptyIcon} role="img" aria-label="Calendar emoji">📅</div>
                  <h3 className={styles.emptyTitle}>
                    {showBundlesOnly
                      ? 'No bundles match your confirmed dates'
                      : `No tickets available for ${selectedDays.size} day${selectedDays.size > 1 ? 's' : ''}`}
                  </h3>
                  <p className={styles.emptyDescription}>
                    {showBundlesOnly
                      ? 'Try showing all tickets or adjusting your dates to see more bundle options.'
                      : selectedDays.size === 1 
                        ? 'Tickets for this date combination are not yet available. Try selecting multiple days to see bundle options.'
                        : `No ${selectedDays.size}-day tickets are currently available. Try selecting different date combinations.`
                    }
                  </p>
                  <div className={styles.emptyHint}>
                    💡 Tip: Select exactly 3 days to see our popular 3-day passes!
                  </div>
                </div>
                ) : (
                displayedTickets.map((sanityTicket) => {
                const ticket = idToTicket.get(sanityTicket._id);
                if (!sanityTicket) return null;
                if (!ticket) {
                  console.warn(`No app ticket found for sanity _id: ${sanityTicket._id}`);
                  return null;
                }
                
                const isBundleTicket = Boolean(sanityTicket.isBundle)
                const associatedBundle = !isBundleTicket ? bundlesByTarget.get(sanityTicket.sku) : undefined
                const bundleDayCountRaw = associatedBundle?.bundle?.dayCount ?? 0
                const bundleDayCount = bundleDayCountRaw > 0 ? bundleDayCountRaw : 0
                const bundlePer = associatedBundle && bundleDayCount > 0 ? Math.round(associatedBundle.price / bundleDayCount) : 0

                const badgeEntries = [] as Array<{ label: string; variant: 'default' | 'bundle' }>
                if (sanityTicket.badge) {
                  badgeEntries.push({ label: sanityTicket.badge, variant: 'default' })
                }
                if (isBundleTicket) {
                  badgeEntries.push({ label: 'Bundle', variant: 'bundle' })
                }
                const showBundleAvailableBadge = !isBundleTicket && associatedBundle && !visibleBundleSkus.has(String(associatedBundle.sku))

                const themeClass = styles['theme_' + (ticket.type || 'general')]
                const durationDays = durationToDays(ticket.duration)
                const bundleConfiguredDayCount = sanityTicket.bundle?.dayCount ?? 0
                const expectedDayCount = sanityTicket.day
                  ? 1
                  : bundleConfiguredDayCount > 0
                    ? bundleConfiguredDayCount
                    : durationDays
                const requiresMultiDaySelection = expectedDayCount > 1
                const ticketSelectedDates = sanityTicket.day
                  ? [sanityTicket.day]
                  : requiresMultiDaySelection
                    ? sortedSelectedDays
                    : sortedSelectedDays.length > 0
                      ? sortedSelectedDays
                      : []
                const ticketHasRequiredDates = sanityTicket.day
                  ? true
                  : requiresMultiDaySelection
                    ? ticketSelectedDates.length === expectedDayCount
                    : ticketSelectedDates.length > 0
                const ticketSelectionHint = !ticketHasRequiredDates
                  ? `Select ${expectedDayCount} unique ${expectedDayCount === 1 ? 'day' : 'days'} for this ticket.`
                  : null
                const bundleSelectedDates = sortedSelectedDays
                const bundleHasRequiredDates = associatedBundle
                  ? bundleDayCount > 0
                    ? bundleSelectedDates.length === bundleDayCount
                    : bundleSelectedDates.length > 0
                  : true
                const formattedTicketLabel = formatDateLabel(ticketSelectedDates)
                const formattedBundleLabel = formatDateLabel(bundleSelectedDates)
                const selectionLocked = !selectionConfirmed
                return (
                  <div key={ticket.id} className={styles.ticketCardWrapper}>
                    <div className={`${styles.ticketCard} ${themeClass || ''}`}>
                      {(badgeEntries.length > 0 || showBundleAvailableBadge) && (
                        <div className={styles.badgeStack}>
                          {badgeEntries.map((badge, index) => (
                            <div
                              key={`${ticket.id}-${badge.label}-${index}`}
                              className={`${styles.badge} ${badge.variant === 'bundle' ? styles.badgeBundle : ''}`}
                            >
                              {badge.label}
                            </div>
                          ))}
                          {showBundleAvailableBadge && (
                            <div className={styles.badgeAux}>Multi-day bundle available</div>
                          )}
                        </div>
                      )}
                      
                      <div className={styles.cardContent}>
                        <h3 className={styles.ticketName}>{ticket.name}</h3>

                        <div className={styles.priceContainer}>
                          <div className={styles.priceGroup}>
                            {ticket.originalPrice && ticket.originalPrice > 0 && (
                              <span className={styles.originalPrice}>
                                ₦{ticket.originalPrice.toLocaleString()}
                              </span>
                            )}
                            <span className={styles.currentPrice}>
                              ₦{ticket.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {!isBundleTicket && associatedBundle && bundleDayCount > 0 && (
                          <div className={styles.bundleSummaryPill}>
                            <span className={styles.bundleSummaryTitle}>{bundleDayCount}-day bundle</span>
                            <span className={styles.bundleSummaryPrice}>₦{associatedBundle.price.toLocaleString()} total · ₦{bundlePer.toLocaleString()} per day</span>
                          </div>
                        )}
                        
                        {ticket.description && (
                          <p className={styles.description}>{ticket.description}</p>
                        )}
                        
                        {ticket.features && ticket.features.length > 0 && (
                          <ul className={styles.featuresList}>
                            {ticket.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className={styles.featureItem}>
                                <svg 
                                  className={styles.featureIcon} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                >
                                  <path 
                                    fillRule="evenodd" 
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                    clipRule="evenodd" 
                                  />
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      
                      <div className={styles.cardFooter}>
                        {!CART_ENABLED ? (
                          <button 
                            disabled 
                            className={styles.unavailableButton}
                            aria-label={`${ticket.name} - Not Available`}
                          >
                            Coming Soon
                          </button>
                        ) : sanityTicket.soldOut ? (
                          <button 
                            disabled 
                            className={styles.soldOutButton}
                            aria-label={`${ticket.name} - Sold Out`}
                          >
                            Sold Out
                          </button>
                        ) : selectionLocked ? (
                          <button 
                            disabled 
                            className={styles.unavailableButton}
                            aria-label={`Confirm your dates to unlock ${ticket.name}`}
                          >
                            Confirm dates to unlock
                          </button>
                        ) : !ticketHasRequiredDates ? (
                          <button 
                            disabled 
                            className={styles.unavailableButton}
                            aria-label={`Select required dates for ${ticket.name}`}
                          >
                            Select Dates
                          </button>
                        ) : ticket.available ? (
                          <button
                            onClick={() => {
                              const selectedDates = ticketSelectedDates
                              if (selectedDates.length === 0) return
                              const sku = typeof sanityTicket.sku === 'string' && sanityTicket.sku.length > 0 ? sanityTicket.sku : ticket.id
                              const variant =
                                selectedDates.length > 0
                                  ? selectedDates.join('|')
                                  : undefined
                              trackAddToCart({
                                items: [
                                  {
                                    item_id: sku,
                                    item_name: ticket.name,
                                    price: ticket.price,
                                    quantity: 1,
                                    item_category: 'ticket',
                                    item_variant: variant,
                                  },
                                ],
                                currency: 'NGN',
                                value: ticket.price,
                              })
                              addItem({ 
                                id: sku, 
                                name: ticket.name + formattedTicketLabel, 
                                price: ticket.price, 
                                quantity: 1, 
                                category: 'ticket', 
                                selectedDates,
                                selectedDate: selectedDates.length === 1 ? selectedDates[0] : undefined
                              });
                              window.dispatchEvent(new Event('cart:add'));
                            }}
                            className={styles.buyButton + ' clickable'}
                            aria-label={`Add ${ticket.name} to basket`}
                          >
                            Add to Basket
                          </button>
                        ) : (
                          <button 
                            disabled 
                            className={styles.unavailableButton}
                            aria-label={`${ticket.name} - Not Available`}
                          >
                            Coming Soon
                          </button>
                        )}
                        {CART_ENABLED && associatedBundle ? (
                          <div className={styles.bundleHintPill} aria-live="polite">
                            {selectionLocked
                              ? 'Confirm your dates above to preview bundle options.'
                              : bundleHasRequiredDates && bundleDayCount > 0
                                ? 'Bundle ready — toggle “Show bundles only” to view.'
                                : `Select ${bundleDayCount || 2} unique ${(bundleDayCount || 2) === 1 ? 'day' : 'days'} to unlock bundle options.`}
                          </div>
                        ) : null}
                      </div>
                      {ticketSelectionHint && (
                        <div className={styles.selectionHint}>{ticketSelectionHint}</div>
                      )}
                    </div>
                  </div>
                );
                })
              )}
              </div>
              {!selectionConfirmed && (
                <div className={styles.ticketsGridOverlay} aria-hidden="true">
                  <div className={styles.ticketsGridOverlayMessage}>
                    <h4>Tickets locked</h4>
                    <p>Confirm your festival dates above to browse live availability.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : showCurated ? (
          <>
            <div className={styles.ticketsGrid}>
              {curatedTiers.map((t) => (
                <div key={t.id} className={styles.ticketCardWrapper}>
                  <div className={`${styles.ticketCard} ${styles['theme_' + t.theme]}`}>
                    {t.badge && <div className={styles.badge}>{t.badge}</div>}
                    <div className={styles.cardContent}>
                      <h3 className={styles.ticketName}>{t.name}</h3>
                      <div className={styles.priceContainer}>
                        <div className={styles.priceGroup}>
                          {t.originalPrice && t.originalPrice > 0 && (
                            <span className={styles.originalPrice}>
                              ₦{t.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className={styles.currentPrice}>
                            ₦{t.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className={styles.description}>{t.description}</p>
                      <ul className={styles.featuresList}>
                        {t.features.map((f) => (
                          <li key={f} className={styles.featureItem}>
                            <svg className={styles.featureIcon} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.cardFooter}>
                      {CART_ENABLED ? (
                        <button
                        onClick={() => {
                          const itemId = `curated-${t.id}`
                          trackAddToCart({
                            items: [
                              {
                                item_id: itemId,
                                item_name: t.name,
                                price: t.price,
                                quantity: 1,
                                item_category: 'ticket',
                              },
                            ],
                            currency: 'NGN',
                            value: t.price,
                          })
                          addItem({ id: itemId, name: t.name, price: t.price, quantity: 1, category: 'ticket' })
                          window.dispatchEvent(new Event('cart:add'))
                        }}
                        className={styles.buyButton + ' clickable'} aria-label={`Add ${t.name} ticket`}>
                          Add to Basket
                        </button>
                      ) : (
                        <button disabled className={styles.unavailableButton} aria-label={`${t.name} - Not Available`}>
                          Coming Soon
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} role="img" aria-label="Ticket emoji">🎫</div>
            <h3 className={styles.emptyTitle}>Tickets Coming Soon</h3>
            <p className={styles.emptyDescription}>
              Be the first to secure your spot at Africa&apos;s premier music festival. Early bird pricing available when tickets launch.
            </p>
            
            {!showSuccess ? (
              <form onSubmit={handleNotifySubmit} className={styles.notifyForm}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className={styles.nameInput}
                    required
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={styles.emailInput}
                    required
                  />
                </div>
                
                {error && (
                  <p className={styles.errorMessage}>{error}</p>
                )}
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.notifyButton}
                  aria-label="Get notified when tickets become available"
                >
                  {isSubmitting ? 'Subscribing...' : 'Notify Me'}
                </button>
              </form>
            ) : (
              <div className={styles.successState}>
                <p className={styles.successMessage}>
                  Thanks! Check your email for confirmation and you&apos;ll be the first to know when tickets are available.
                </p>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className={styles.resetButton}
                  style={{
                    background: 'transparent',
                    border: `1px solid rgba(34, 197, 94, ${isLightTheme ? '0.6' : '0.5'})`,
                    color: isLightTheme ? '#059669' : '#86efac',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  ref={(el) => {
                    if (el) {
                      // Force color with maximum specificity
                      el.style.setProperty('color', isLightTheme ? '#059669' : '#86efac', 'important');
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isLightTheme 
                      ? 'rgba(34, 197, 94, 0.05)' 
                      : 'rgba(34, 197, 94, 0.1)';
                    e.currentTarget.style.borderColor = isLightTheme 
                      ? 'rgba(34, 197, 94, 0.8)' 
                      : 'rgba(34, 197, 94, 0.7)';
                    e.currentTarget.style.setProperty('color', isLightTheme ? '#059669' : '#86efac', 'important');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = isLightTheme 
                      ? 'rgba(34, 197, 94, 0.6)' 
                      : 'rgba(34, 197, 94, 0.5)';
                    e.currentTarget.style.setProperty('color', isLightTheme ? '#059669' : '#86efac', 'important');
                  }}
                >
                  Subscribe Another Email
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
    {showAddonsUpsell && CART_ENABLED && (
      <TicketsSectionAddonsUpsell selectedDates={sortedSelectedDays} enabled={showAddonsUpsell} />
    )}
    </>
  );
}