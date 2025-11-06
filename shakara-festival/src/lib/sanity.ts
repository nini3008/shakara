import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false, // always bypass cache in dev
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

// Write-enabled client (requires SANITY_WRITE_TOKEN); falls back to read client
export const writeClient = process.env.SANITY_WRITE_TOKEN
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      useCdn: false,
      apiVersion: '2023-05-03',
      token: process.env.SANITY_WRITE_TOKEN,
      perspective: 'published',
    })
  : client

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
  sku,
  price,
  originalPrice,
  testPrice,
  currency,
  features,
  available,
  duration,
  type,
  day,
  isBundle,
  bundle {
    dayCount,
    targetSku,
  },
  category,
  packageType,
  discount,
  maxQuantity,
  soldOut,
  inventory,
  sold,
  reserved,
  allowOversell,
  saleStartDate,
  saleEndDate,
  featured,
  badge,
  order,
  live,
  taxInclusive,
  feesIncluded,
  fwProductId,
  fwPaymentLink,
  lastSyncedNote
}`

export const FEATURED_TICKETS_QUERY = `*[_type == "ticket" && featured == true] | order(order asc, price asc) {
  _id,
  name,
  slug,
  description,
  sku,
  price,
  originalPrice,
  testPrice,
  currency,
  features,
  available,
  duration,
  type,
  day,
  isBundle,
  bundle {
    dayCount,
    targetSku,
  },
  category,
  packageType,
  discount,
  badge,
  live,
  taxInclusive,
  feesIncluded,
  fwProductId,
  fwPaymentLink
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

export const VENDORS_QUERY = `*[_type == "vendor" && active == true] | order(featured desc, order asc, name asc) {
  _id,
  name,
  slug,
  logo,
  coverImage,
  category,
  description,
  highlights,
  location,
  website,
  socialLinks,
  contactInfo,
  featured,
  active,
  acceptsPayments,
  order,
  tags,
  priceRange,
  gallery
}`;

export const FEATURED_VENDORS_QUERY = `*[_type == "vendor" && featured == true && active == true] | order(order asc, name asc) {
  _id,
  name,
  slug,
  logo,
  coverImage,
  category,
  description,
  highlights,
  location,
  website,
  featured,
  acceptsPayments,
  priceRange
}`;

export const VENDORS_BY_CATEGORY_QUERY = `*[_type == "vendor" && active == true && category == $category] | order(order asc, name asc) {
  _id,
  name,
  slug,
  logo,
  coverImage,
  category,
  description,
  highlights,
  location,
  website,
  featured,
  acceptsPayments,
  priceRange
}`;

export const ALL_VENDORS_QUERY = `*[_type == "vendor"] | order(active desc, featured desc, order asc, name asc) {
  _id,
  name,
  slug,
  logo,
  coverImage,
  category,
  description,
  highlights,
  location,
  website,
  socialLinks,
  contactInfo,
  featured,
  active,
  acceptsPayments,
  order,
  tags,
  priceRange,
  gallery
}`;

const BLOG_POST_PROJECTION = `
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  excerpt,
  featured,
  status,
  publishedAt,
  featuredImage {
    ...,
    alt,
    caption,
    asset,
    "assetMeta": asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        },
        lqip
      }
    }
  },
  content[] {
    ...,
    _type == "image" => {
      ...,
      alt,
      caption,
      isFullWidth,
      asset,
      "assetMeta": asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          },
          lqip
        }
      }
    }
  },
  author-> {
    _id,
    name,
    "slug": slug.current,
    bio,
    active,
    socialLinks,
    profileImage {
      alt,
      asset,
      "assetMeta": asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          },
          lqip
        }
      }
    }
  },
  seo {
    seoTitle,
    seoDescription
  }
`;

const PUBLISHED_STATUS_FILTER = 'coalesce(lower(status), "draft") == "published"'

export const BLOG_POSTS_QUERY = `*[_type == "blogPost" && ${PUBLISHED_STATUS_FILTER}] | order(publishedAt desc) {
  ${BLOG_POST_PROJECTION}
}`;

export const FEATURED_BLOG_POST_QUERY = `*[_type == "blogPost" && ${PUBLISHED_STATUS_FILTER} && featured == true] | order(publishedAt desc)[0] {
  ${BLOG_POST_PROJECTION}
}`;

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug && ${PUBLISHED_STATUS_FILTER}][0] {
  ${BLOG_POST_PROJECTION}
}`;

export const BLOG_AUTHORS_QUERY = `*[_type == "blogAuthor" && active == true] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  bio,
  active,
  socialLinks,
  profileImage {
    alt,
    asset,
    "assetMeta": asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        },
        lqip
      }
    }
  }
}`;