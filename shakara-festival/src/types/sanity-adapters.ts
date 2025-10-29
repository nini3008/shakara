// types/sanity-adapters.ts

import { urlFor } from '@/lib/sanity';
import { Artist, TicketType, ScheduleEvent, MerchItem, Partner, AboutEssentialInfo, AboutHighlight, AboutSectionData, LineupSectionData, FooterSectionData, FooterLink, FooterBrandSection, FooterSocialLinks } from './index';

// Sanity raw data interfaces
export interface SanityArtist {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  image?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  genre?: string;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    youtube?: string;
  };
  performanceDay?: number;
  performanceTime?: string;
  stage?: string;
  featured: boolean;
}

export interface SanityTicket {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  sku: string;
  price: number;
  originalPrice?: number;
  testPrice?: number;
  currency: string;
  features?: string[];
  available: boolean;
  duration?: string;
  type?: string;
  discount?: number;
  category?: string;
  bundleSize?: number;
  packageType?: string;
  inventory?: number;
  sold?: number;
  reserved?: number;
  allowOversell?: boolean;
  maxQuantity?: number;
  soldOut: boolean;
  saleStartDate?: string;
  saleEndDate?: string;
  featured: boolean;
  badge?: string;
  order?: number;
  live?: boolean;
  taxInclusive?: boolean;
  feesIncluded?: boolean;
  fwProductId?: string;
  fwPaymentLink?: string;
  lastSyncedNote?: string;
}

export interface SanityScheduleEvent {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  time: string;
  endTime?: string;
  day: number;
  type?: string;
  artist?: SanityArtist;
  stage?: string;
  featured: boolean;
  ticketRequired?: boolean;
  capacity?: number;
  image?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
}

export interface SanityMerchItem {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  price: number;
  compareAtPrice?: number;
  images?: Array<{
    asset: {
      _ref: string;
      _type: 'reference';
    };
  }>;
  category?: string;
  available: boolean;
  preOrder?: boolean;
  sizes?: string[];
  colors?: string[];
  material?: string;
  featured: boolean;
  newArrival?: boolean;
  limitedEdition?: boolean;
  inventory?: number;
  tags?: string[];
}

// Adapter functions to convert Sanity data to your app types
export function adaptSanityArtist(sanityArtist: SanityArtist): Artist {
  return {
    id: sanityArtist._id,
    name: sanityArtist.name,
    genre: sanityArtist.genre || '',
    image: sanityArtist.image ? undefined : undefined, // We'll handle images separately with urlFor
    bio: sanityArtist.bio,
    socialLinks: {
      instagram: sanityArtist.socialLinks?.instagram,
      twitter: sanityArtist.socialLinks?.twitter,
      spotify: sanityArtist.socialLinks?.spotify,
    },
    day: sanityArtist.performanceDay, // Map performanceDay to day
    time: sanityArtist.performanceTime, // Map performanceTime to time
    stage: sanityArtist.stage,
  };
}

export function adaptSanityTicket(sanityTicket: SanityTicket): TicketType {
  // Map duration string to your type
  const durationMap: Record<string, TicketType['duration']> = {
    '1-day': '1-day',
    '2-day': '2-day', 
    '3-day': '3-day',
    '4-day': '4-day',
    '1 day': '1-day',
    '2 days': '2-day',
    '3 days': '3-day',
    '4 days': '4-day',
  };

  // Map type string to your type
  const typeMap: Record<string, TicketType['type']> = {
    general: 'general',
    pit: 'pit',
    vip: 'vip',
    vvip: 'vvip',
    family: 'family',
    addon: 'addon',
  };

  // Map category string to your type
  const categoryMap: Record<string, TicketType['category']> = {
    'early-bird': 'early-bird',
    'early bird': 'early-bird',
    early: 'early-bird',
    standard: 'standard',
    regular: 'standard',
  };

  // Map packageType string to your type
  const packageTypeMap: Record<string, TicketType['packageType']> = {
    standard: 'standard',
    table: 'table',
    'vip-table': 'table',
  };

  return {
    id: sanityTicket._id,
    name: sanityTicket.name,
    description: sanityTicket.description || '',
    price: sanityTicket.price,
    originalPrice: sanityTicket.originalPrice,
    features: sanityTicket.features || [],
    available: sanityTicket.available && !sanityTicket.soldOut,
    duration: durationMap[sanityTicket.duration?.toLowerCase() || ''] || '1-day',
    type: typeMap[sanityTicket.type?.toLowerCase() || ''] || 'general',
    discount: sanityTicket.discount,
    sku: sanityTicket.sku,
    testPrice: sanityTicket.testPrice,
    category: categoryMap[sanityTicket.category?.toLowerCase() || ''],
    bundleSize: sanityTicket.bundleSize ?? 1,
    packageType: packageTypeMap[sanityTicket.packageType?.toLowerCase() || ''],
    inventory: sanityTicket.inventory,
    sold: sanityTicket.sold ?? 0,
    reserved: sanityTicket.reserved ?? 0,
    allowOversell: sanityTicket.allowOversell ?? false,
    live: sanityTicket.live ?? true,
    taxInclusive: sanityTicket.taxInclusive ?? true,
    feesIncluded: sanityTicket.feesIncluded ?? false,
    fwProductId: sanityTicket.fwProductId,
    fwPaymentLink: sanityTicket.fwPaymentLink,
    lastSyncedNote: sanityTicket.lastSyncedNote,
  };
}

