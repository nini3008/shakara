import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9u7w33ib'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN in environment')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2023-05-03', token })

type TicketSeed = {
  sku: string
  name: string
  slug: string
  type: 'general' | 'pit' | 'vip' | 'vvip'
  category: 'standard' | 'early-bird'
  duration: '1-day' | '2-day' | '3-day' | '4-day'
  price: number
  originalPrice?: number
  badge?: string
  features: string[]
  featured?: boolean
}

const seeds: TicketSeed[] = [
  {
    sku: 'TKT-STD-PIT-4D',
    name: 'Pit Access',
    slug: 'pit-access',
    type: 'pit',
    category: 'standard',
    duration: '4-day',
    price: 250000,
    badge: 'FRONT ROW',
    features: [
      'Exclusive pit access at headliners',
      'Dedicated pit entry lane',
      'Limited capacity for optimal comfort',
      'Souvenir lanyard and credential',
    ],
    featured: true,
  },
  {
    sku: 'TKT-STD-GA-4D',
    name: 'General Admission',
    slug: 'general-admission',
    type: 'general',
    category: 'standard',
    duration: '4-day',
    price: 75000,
    originalPrice: 95000,
    badge: 'MOST POPULAR',
    features: [
      'All-day access to main festival areas',
      'Access to food courts and merch village',
      'Free water refill stations',
      'Festival app and schedule access',
    ],
    featured: true,
  },
  {
    sku: 'TKT-STD-VIP-4D',
    name: 'VIP',
    slug: 'vip',
    type: 'vip',
    category: 'standard',
    duration: '4-day',
    price: 180000,
    originalPrice: 220000,
    badge: 'PREMIUM',
    features: [
      'Dedicated VIP fast-track entry',
      'VIP viewing zones at main stages',
      'Access to VIP lounges and premium bars',
      'Private restrooms and concierge support',
    ],
    featured: true,
  },
  {
    sku: 'TKT-STD-VVIP-4D',
    name: 'VVIP',
    slug: 'vvip',
    type: 'vvip',
    category: 'standard',
    duration: '4-day',
    price: 400000,
    badge: 'ELITE',
    features: [
      'Backstage-inspired hosted lounge',
      'Complimentary drinks and canapés',
      'Valet drop-off and dedicated support',
      'Best-in-venue stage viewing access',
    ],
    featured: true,
  },
]

async function run() {
  const mutations = seeds.map((t) => ({
    createOrReplace: {
      _id: `ticket.${t.sku}`,
      _type: 'ticket',
      sku: t.sku,
      name: t.name,
      slug: { current: t.slug },
      type: t.type,
      category: t.category,
      duration: t.duration,
      price: t.price,
      originalPrice: t.originalPrice,
      currency: 'NGN',
      features: t.features,
      available: true,
      soldOut: false,
      bundleSize: 1,
      featured: t.featured ?? false,
      badge: t.badge,
      order: 0,
      live: true,
      taxInclusive: true,
      feesIncluded: false,
    },
  }))

  const res = await client.transaction(mutations as any).commit({ autoGenerateArrayKeys: true })
  console.log('Seeded tickets:', seeds.map((s) => s.sku).join(', '))
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})


