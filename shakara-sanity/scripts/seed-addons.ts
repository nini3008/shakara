import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9u7w33ib'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2023-05-03', token })

type Addon = { sku: string; name: string; price: number; description?: string; badge?: string }

const addons: Addon[] = [
  { sku: 'TKT-ADDON-FASTLANE-1D', name: 'Fast Lane Priority Access', price: 30000, description: 'Skip entry queues; includes event access' },
  { sku: 'TKT-ADDON-PARKING', name: 'Parking', price: 3500, description: 'Vehicle parking pass; includes VIP/VVIP space access' },
  { sku: 'TKT-ADDON-CONCIERGE', name: 'Concierge Service', price: 50000, description: 'Priority VIP/VVIP parking and personal assistance' },
  { sku: 'TKT-ADDON-PANEL-D1', name: 'Panel/Masterclass – Day 1', price: 20000 },
  { sku: 'TKT-ADDON-PANEL-D2', name: 'Panel/Masterclass – Day 2', price: 20000, description: 'Includes Fast Lane priority access' },
  { sku: 'TKT-ADDON-PANEL-D3', name: 'Panel/Masterclass – Day 3', price: 20000, description: 'Includes “Shakara After Dark” VIP/VVIP access' },
]

async function run() {
  const mutations = addons.map((a) => ({
    createOrReplace: {
      _id: `ticket.${a.sku}`,
      _type: 'ticket',
      sku: a.sku,
      name: a.name,
      slug: { current: a.sku.toLowerCase() },
      type: 'addon',
      category: 'standard',
      duration: '1-day',
      price: a.price,
      currency: 'NGN',
      description: a.description,
      available: true,
      soldOut: false,
      featured: false,
      order: 100,
    },
  }))

  await client.transaction(mutations as any).commit({ autoGenerateArrayKeys: true })
  console.log('Seeded add-ons:', addons.map((a) => a.sku).join(', '))
}

run().catch((e) => { console.error(e); process.exit(1) })


