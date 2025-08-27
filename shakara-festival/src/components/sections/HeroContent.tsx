// components/sections/HeroContent.tsx
'use client'

import { motion } from 'framer-motion'
import styles from './HeroSection.module.scss'
import { HeroSectionData } from '@/types'

interface HeroContentProps {
  data: HeroSectionData;
}

export default function HeroContent({ data }: HeroContentProps) {

  // Format dates for display - FIXED timezone issue
  const formatDateRange = (start: string, end: string) => {
    
    // Parse dates as local dates to avoid timezone issues
    const [startYear, startMonth, startDay] = start.split('-').map(Number);
    const [endYear, endMonth, endDay] = end.split('-').map(Number);
    
    const startDate = new Date(startYear, startMonth - 1, startDay); // Month is 0-indexed
    const endDate = new Date(endYear, endMonth - 1, endDay);
    
    
    const startMonthName = startDate.toLocaleDateString('en-US', { month: 'long' });
    const startDayNum = startDate.getDate();
    const endDayNum = endDate.getDate();
    const year = startDate.getFullYear();
    
    const result = `${startMonthName} ${startDayNum} – ${endDayNum}, ${year}`;
    
    return result;
  };

  // Extract location parts
  const locationParts = [
    data.location?.venue,
    data.location?.city
  ].filter(Boolean);

  // DEBUG: Check if dates exist before formatting
  const formattedDate = data?.dates?.start && data?.dates?.end 
    ? formatDateRange(data.dates.start, data.dates.end)
    : 'No dates available';

  return (
    <div className={styles.content}>
      <div className="flex flex-col items-center space-y-4">
        
        {/* Badge - Now from CMS */}
        {data.badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.badge}>
              {data.badge}
            </div>
          </motion.div>
        )}

        {/* Main Title - Now from CMS with smart splitting */}
        <motion.div
          className={styles.titleContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {data.logo?.url ? (
                <img
                src={data.logo.url}
                alt={data.logo.alt || data.festivalName || 'Festival Logo'}
                className={styles.logo}
                />
            ) : data.festivalName?.split(' ').length > 1 ? (
                <>
                <h1 className={styles.mainTitle}>
                    {data.festivalName.split(' ')[0]}
                </h1>
                <h2 className={styles.subtitle}>
                    {data.festivalName.split(' ').slice(1).join(' ')}
                </h2>
                </>
            ) : (
                <h1 className={styles.mainTitle}>
                {data.festivalName}
                </h1>
        )}
        </motion.div>

        {/* Date & Location - Now from CMS */}
        <motion.div
          className={styles.locationContainer}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className={styles.date}>
            {formattedDate}
          </p>
          <p className={styles.location}>
            {locationParts.join(', ')} • {data.location?.country || 'Nigeria'}
          </p>
          
        </motion.div>

        {/* CTA Buttons - From CMS */}
        {(data.ctaButtons?.primary?.enabled || data.ctaButtons?.secondary?.enabled) && (
          <motion.div
            className="flex gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {data.ctaButtons.primary?.enabled && data.ctaButtons.primary.text && (
              <a
                href={data.ctaButtons.primary.url}
                target={data.ctaButtons.primary.url?.startsWith('http') ? '_blank' : undefined}
                rel={data.ctaButtons.primary.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center rounded-md bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
              >
                {data.ctaButtons.primary.text}
              </a>
            )}
            
            {data.ctaButtons.secondary?.enabled && data.ctaButtons.secondary.text && (
              <a
                href={data.ctaButtons.secondary.url}
                target={data.ctaButtons.secondary.url?.startsWith('http') ? '_blank' : undefined}
                rel={data.ctaButtons.secondary.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center rounded-md border border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
              >
                {data.ctaButtons.secondary.text}
              </a>
            )}
          </motion.div>
        )}

        {/* Social Links - From CMS */}
        {data.showSocialLinks && data.socialLinks && Object.values(data.socialLinks).some(link => link) && (
          <motion.div
            className="flex gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {data.socialLinks.instagram && (
              <a 
                href={data.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            
            {data.socialLinks.twitter && (
              <a 
                href={data.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Follow us on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}

            {data.socialLinks.tiktok && (
              <a 
                href={data.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Follow us on TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            )}

            {data.socialLinks.youtube && (
              <a 
                href={data.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Follow us on YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}

            {data.socialLinks.spotify && (
              <a 
                href={data.socialLinks.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Follow us on Spotify"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
            )}
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator - Controlled by CMS */}
      {data.showScrollIndicator && (
        <motion.div
          className={styles.scrollIndicator}
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className={styles.scrollDot}>
            <div className={styles.scrollInner} />
          </div>
        </motion.div>
      )}
    </div>
  );
}