export function adaptSanityScheduleEvent(sanityEvent: SanityScheduleEvent): ScheduleEvent {
  // Map type string to your type
  const typeMap: Record<string, ScheduleEvent['type']> = {
    music: 'music',
    panel: 'panel',
    vendors: 'vendors',
    afterparty: 'afterparty',
    conference: 'panel', // Map conference to panel
  };

  return {
    id: sanityEvent._id,
    title: sanityEvent.title,
    description: sanityEvent.description,
    time: sanityEvent.time,
    day: sanityEvent.day,
    type: typeMap[sanityEvent.type?.toLowerCase() || ''] || 'music',
    artist: sanityEvent.artist ? adaptSanityArtist(sanityEvent.artist) : undefined,
    stage: sanityEvent.stage,
  };
}

export function adaptSanityMerchItem(sanityMerch: SanityMerchItem): MerchItem {
  // Map category string to your type
  const categoryMap: Record<string, MerchItem['category']> = {
    apparel: 'apparel',
    clothing: 'apparel',
    headwear: 'headwear',
    hats: 'headwear',
    accessories: 'accessories',
    gear: 'gear',
  };

  return {
    id: sanityMerch._id,
    name: sanityMerch.name,
    description: sanityMerch.description || '',
    price: sanityMerch.price,
    image: undefined, // We'll handle images separately with urlFor
    category: categoryMap[sanityMerch.category?.toLowerCase() || ''] || 'apparel',
    available: sanityMerch.available,
    sizes: sanityMerch.sizes,
    colors: sanityMerch.colors,
  };
}

export interface SanityHeroSection {
  logo?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  festivalName: string;
  badge?: string;
  dates: {
    start: string;
    end: string;
  };
  location: {
    venue: string;
    city: string;
    country?: string;
    address?: string;
  };
  stats?: {
    artistCount?: number;
    expectedAttendance?: string;
    dayCount?: number;
  };
  heroVideo?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  heroImage?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    facebook?: string;
    spotify?: string;
  };
  description?: string;
  ctaButtons?: {
    primary?: {
      text?: string;
      url?: string;
      enabled?: boolean;
    };
    secondary?: {
      text?: string;
      url?: string;
      enabled?: boolean;
    };
  };
  showScrollIndicator?: boolean;
  showStats?: boolean;
  showSocialLinks?: boolean;
  active?: boolean;
}

// Add this to your main types/index.ts file
export interface HeroSectionData {
  id: string;
  name: string;
  festivalName: string;
  badge?: string;
  dates: {
    start: string;
    end: string;
  };
  location: {
    venue: string;
    city: string;
    country?: string;
    address?: string;
  };
  stats?: {
    artistCount?: number;
    expectedAttendance?: string;
    dayCount?: number;
  };
  heroVideo?: string;
  heroImage?: string;
  logo?: {
    url: string;
    alt?: string;
  };
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    facebook?: string;
    spotify?: string;
  };
  description?: string;
  ctaButtons?: {
    primary?: {
      text?: string;
      url?: string;
      enabled?: boolean;
    };
    secondary?: {
      text?: string;
      url?: string;
      enabled?: boolean;
    };
  };
  showScrollIndicator?: boolean;
  showStats?: boolean;
  showSocialLinks?: boolean;
  active?: boolean;
}

