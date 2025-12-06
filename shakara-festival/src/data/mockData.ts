import { FestivalInfo, TicketType, ScheduleEvent, MerchItem, Sponsor } from '@/types'

export const festivalInfo: FestivalInfo = {
  name: 'Shakara Festival',
  dates: {
    start: '2025-12-18',
    end: '2025-12-21'
  },
  location: {
    venue: 'Victoria Island',
    city: 'Lagos, Nigeria',
    address: 'Victoria Island, Lagos, Nigeria',
    country: undefined
  },
  description: '4 DAYS CELEBRATING THE BEST MUSIC OF AFRICAN ORIGIN',
  socialLinks: {
    instagram: 'https://instagram.com/shakarafestival',
    twitter: 'https://twitter.com/shakarafestival',
    tiktok: 'https://tiktok.com/@shakarafestival',
    youtube: 'https://youtube.com/@shakarafestival'
  }
}

export const ticketTypes: TicketType[] = [
  {
    id: 'early-1day',
    name: 'Early Bird - 1 Day',
    description: 'Single day access',
    price: 15000,
    features: ['General Admission', 'Access to all stages', 'Food vendors'],
    available: true,
    duration: '1-day',
    type: 'general',
    discount: 25
  },
  {
    id: 'early-4day',
    name: 'Early Bird - 4 Day',
    description: 'Full festival access',
    price: 40000,
    originalPrice: 55000,
    features: ['General Admission', 'Access to all stages', 'Food vendors', 'Festival merchandise'],
    available: true,
    duration: '4-day',
    type: 'general',
    discount: 25
  },
  {
    id: 'vip-4day',
    name: 'VIP Experience - 4 Day',
    description: 'Premium festival access',
    price: 150000,
    features: [
      'VIP viewing areas',
      'Dedicated VIP bar',
      'Premium restrooms',
      'VIP merchandise package',
      'Meet & greet opportunities',
      'Express entry'
    ],
    available: true,
    duration: '4-day',
    type: 'vip'
  },
  {
    id: 'vvip-4day',
    name: 'VVIP Ultimate - 4 Day',
    description: 'Exclusive luxury experience',
    price: 300000,
    features: [
      'VVIP lounge access',
      'Complimentary drinks & food',
      'Backstage access',
      'Artist meet & greets',
      'Luxury merchandise package',
      'Dedicated concierge',
      'Private viewing deck',
      'Valet parking'
    ],
    available: true,
    duration: '4-day',
    type: 'vvip'
  }
]

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: 'day1-noon',
    title: 'Palm Wine',
    description: 'Traditional music and cultural showcase',
    time: '12:00 PM',
    day: 1,
    type: 'livePerformance',
    stage: 'Main Stage'
  },
  {
    id: 'day1-vendors',
    title: 'Vendors Open',
    time: '3:00 PM',
    day: 1,
    type: 'vendors'
  },
  {
    id: 'day1-alte',
    title: 'Alté Day',
    description: 'Alternative Nigerian music showcase',
    time: '6:00 PM',
    day: 1,
    type: 'livePerformance',
    stage: 'Main Stage'
  },
  {
    id: 'day1-afterdark',
    title: 'Shakara After Dark',
    time: '10:00 PM',
    day: 1,
    type: 'afterDark',
    stage: 'Club Stage'
  },
  {
    id: 'day2-panel',
    title: 'Women in Music & Entertainment Panel',
    time: '12:00 PM',
    day: 2,
    type: 'speaker',
    stage: 'Conference Hall'
  },
  {
    id: 'day2-women',
    title: 'Women in Music Showcase',
    time: '6:00 PM',
    day: 2,
    type: 'livePerformance',
    stage: 'Main Stage'
  },
  {
    id: 'day3-conference',
    title: 'Music, Art, Fashion & Tourism Conference',
    time: '12:00 PM',
    day: 3,
    type: 'speaker',
    stage: 'Conference Hall'
  },
  {
    id: 'day3-afrobeats',
    title: 'Afrobeats Night',
    time: '6:00 PM',
    day: 3,
    type: 'livePerformance',
    stage: 'Main Stage'
  },
  {
    id: 'day4-gospel',
    title: 'Gospel Night Live',
    time: '6:00 PM',
    day: 4,
    type: 'livePerformance',
    stage: 'Main Stage'
  }
]

export const merchItems: MerchItem[] = [
  {
    id: 'tshirt-basic',
    name: 'Shakara Festival T-Shirt',
    description: 'Premium festival tee with vibrant Afro-futuristic design',
    price: 8000,
    category: 'apparel',
    available: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Yellow', 'Pink']
  },
  {
    id: 'cap-snapback',
    name: 'Shakara Snapback Cap',
    description: 'Premium snapback with embroidered logo',
    price: 6000,
    category: 'headwear',
    available: true,
    colors: ['Black', 'White', 'Orange']
  },
  {
    id: 'tote-bag',
    name: 'Festival Tote Bag',
    description: 'Eco-friendly canvas tote with festival artwork',
    price: 4000,
    category: 'accessories',
    available: true,
    colors: ['Natural', 'Black']
  },
  {
    id: 'water-bottle',
    name: 'Shakara Water Bottle',
    description: 'Reusable steel water bottle',
    price: 5000,
    category: 'gear',
    available: true,
    colors: ['Black', 'Silver']
  }
]

export const sponsors: Sponsor[] = [
  {
    id: 'balmoral',
    name: 'Balmoral Events',
    tier: 'partner'
  },
  {
    id: 'showgear',
    name: 'Showgear',
    tier: 'partner'
  },
  {
    id: 'hepzibah',
    name: 'Hepzibah',
    tier: 'partner'
  },
  {
    id: 'idyha',
    name: 'Idyha',
    tier: 'partner'
  }
]