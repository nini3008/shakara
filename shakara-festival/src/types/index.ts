import { ReactNode } from "react";

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image?: string;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
  };
  day?: number;
  time?: string;
  stage?: string;
}

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  features: string[];
  available: boolean;
  duration: '1-day' | '2-day' | '3-day' | '4-day';
  type: 'general' | 'pit' | 'vip' | 'vvip' | 'family';
  discount?: number;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  time: string;
  day: number;
  type: 'music' | 'panel' | 'vendors' | 'afterparty';
  artist?: Artist;
  stage?: string;
}

export interface MerchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: 'apparel' | 'headwear' | 'accessories' | 'gear';
  available: boolean;
  sizes?: string[];
  colors?: string[];
}

export interface Sponsor {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  tier: 'title' | 'presenting' | 'official' | 'partner';
}

export interface FestivalInfo {
  name: string;
  dates: {
    start: string;
    end: string;
  };
  location: {
    country: ReactNode;
    venue: string;
    city: string;
    address: string;
  };
  description: string;
  heroImage?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
}

// Hero Section Types
export interface HeroSectionData {
  id: string;
  name: string;
  festivalName: string;
   
    logo?: {
      url: string;
      alt?: string;
      variant?: 'color' | 'light' | 'dark' | 'mono';
    };
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
  heroImage?: string;
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

// Utility types for better type safety
export type SocialPlatform = 'instagram' | 'twitter' | 'tiktok' | 'youtube' | 'facebook' | 'spotify';
export type HeroSectionSocialLinks = Partial<Record<SocialPlatform, string>>;

// Helper type for components that need both festival info and hero data
export interface PageData {
  heroSection?: HeroSectionData;
  artists?: Artist[];
  tickets?: TicketType[];
  schedule?: ScheduleEvent[];
  merchandise?: MerchItem[];
  sponsors?: Sponsor[];
}

// types/index.ts - Add these to your existing types file

export interface Partner {
  id: string;
  name: string;
  slug: string;
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
}

// Add these to your types/index.ts file

export interface AboutHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface AboutEssentialInfo {
  title: string;
  content: string;
}

export interface AboutSocialSection {
  title: string;
  showSocialLinks: boolean;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    spotify?: string;
    tiktok?: string;
    linkedin?: string;
  };
}

export interface AboutSectionData {
  id: string;
  name: string;
  title: string;
  description: string;
  stats: {
    artistCount: string;
    dayCount: string;
    stageCount: string;
    expectedAttendance: string;
  };
  highlights: AboutHighlight[];
  essentialInfo: AboutEssentialInfo[];
  socialSection: AboutSocialSection;
  active: boolean;
  order: number;
}

export interface LineupSectionData {
  id: string;
  name: string;
  title: string;
  introText: string;
  stats: {
    artistCount: string;
    stageCount: string;
    genreCount: string;
  };
  ctaSection: {
    text: string;
    primaryButton: {
      text: string;
      url: string;
      enabled: boolean;
    };
    secondaryButton: {
      text: string;
      url: string;
      enabled: boolean;
    };
  };
  emptyState: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
  featuredArtistCount: number;
  active: boolean;
  order: number;
}

// Footer Types
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterBrandSection {
  festivalName: string;
  tagline: string;
  location: string;
}

export interface FooterSocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  spotify?: string;
  tiktok?: string;
  linkedin?: string;
}

export interface FooterSectionData {
  id: string;
  name: string;
  slug: string;
  brandSection: FooterBrandSection;
  quickLinks: FooterLink[];
  socialLinks: FooterSocialLinks;
  legalLinks: FooterLink[];
  copyright: string;
  active: boolean;
  order: number;
}
