// lib/cms-utils.ts

import { client, urlFor } from './sanity';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Generic function to fetch data from Sanity with error handling
 */
export async function fetchFromSanity<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T[] = []
): Promise<T[]> {
  try {
    const data = await client.fetch(query, params);
    return data || fallback;
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
    return fallback;
  }
}

/**
 * Check if Sanity is properly configured
 */
export function isSanityConfigured(): boolean {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    console.warn('Sanity environment variables not configured properly');
    return false;
  }

  return true;
}

/**
 * Get a fallback image URL when Sanity images fail
 */
export function getFallbackImageUrl(width = 400, height = 400): string {
  return `https://via.placeholder.com/${width}x${height}/1a1a1a/fbbf24?text=Shakara+Festival`;
}

/**
 * Safe image URL builder with fallback
 */
export function safeImageUrl(
  imageSource: SanityImageSource | null | undefined,
  width = 400,
  height = 400
): string {
  try {
    if (!imageSource) return getFallbackImageUrl(width, height);
    return urlFor(imageSource).width(width).height(height).url();
  } catch {
    return getFallbackImageUrl(width, height);
  }
}

/**
 * Format currency with proper Nigerian Naira symbol
 */
export function formatCurrency(amount: number, currency = '₦'): string {
  return `${currency}${amount.toLocaleString()}`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Format time for display
 */
export function formatTime(timeString: string): string {
  try {
    // Handle various time formats
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }

    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return timeString;
  }
}

/**
 * Get stage display name
 */
export function getStageDisplayName(stage?: string): string {
  if (!stage) return '';

  const stageMap: Record<string, string> = {
    main: 'Main Stage',
    secondary: 'Secondary Stage',
    club: 'Club Stage',
    acoustic: 'Acoustic Stage'
  };

  return stageMap[stage.toLowerCase()] || stage;
}

/**
 * Get day display name
 */
export function getDayDisplayName(day?: number): string {
  if (!day) return '';
  return `Day ${day}`;
}

/**
 * Generate SEO metadata for Sanity content
 */
export function generateSEOMetadata(
  title: string,
  description?: string,
  image?: string
) {
  const metaDescription =
    description ||
    'Shakara Festival - 4 Days Celebrating the Best Music of African Origin';

  return {
    title: `${title} | Shakara Festival`,
    description: metaDescription,
    openGraph: {
      title: `${title} | Shakara Festival`,
      description: metaDescription,
      images: image ? [{ url: image }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Shakara Festival`,
      description: metaDescription,
      images: image ? [image] : []
    }
  };
}
