// Run this script with: node seed-faq.js
// Make sure to set your SANITY_TOKEN environment variable or update the token below

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '9u7w33ib',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_TOKEN || '', // Add your token here or use environment variable
})

const faqData = [
  // General Information
  {
    category: 'General Information',
    order: 1,
    question: 'What are the festival hours / when does the event start and end?',
    answer: 'Gates open at 4pm each day. Performances begin around 6pm and conclude by 12am. Please arrive early to clear security and settle in before your favorite artists take the stage.',
    active: true,
  },
  {
    category: 'General Information',
    order: 2,
    question: 'Where is the festival located and how can I get there?',
    answer: `The festival will be held at Eko Energy City, Lekki Peninsula.

Driving: Use Google Map to locate Eko Energy City Gate and follow signage (or ask directions) when you approach.

Public transport: You can take a bus or cab to Eko Hotel Round About (coming from Lekki) or Bonny camp (coming from V.I & Ikoyi), then a short walk or shuttle ride.

Parking: There is on-site free parking available. We encourage carpooling.`,
    active: true,
  },
  {
    category: 'General Information',
    order: 3,
    question: 'Is re-entry allowed if I leave the festival grounds?',
    answer: 'Conditional — Re-entry is allowed only if you have your festival wristband and your hand was stamped upon exit. Please don't remove the wristband or tamper with it.',
    active: true,
  },
  {
    category: 'General Information',
    order: 4,
    question: 'What items am I allowed to bring? What's prohibited?',
    answer: `You may bring small, clear bags or transparent backpacks and essential items like sunscreen, water bottles, hats, and personal hygiene items. All bags will be subject to security screening.

Prohibited items include (but are not limited to): weapons of any kind, drugs, glass containers, large or opaque backpacks, drones, and any unauthorized professional camera equipment.

(We will publish a full "Allowed / Not Allowed" list closer to the event.)`,
    active: true,
  },
  {
    category: 'General Information',
    order: 5,
    question: 'Will there be a map of the festival grounds and stage lineup?',
    answer: 'Yes. A site map showing stage locations, food zones, restrooms, and medical posts will be available on our website and social media.',
    active: true,
  },

  // What to Bring & What to Wear
  {
    category: 'What to Bring & What to Wear',
    order: 1,
    question: 'What should I wear?',
    answer: `Dress for comfort and weather. Here are some suggestions:
• Lightweight, breathable clothing (e.g. T-shirts, shorts, breathable pants)
• A hat or cap, sunglasses, and sunscreen
• Comfortable, closed shoes or sturdy sandals suitable for walking and standing long hours`,
    active: true,
  },
  {
    category: 'What to Bring & What to Wear',
    order: 2,
    question: 'What else should I bring?',
    answer: `You can also come along with the following:
• A refillable, non-metal water bottle or hydration pack (empty on entry, available for filling inside)
• Sunblock / sunscreen and lip balm
• Light rain jacket or poncho (just in case)
• Portable phone charger / power bank
• Earplugs (for close-up stages)
• Any personal medication in labeled containers`,
    active: true,
  },

  // Health, Safety & Comfort
  {
    category: 'Health, Safety & Comfort',
    order: 1,
    question: 'Will there be water available?',
    answer: 'Yes — we will provide free water refill stations throughout the grounds. You are strongly encouraged to bring a refillable bottle. We may also have bottled water for sale. Please stay hydrated all day.',
    active: true,
  },
  {
    category: 'Health, Safety & Comfort',
    order: 2,
    question: 'What medical services will be available?',
    answer: 'There will be a medical centre staffed by certified medical personnel, and it will be clearly marked on the festival map. If you or a friend need assistance, locate the medical centre or alert a festival staff member immediately.',
    active: true,
  },
  {
    category: 'Health, Safety & Comfort',
    order: 3,
    question: 'What safety measures will be in place?',
    answer: `We take your safety seriously. Here are some of the steps we'll have:
• Security screening at all entry points (bag checks, metal detectors)
• Trained security and crowd management personnel on site
• Clearly marked evacuation routes and emergency exits
• Emergency announcements via PA system, screens, or staff in case of incidents`,
    active: true,
  },
  {
    category: 'Health, Safety & Comfort',
    order: 4,
    question: 'What should I do if I feel unwell or see something suspicious?',
    answer: 'Head to the medical centre or contact festival staff/security. If you see something that seems off — a lost child, a suspicious object, unsafe behavior — report it immediately to staff or security. Better safe than sorry.',
    active: true,
  },

  // Ticketing & Entry
  {
    category: 'Ticketing & Entry',
    order: 1,
    question: 'Do I need to print my ticket?',
    answer: 'No, the digital version on your phone will suffice. We recommend downloading tickets in advance in case of limited connectivity on-site.',
    active: true,
  },
  {
    category: 'Ticketing & Entry',
    order: 2,
    question: 'What if I bought tickets from a third party?',
    answer: 'We strongly advise purchasing tickets only from official sources. Tickets from unauthorized resellers may be invalid, and we cannot guarantee entry with such tickets.',
    active: true,
  },
  {
    category: 'Ticketing & Entry',
    order: 3,
    question: 'Can I transfer or resell my ticket?',
    answer: 'If transfer or resale is allowed, we will provide instructions via our ticketing platform. Resale outside approved channels may result in invalidation.',
    active: true,
  },
  {
    category: 'Ticketing & Entry',
    order: 4,
    question: 'Are children allowed?',
    answer: 'Children are welcome to enjoy and explore the Shakara Festival junction before 3:00 PM. However, we do not recommend that children under the age of 13 stay for the evening or night activities. All children must be accompanied and supervised by a responsible adult at all times.',
    active: true,
  },

  // Access & Accessibility
  {
    category: 'Access & Accessibility',
    order: 1,
    question: 'Is the festival accessible for people with disabilities?',
    answer: 'Yes. We provide accessible pathways, viewing platforms, and services for persons with mobility needs.',
    active: true,
  },

  // Miscellaneous
  {
    category: 'Miscellaneous',
    order: 1,
    question: 'Will there be food, drinks & merchandise on site?',
    answer: 'Yes — a range of food vendors, beverage stations (non-alcoholic and alcoholic), and official merchandise booths will be available. Payments will be via digital payment systems or the Shakara currency of the day.',
    active: true,
  },
  {
    category: 'Miscellaneous',
    order: 2,
    question: 'What happens if it rains or weather is bad?',
    answer: 'Shakara Festival is rain or shine. Unless conditions are extreme or pose safety risks, performances will proceed. If there are changes or delays, we'll communicate via social media and on-site announcements.',
    active: true,
  },
  {
    category: 'Miscellaneous',
    order: 3,
    question: 'Can I bring my own chair / blanket?',
    answer: 'Light, low-back chairs or picnic blankets are usually allowed, but large chairs or items that block the view of others may be prohibited. Check the "Allowed Items" list closer to the event.',
    active: true,
  },
  {
    category: 'Miscellaneous',
    order: 4,
    question: 'Is photography permitted?',
    answer: 'Personal photography (with phones) is permitted. However, small or professional cameras (those with detachable lenses) or video filming is prohibited.',
    active: true,
  },
]

async function seedFAQs() {
  try {
    console.log('Starting FAQ seed...')

    for (const faq of faqData) {
      const doc = {
        _type: 'faq',
        ...faq,
      }

      const result = await client.create(doc)
      console.log(`Created FAQ: ${faq.question.substring(0, 50)}...`)
    }

    console.log(`\n✅ Successfully created ${faqData.length} FAQs!`)
    console.log('\nNext steps:')
    console.log('1. Go to your Sanity Studio (http://localhost:3333)')
    console.log('2. Navigate to the FAQ section')
    console.log('3. Review and edit the FAQs as needed')
  } catch (error) {
    console.error('Error seeding FAQs:', error)
  }
}

seedFAQs()