// Update your adaptSanityHeroSection function in types/sanity-adapters.ts

export function adaptSanityHeroSection(sanityHero: SanityHeroSection): HeroSectionData {
  // Provide fallback values for required fields
  const defaultDates = {
    start: '2025-12-18',
    end: '2025-12-21'
  };

  const defaultLocation = {
    venue: 'Victoria Island',
    city: 'Lagos',
    country: 'Nigeria'
  };

  return {
    id: sanityHero._id,
    name: sanityHero.name || 'Default Hero',
    festivalName: sanityHero.festivalName || 'SHAKARA FESTIVAL',
    badge: sanityHero.badge,
    dates: {
      start: sanityHero.dates?.start || defaultDates.start,
      end: sanityHero.dates?.end || defaultDates.end,
    },
    location: {
      venue: sanityHero.location?.venue || defaultLocation.venue,
      city: sanityHero.location?.city || defaultLocation.city,
      country: sanityHero.location?.country || defaultLocation.country,
      address: sanityHero.location?.address,
    },
    stats: sanityHero.stats ? {
      artistCount: sanityHero.stats.artistCount || 50,
      expectedAttendance: sanityHero.stats.expectedAttendance || '50K+',
      dayCount: sanityHero.stats.dayCount || 4,
    } : {
      artistCount: 50,
      expectedAttendance: '50K+',
      dayCount: 4,
    },
    heroImage: undefined, // Will be handled separately with urlFor
    logo: sanityHero.logo
      ? {
          url: urlFor(sanityHero.logo).url(),
          alt: sanityHero.logo.alt || "",
        }
      : undefined,
    socialLinks: sanityHero.socialLinks || {},
    description: sanityHero.description,
    ctaButtons: sanityHero.ctaButtons,
    showScrollIndicator: sanityHero.showScrollIndicator ?? true,
    showStats: sanityHero.showStats ?? true,
    showSocialLinks: sanityHero.showSocialLinks ?? false,
    active: sanityHero.active ?? false,
  };
}

export interface SanityPartner {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  logo: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  website?: string;
  tier: 'title' | 'presenting' | 'official' | 'media' | 'supporting';
  category: string;
  description?: string;
  featured: boolean;
  active: boolean;
  order: number;
  logoVariant: 'color' | 'light' | 'dark' | 'mono';
  contactInfo?: {
    email?: string;
    phone?: string;
    contactPerson?: string;
  };
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
  partnershipDetails?: {
    startDate?: string;
    endDate?: string;
    benefits?: string[];
  };
}

export function adaptSanityPartner(sanityPartner: SanityPartner): Partner {
  return {
    id: sanityPartner._id,
    name: sanityPartner.name,
    slug: sanityPartner.slug.current,
    logo: sanityPartner.logo,
    website: sanityPartner.website,
    tier: sanityPartner.tier,
    category: sanityPartner.category,
    description: sanityPartner.description,
    featured: sanityPartner.featured,
    active: sanityPartner.active,
    order: sanityPartner.order,
    logoVariant: sanityPartner.logoVariant
  };
}

export interface SanityAboutSection {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  title: string;
  description: string;
  stats: {
    artistCount?: string;
    dayCount?: string;
    stageCount?: string;
    expectedAttendance?: string;
  };
  highlights: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  essentialInfo: Array<{
    title: string;
    content: string;
  }>;
  socialSection: {
    title?: string;
    showSocialLinks?: boolean;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
      youtube?: string;
      spotify?: string;
      tiktok?: string;
      linkedin?: string;
    };
  };
  active: boolean;
  order: number;
}

