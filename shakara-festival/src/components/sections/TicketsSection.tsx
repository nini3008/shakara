// components/sections/TicketsSection.tsx - Server Component
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { writeClient, client, TICKETS_QUERY } from '@/lib/sanity';
import { TicketType } from '@/types';
import { SanityTicket, adaptSanityTicket } from '@/types/sanity-adapters';
import TicketsSectionClient from './TicketsSectionClient';
import { CART_ENABLED } from '@/lib/featureFlags'

async function getFeaturedTickets(): Promise<{ tickets: TicketType[], sanityTickets: SanityTicket[] }> {
  try {
    // Fetch all tickets directly from Sanity without additional filtering
    // Use writeClient if available for consistent environment/perspective
    const reader = writeClient || client
    const sanityTickets: SanityTicket[] = await reader.fetch(TICKETS_QUERY);
    const nonAddons = sanityTickets.filter((t: SanityTicket) => t?.type !== 'addon');
    const tickets = nonAddons.map(adaptSanityTicket);
    return { tickets, sanityTickets: nonAddons };
  } catch (error) {
    console.error('Error fetching featured tickets:', error);
    return { tickets: [], sanityTickets: [] };
  }
}

export default async function TicketsSection() {
  const { tickets, sanityTickets } = await getFeaturedTickets();
  
  return (
    <>
      <TicketsSectionClient 
        initialTickets={tickets}
        initialSanityTickets={sanityTickets}
        showAddonsUpsell={CART_ENABLED}
      />
    </>
  );
}
