// components/sections/TicketsSection.tsx - Following AboutSection Pattern

import { client, FEATURED_TICKETS_QUERY } from '@/lib/sanity';
import { TicketType } from '@/types';
import { SanityTicket, adaptSanityTicket } from '@/types/sanity-adapters';
import Link from 'next/link';
import styles from './TicketsSection.module.scss';

async function getFeaturedTickets(): Promise<{ tickets: TicketType[], sanityTickets: SanityTicket[] }> {
  try {
    const sanityTickets: SanityTicket[] = await client.fetch(FEATURED_TICKETS_QUERY);
    const tickets = sanityTickets.map(adaptSanityTicket);
    return { tickets, sanityTickets };
  } catch (error) {
    console.error('Error fetching featured tickets:', error);
    return { tickets: [], sanityTickets: [] };
  }
}

export default async function TicketsSection() {
  const { tickets, sanityTickets } = await getFeaturedTickets();

  const formatPrice = (price: number, currency: string = '₦') => {
    return `${currency}${price.toLocaleString()}`;
  };

  return (
    <section id="tickets" className={styles.ticketsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Tickets
        </h2>
        
        {tickets.length > 0 ? (
          <>
            <div className={styles.ticketsGrid}>
              {tickets.map((ticket, index) => {
                const sanityTicket = sanityTickets[index];
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
              {"Be the first to secure your spot at Africa's premier music festival. Early bird pricing available when tickets launch."}
            </p>
            <div>
              <button 
                className={styles.notifyButton}
                aria-label="Get notified when tickets become available"
              >
                Notify Me
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}