import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
})

const builder = imageUrlBuilder(client)

export const urlFor = (source: SanityImageSource) => builder.image(source)

// Helper function to get file URLs from Sanity
export const getFileUrl = (fileRef: string) => {
  // File refs are in format: file-<hash>-<extension>
  // We need to extract the hash and extension
  const parts = fileRef.split('-')
  if (parts.length < 3) return null
  
  const hash = parts[1]
  const extension = parts[2]
  
  return `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${hash}.${extension}`
}

// GROQ queries
export const ARTIST_QUERY = `*[_type == "artist"] | order(featured desc, name asc) {
  _id,
  name,
  slug,
  image,
  genre,
  bio,
  socialLinks,
  performanceDay,
  performanceTime,
  stage,
  featured
}`

export const FEATURED_ARTISTS_QUERY = `*[_type == "artist" && featured == true] | order(name asc) {
  _id,
  name,
  slug,
  image,
  genre,
  bio,
  socialLinks,
  performanceDay,
  performanceTime,
  stage
}`

export const TICKETS_QUERY = `*[_type == "ticket"] | order(order asc, price asc) {
  _id,
  name,
  slug,
  description,
  price,
  originalPrice,
  currency,
  features,
  available,
  duration,
  type,
  discount,
  maxQuantity,
  soldOut,
  saleStartDate,
  saleEndDate,
  featured,
  badge,
  order
}`

export const FEATURED_TICKETS_QUERY = `*[_type == "ticket" && featured == true] | order(order asc, price asc) {
  _id,
  name,
  slug,
  description,
  price,
  originalPrice,
  currency,
  features,
  available,
  duration,
  type,
  discount,
  badge
}`

export const SCHEDULE_QUERY = `*[_type == "scheduleEvent"] | order(day asc, time asc) {
  _id,
  title,
  slug,
  description,
  time,
  endTime,
  day,
  type,
  artist->{
    name,
    slug,
    image,
    genre
  },
  stage,
  featured,
  ticketRequired,
  capacity,
  image
}`

export const SCHEDULE_BY_DAY_QUERY = `*[_type == "scheduleEvent" && day == $day] | order(time asc) {
  _id,
  title,
  slug,
  description,
  time,
  endTime,
  day,
  type,
  artist->{
    name,
    slug,
    image,
    genre
  },
  stage,
  featured,
  ticketRequired,
  capacity,
  image
}`

export const MERCH_QUERY = `*[_type == "merchItem"] | order(category asc, name asc) {
  _id,
  name,
  slug,
  description,
  price,
  compareAtPrice,
  images,
  category,
  available,
  preOrder,
  sizes,
  colors,
  material,
  featured,
  newArrival,
  limitedEdition,
  inventory,
  tags
}`

export const FEATURED_MERCH_QUERY = `*[_type == "merchItem" && featured == true] | order(name asc) {
  _id,
  name,
  slug,
  description,
  price,
  compareAtPrice,
  images,
  category,
  available,
  preOrder,
  sizes,
  colors
}`


export const HERO_SECTION_QUERY = `
  *[_type == "heroSection" && active == true][0] {
    _id,
    name,
    festivalName,
    logo,
    badge,
    dates,
    location,
    stats,
    heroVideo,
    heroImage,
    socialLinks,
    description,
    ctaButtons,
    showScrollIndicator,
    showStats,
    showSocialLinks,
    active
  }
`;

export const PARTNERS_QUERY = `*[_type == "partner" && active == true] | order(order asc, tier asc, name asc) {
  _id,
  name,
  slug,
  logo,
  website,
  tier,
  category,
  description,
  featured,
  active,
  order,
  logoVariant,
  contactInfo,
  socialLinks,
  partnershipDetails
}`;

export const FEATURED_PARTNERS_QUERY = `*[_type == "partner" && featured == true && active == true] | order(order asc, tier asc, name asc) {
  _id,
  name,
  slug,
  logo,
  website,
  tier,
  category,
  description,
  featured,
  active,
  order,
  logoVariant
}`;

export const PARTNERS_BY_TIER_QUERY = `*[_type == "partner" && active == true && tier == $tier] | order(order asc, name asc) {
  _id,
  name,
  slug,
  logo,
  website,
  tier,
  category,
  description,
  featured,
  active,
  order,
  logoVariant
}`;

export const ALL_PARTNERS_QUERY = `*[_type == "partner"] | order(active desc, order asc, tier asc, name asc) {
  _id,
  name,
  slug,
  logo,
  website,
  tier,
  category,
  description,
  featured,
  active,
  order,
  logoVariant,
  contactInfo,
  socialLinks,
  partnershipDetails
}`;


export const ABOUT_SECTION_QUERY = `
  *[_type == "aboutSection" && active == true][0] {
    _id,
    name,
    slug,
    title,
    description,
    stats,
    highlights,
    essentialInfo,
    socialSection {
      title,
      showSocialLinks,
      socialLinks {
        instagram,
        twitter,
        facebook,
        youtube,
        spotify,
        tiktok,
        linkedin
      }
    },
    active,
    order
  }
`;

export const ALL_ABOUT_SECTIONS_QUERY = `
  *[_type == "aboutSection"] | order(active desc, order asc, name asc) {
    _id,
    name,
    slug,
    title,
    description,
    stats,
    highlights,
    essentialInfo,
    socialSection {
      title,
      showSocialLinks,
      socialLinks {
        instagram,
        twitter,
        facebook,
        youtube,
        spotify,
        tiktok,
        linkedin
      }
    },
    active,
    order
  }
`;

export const LINEUP_SECTION_QUERY = `
  *[_type == "lineupSection" && active == true][0] {
    _id,
    name,
    slug,
    title,
    introText,
    stats,
    ctaSection,
    emptyState,
    featuredArtistCount,
    active,
    order
  }
`;

export const FOOTER_SECTION_QUERY = `
  *[_type == "footerSection" && active == true][0] {
    _id,
    name,
    slug,
    brandSection {
      festivalName,
      tagline,
      location
    },
    quickLinks[] {
      label,
      href
    },
    socialLinks {
      instagram,
      twitter,
      facebook,
      youtube,
      spotify,
      tiktok,
      linkedin
    },
    legalLinks[] {
      label,
      href
    },
    copyright,
    active,
    order
  }
`;

export const ALL_FOOTER_SECTIONS_QUERY = `
  *[_type == "footerSection"] | order(active desc, order asc, name asc) {
    _id,
    name,
    slug,
    brandSection {
      festivalName,
      tagline,
      location
    },
    quickLinks[] {
      label,
      href
    },
    socialLinks {
      instagram,
      twitter,
      facebook,
      youtube,
      spotify,
      tiktok,
      linkedin
    },
    legalLinks[] {
      label,
      href
    },
    copyright,
    active,
    order
  }
`;

export const FAQ_QUERY = `*[_type == "faq" && active == true] | order(category asc, order asc) {
  _id,
  category,
  question,
  answer,
  order
}`;