export function adaptSanityAboutSection(sanityAbout: SanityAboutSection): AboutSectionData {
  // Provide default values for required fields
  const defaultStats = {
    artistCount: '50+',
    dayCount: '4',
    stageCount: '5',
    expectedAttendance: '50K'
  };

  const defaultHighlights: AboutHighlight[] = [
    {
      icon: 'FaMusic',
      title: 'Music',
      description: 'Afrobeats, Amapiano, Highlife & more'
    },
    {
      icon: 'FaUtensils',
      title: 'Food',
      description: 'Authentic African cuisine'
    },
    {
      icon: 'FaPalette',
      title: 'Art',
      description: 'Cultural installations & workshops'
    },
    {
      icon: 'FaUsers',
      title: 'Community',
      description: 'Connect with music lovers'
    }
  ];

  const defaultEssentialInfo: AboutEssentialInfo[] = [
    {
      title: 'When & Where',
      content: 'December 18-21, 2025\nVictoria Island, Lagos'
    },
    {
      title: 'Experience',
      content: 'Multiple stages featuring both emerging and established artists. Cultural workshops, art installations, and authentic African cuisine throughout the festival grounds.'
    },
    {
      title: 'Tickets',
      content: 'Early bird tickets available now. VIP packages include backstage access, premium viewing areas, and exclusive meet & greet opportunities.'
    }
  ];

  return {
    id: sanityAbout._id,
    name: sanityAbout.name || 'About Section',
    title: sanityAbout.title || 'About Shakara Festival',
    description: sanityAbout.description || "Africa's premier music festival celebrating the vibrant sounds of the continent. Four days of incredible performances, cultural experiences, and community connection under the Lagos skyline.",
    stats: {
      artistCount: sanityAbout.stats?.artistCount || defaultStats.artistCount,
      dayCount: sanityAbout.stats?.dayCount || defaultStats.dayCount,
      stageCount: sanityAbout.stats?.stageCount || defaultStats.stageCount,
      expectedAttendance: sanityAbout.stats?.expectedAttendance || defaultStats.expectedAttendance,
    },
    highlights: sanityAbout.highlights?.length > 0 ? sanityAbout.highlights : defaultHighlights,
    essentialInfo: sanityAbout.essentialInfo?.length > 0 ? sanityAbout.essentialInfo : defaultEssentialInfo,
    socialSection: {
      title: sanityAbout.socialSection?.title || 'Follow Us',
      showSocialLinks: sanityAbout.socialSection?.showSocialLinks ?? true,
      socialLinks: sanityAbout.socialSection?.socialLinks || {}
    },
    active: sanityAbout.active ?? true,
    order: sanityAbout.order || 100
  };
}

export interface SanityLineupSection {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  title: string;
  introText: string;
  stats: {
    artistCount?: string;
    stageCount?: string;
    genreCount?: string;
  };
  ctaSection: {
    text?: string;
    primaryButton?: {
      text?: string;
      url?: string;
      enabled?: boolean;
    };
    secondaryButton?: {
      text?: string;
      url?: string;
      enabled?: boolean;
    };
  };
  emptyState: {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  featuredArtistCount?: number;
  active: boolean;
  order: number;
}

export function adaptSanityLineupSection(sanityLineup: SanityLineupSection): LineupSectionData {
  // Provide default values
  const defaultStats = {
    artistCount: '50+',
    stageCount: '5',
    genreCount: '15'
  };

  const defaultCtaSection = {
    text: "Don't miss these incredible performances!",
    primaryButton: {
      text: 'Get Your Tickets',
      url: '/tickets',
      enabled: true
    },
    secondaryButton: {
      text: 'View Schedule',
      url: '#schedule',
      enabled: true
    }
  };

  const defaultEmptyState = {
    title: 'Lineup Coming Soon',
    description: 'Get ready for an incredible lineup announcement featuring the best of African music!',
    buttonText: 'Get Notified',
    buttonUrl: '/newsletter'
  };

  return {
    id: sanityLineup._id,
    name: sanityLineup.name || 'Lineup Section',
    title: sanityLineup.title || 'Festival Lineup',
    introText: sanityLineup.introText || 'Experience the best of African music with world-class artists across multiple stages and genres.',
    stats: {
      artistCount: sanityLineup.stats?.artistCount || defaultStats.artistCount,
      stageCount: sanityLineup.stats?.stageCount || defaultStats.stageCount,
      genreCount: sanityLineup.stats?.genreCount || defaultStats.genreCount,
    },
    ctaSection: {
      text: sanityLineup.ctaSection?.text || defaultCtaSection.text,
      primaryButton: {
        text: sanityLineup.ctaSection?.primaryButton?.text || defaultCtaSection.primaryButton.text,
        url: sanityLineup.ctaSection?.primaryButton?.url || defaultCtaSection.primaryButton.url,
        enabled: sanityLineup.ctaSection?.primaryButton?.enabled ?? defaultCtaSection.primaryButton.enabled,
      },
      secondaryButton: {
        text: sanityLineup.ctaSection?.secondaryButton?.text || defaultCtaSection.secondaryButton.text,
        url: sanityLineup.ctaSection?.secondaryButton?.url || defaultCtaSection.secondaryButton.url,
        enabled: sanityLineup.ctaSection?.secondaryButton?.enabled ?? defaultCtaSection.secondaryButton.enabled,
      },
    },
    emptyState: {
      title: sanityLineup.emptyState?.title || defaultEmptyState.title,
      description: sanityLineup.emptyState?.description || defaultEmptyState.description,
      buttonText: sanityLineup.emptyState?.buttonText || defaultEmptyState.buttonText,
      buttonUrl: sanityLineup.emptyState?.buttonUrl || defaultEmptyState.buttonUrl,
    },
    featuredArtistCount: sanityLineup.featuredArtistCount || 8,
    active: sanityLineup.active ?? true,
    order: sanityLineup.order || 100
  };
}

// Footer Sanity Types
export interface SanityFooterSection {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  brandSection: {
    festivalName: string;
    tagline: string;
    location: string;
  };
  quickLinks: Array<{
    label: string;
    href: string;
  }>;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    spotify?: string;
    tiktok?: string;
    linkedin?: string;
  };
  legalLinks: Array<{
    label: string;
    href: string;
  }>;
  copyright: string;
  active: boolean;
  order: number;
}

