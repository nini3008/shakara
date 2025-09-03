// components/sections/TicketsSection.tsx - Server Component
import { client, FEATURED_TICKETS_QUERY } from '@/lib/sanity';
import { TicketType } from '@/types';
import { SanityTicket, adaptSanityTicket } from '@/types/sanity-adapters';
import TicketsSectionClient from './TicketsSectionClient';

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
  
  return (
    <TicketsSectionClient 
      initialTickets={tickets}
      initialSanityTickets={sanityTickets}
    />
  );
}