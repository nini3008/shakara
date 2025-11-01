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
  day?: '2025-12-18' | '2025-12-19' | '2025-12-20' | '2025-12-21'
  price: number
  originalPrice?: number
  badge?: string
  features: string[]
  featured?: boolean
  isBundle?: boolean
  bundle?: {
    dayCount: number
    targetSku: string
  }
}

const seeds: TicketSeed[] = [
  {
    sku: 'TKT-PIT-FRI',
    name: 'Pit Access - Friday',
    slug: 'pit-access-fri',
    type: 'pit',
    category: 'standard',
    duration: '1-day',
    day: '2025-12-19',
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
    sku: 'TKT-GA-FRI',
    name: 'General Admission - Friday',
    slug: 'general-admission-fri',
    type: 'general',
    category: 'standard',
    duration: '1-day',
    day: '2025-12-19',
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
    sku: 'TKT-VIP-SAT',
    name: 'VIP - Saturday',
    slug: 'vip-sat',
    type: 'vip',
    category: 'standard',
    duration: '1-day',
    day: '2025-12-20',
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
    sku: 'TKT-VVIP-SUN',
    name: 'VVIP - Sunday',
    slug: 'vvip-sun',
    type: 'vvip',
    category: 'standard',
    duration: '1-day',
    day: '2025-12-21',
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
  // Bundle example: GA Friday 4-Pack
  {
    sku: 'TKT-GA-FRI-4PK',
    name: 'General Admission 4‑Pack - Friday',
    slug: 'ga-4pack-fri',
    type: 'general',
    category: 'standard',
    duration: '3-day',
    price: 260000, // total bundle price
    features: [
      'Access to three festival days',
      'Bundle savings applied',
    ],
    isBundle: true,
    bundle: {
      dayCount: 3,
      targetSku: 'TKT-GA-FRI',
    },
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
      day: t.day,
      price: t.price,
      originalPrice: t.originalPrice,
      currency: 'NGN',
      features: t.features,
      available: true,
      soldOut: false,
      isBundle: t.isBundle || false,
      bundle: t.bundle,
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


