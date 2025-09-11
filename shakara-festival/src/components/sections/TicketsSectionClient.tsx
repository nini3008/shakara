// components/sections/TicketsSectionClient.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { TicketType } from '@/types';
import { SanityTicket } from '@/types/sanity-adapters';
import Link from 'next/link';
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

  const formatPrice = (price: number, currency: string = '₦') => {
    return `${currency}${price.toLocaleString()}`;
  };

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

  return (
    <section id="tickets" className={styles.ticketsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Tickets
        </h2>
        
        {initialTickets.length > 0 ? (
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
                            <span className={styles.currentPrice}>
                              {formatPrice(ticket.price, sanityTicket.currency)}
                            </span>
                            {ticket.originalPrice && ticket.originalPrice > ticket.price && (
                              <span className={styles.originalPrice}>
                                {formatPrice(ticket.originalPrice, sanityTicket.currency)}
                              </span>
                            )}
                          </div>
                          {ticket.discount && (
                            <span className={styles.discount}>
                              Save {ticket.discount}%
                            </span>
                          )}
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
                        {sanityTicket.soldOut ? (
                          <button 
                            disabled 
                            className={styles.soldOutButton}
                            aria-label={`${ticket.name} - Sold Out`}
                          >
                            Sold Out
                          </button>
                        ) : ticket.available ? (
                          <Link 
                            href={`/tickets/${sanityTicket.slug.current}`} 
                            className={styles.buyButton}
                            aria-label={`Buy ${ticket.name} ticket`}
                          >
                            Buy Now
                          </Link>
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
            
            <div className={styles.buttonContainer}>
              <Link 
                href="/tickets" 
                className={styles.viewAllButton}
                aria-label="View all available tickets"
              >
                View All Tickets
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