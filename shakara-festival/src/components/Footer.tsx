// components/Footer.tsx - Minimal footer component

import Link from 'next/link';
import styles from './Footer.module.scss';

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

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // You can later move this to CMS if needed
  const socialLinks = {
    instagram: 'https://instagram.com/shakarafestival',
    twitter: 'https://twitter.com/shakarafestival',
    facebook: 'https://facebook.com/shakarafestival',
    youtube: 'https://youtube.com/@shakarafestival',
  };

  const quickLinks = [
    { label: 'About', href: '#about' },
    { label: 'Lineup', href: '#lineup' },
    { label: 'Tickets', href: '#tickets' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Partners', href: '#partners' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main footer content */}
        <div className={styles.footerContent}>
          {/* Brand section */}
          <div className={styles.brandSection}>
            <h3 className={styles.brandName}>SHAKARA FESTIVAL</h3>
            <p className={styles.brandTagline}>
              {"Africa's premier music festival"}
            </p>
            <p className={styles.location}>
              Victoria Island, Lagos • December 2025
            </p>
          </div>

          {/* Quick links */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <nav className={styles.quickLinks}>
              {quickLinks.map((link) => (
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
              {Object.entries(socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
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
            <p>&copy; {currentYear} Shakara Festival. All rights reserved.</p>
          </div>
          
          <div className={styles.legalLinks}>
            <Link href="/" className={styles.legalLink}>
              Privacy Policy
            </Link>
            <Link href="/" className={styles.legalLink}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}