// components/Footer.tsx - CMS-powered footer component

import Link from 'next/link';
import styles from './Footer.module.scss';
import { client, FOOTER_SECTION_QUERY } from '@/lib/sanity';
import { FooterSectionData } from '@/types';
import { SanityFooterSection, adaptSanityFooterSection } from '@/types/sanity-adapters';

// Helper function to get platform display names
const getPlatformDisplayName = (platform: string) => {
  const displayNames: Record<string, string> = {
    instagram: 'Instagram',
    twitter: 'Twitter',
    facebook: 'Facebook',
    youtube: 'YouTube',
    spotify: 'Spotify',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
  };
  
  return displayNames[platform.toLowerCase()] || platform;
};

async function getFooterData(): Promise<{ footerData: FooterSectionData | null, sanityData: SanityFooterSection | null }> {
  try {
    const sanityData: SanityFooterSection = await client.fetch(FOOTER_SECTION_QUERY);
    if (!sanityData) {
      console.log('No footer section found in Sanity. Using fallback data.');
      return { footerData: null, sanityData: null };
    }
    const footerData = adaptSanityFooterSection(sanityData);
    return { footerData, sanityData };
  } catch (error) {
    console.error('Error fetching footer section:', error);
    return { footerData: null, sanityData: null };
  }
}

export default async function Footer() {
  const { footerData } = await getFooterData();
  const currentYear = new Date().getFullYear();
  
  // Default/fallback data if no CMS data is provided
  const defaultData: FooterSectionData = {
    id: 'default',
    name: 'Default Footer',
    slug: 'default-footer',
    brandSection: {
      festivalName: 'SHAKARA FESTIVAL',
      tagline: "Africa's premier music festival",
      location: 'Victoria Island, Lagos • December 2025'
    },
    quickLinks: [
      { label: 'About', href: '#about' },
      { label: 'Lineup', href: '#lineup' },
      { label: 'Tickets', href: '#tickets' },
      { label: 'Schedule', href: '#schedule' },
      { label: 'Blog', href: '/blog' },
      { label: 'Partners', href: '#partners' }
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/theshakarafest/',
      twitter: 'https://x.com/theshakarafest/',
      facebook: 'https://www.instagram.com/theshakarafest/',
      youtube: 'https://www.youtube.com/@theshakarafest'
    },
    legalLinks: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' }
    ],
    copyright: 'Shakara Festival. All rights reserved.',
    active: true,
    order: 1
  };

  // Use CMS data if available, otherwise use defaults
  const data = footerData || defaultData;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main footer content */}
        <div className={styles.footerContent}>
          {/* Brand section */}
          <div className={styles.brandSection}>
            <h3 className={styles.brandName}>{data.brandSection.festivalName}</h3>
            <p className={styles.brandTagline}>
              {data.brandSection.tagline}
            </p>
            <p className={styles.location}>
              {data.brandSection.location}
            </p>
          </div>

          {/* Quick links */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <nav className={styles.quickLinks}>
              {data.quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.footerLink}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social links */}
          <div className={styles.socialSection}>
            <h4 className={styles.sectionTitle}>Follow Us</h4>
            <div className={styles.socialLinks}>
              {Object.entries(data.socialLinks)
                .filter(([, url]) => url) // Only show platforms with URLs
                .map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={`Follow us on ${getPlatformDisplayName(platform)}`}
                  >
                    {getPlatformDisplayName(platform)}
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>&copy; {currentYear} {data.copyright}</p>
          </div>
          
          {/* <div className={styles.legalLinks}>
            {data.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.legalLink}
              >
                {link.label}
              </Link>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}