// Footer adapter function
export function adaptSanityFooterSection(sanityFooter: SanityFooterSection): FooterSectionData {
  // Default fallback data
  const defaultBrandSection: FooterBrandSection = {
    festivalName: 'SHAKARA FESTIVAL',
    tagline: "Africa's premier music festival",
    location: 'Victoria Island, Lagos • December 2025'
  };

  const defaultQuickLinks: FooterLink[] = [
    { label: 'About', href: '#about' },
    { label: 'Lineup', href: '#lineup' },
    { label: 'Tickets', href: '#tickets' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Partners', href: '#partners' }
  ];

  const defaultSocialLinks: FooterSocialLinks = {
    instagram: 'https://instagram.com/shakarafestival',
    twitter: 'https://twitter.com/shakarafestival',
    facebook: 'https://facebook.com/shakarafestival',
    youtube: 'https://youtube.com/@shakarafestival'
  };

  const defaultLegalLinks: FooterLink[] = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' }
  ];

  return {
    id: sanityFooter._id,
    name: sanityFooter.name || 'Footer Section',
    slug: sanityFooter.slug?.current || 'footer-section',
    brandSection: {
      festivalName: sanityFooter.brandSection?.festivalName || defaultBrandSection.festivalName,
      tagline: sanityFooter.brandSection?.tagline || defaultBrandSection.tagline,
      location: sanityFooter.brandSection?.location || defaultBrandSection.location
    },
    quickLinks: sanityFooter.quickLinks && sanityFooter.quickLinks.length > 0 
      ? sanityFooter.quickLinks 
      : defaultQuickLinks,
    socialLinks: {
      instagram: sanityFooter.socialLinks?.instagram || defaultSocialLinks.instagram,
      twitter: sanityFooter.socialLinks?.twitter || defaultSocialLinks.twitter,
      facebook: sanityFooter.socialLinks?.facebook || defaultSocialLinks.facebook,
      youtube: sanityFooter.socialLinks?.youtube || defaultSocialLinks.youtube,
      spotify: sanityFooter.socialLinks?.spotify || defaultSocialLinks.spotify,
      tiktok: sanityFooter.socialLinks?.tiktok || defaultSocialLinks.tiktok,
      linkedin: sanityFooter.socialLinks?.linkedin || defaultSocialLinks.linkedin
    },
    legalLinks: sanityFooter.legalLinks && sanityFooter.legalLinks.length > 0 
      ? sanityFooter.legalLinks 
      : defaultLegalLinks,
    copyright: sanityFooter.copyright || 'Shakara Festival. All rights reserved.',
    active: sanityFooter.active ?? true,
    order: sanityFooter.order || 100
  };
}