// components/sections/TicketsSectionClient.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { TicketType } from '@/types';
import { SanityTicket } from '@/types/sanity-adapters';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { CART_ENABLED } from '@/lib/featureFlags';
import styles from './TicketsSection.module.scss';

interface TicketsSectionClientProps {
  initialTickets: TicketType[];
  initialSanityTickets: SanityTicket[];
}

export default function TicketsSectionClient({ initialTickets, initialSanityTickets }: TicketsSectionClientProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLightTheme, setIsLightTheme] = useState(false);
  const { addItem } = useCart();

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

  return (
    <section id="tickets" className={styles.ticketsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Tickets
        </h2>
        
        {(!showCurated && initialTickets.length > 0) ? (
          <>
            <div className={styles.ticketsGrid}>
              {initialTickets.map((ticket) => {
                const sanityTicket = initialSanityTickets.find(st => st._id === ticket.id);
                
                if (!sanityTicket) {
                  console.warn(`No sanity ticket found for ticket ID: ${ticket.id}`);
                  return null;
                }
                
                return (
                  <div key={ticket.id} className={styles.ticketCardWrapper}>
                    <div className={styles.ticketCard}>
                      {sanityTicket.badge && (
                        <div className={styles.badge}>
                          {sanityTicket.badge}
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
                        ) : ticket.available ? (
                          <button
                            onClick={() => {
                              addItem({ id: sanityTicket.sku, name: ticket.name, price: ticket.price, quantity: 1, category: 'ticket' })
                              window.dispatchEvent(new Event('cart:add'))
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
          </>
        ) : showCurated ? (
          <>
            <div className={styles.ticketsGrid}>
              {curatedTiers.map((t) => (
                <div key={t.id} className={styles.ticketCardWrapper}>
                  <div className={`${styles.ticketCard} ${styles[`theme_${t.theme}`]}`}>
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
                        <button onClick={() => { addItem({ id: `curated-${t.id}`, name: t.name, price: t.price, quantity: 1, category: 'ticket' }); window.dispatchEvent(new Event('cart:add')) }} className={styles.buyButton + ' clickable'} aria-label={`Add ${t.name} ticket`}>
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
  );
}