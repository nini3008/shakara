// components/sections/AboutSection.tsx - Following the same pattern as other CMS sections

import { client, ABOUT_SECTION_QUERY } from '@/lib/sanity';
import { AboutSectionData } from '@/types';
import { SanityAboutSection, adaptSanityAboutSection } from '@/types/sanity-adapters';
import DynamicIcon from '@/components/DynamicIcon';
import styles from './AboutSection.module.scss';

// Helper function to get platform-specific styling
const getSocialPlatformClass = (platform: string) => {
  const platformClasses: Record<string, string> = {
    instagram: styles.socialInstagram,
    twitter: styles.socialTwitter,
    facebook: styles.socialFacebook,
    youtube: styles.socialYoutube,
    spotify: styles.socialSpotify,
    tiktok: styles.socialTiktok,
    linkedin: styles.socialLinkedin,
  };
  
  return platformClasses[platform.toLowerCase()] || styles.socialDefault;
};

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

async function getAboutSectionData(): Promise<{ aboutData: AboutSectionData | null, sanityData: SanityAboutSection | null }> {
  try {
    const sanityData: SanityAboutSection = await client.fetch(ABOUT_SECTION_QUERY);
    if (!sanityData) {
      console.log('No about section found in Sanity. Using fallback data.');
      return { aboutData: null, sanityData: null };
    }
    const aboutData = adaptSanityAboutSection(sanityData);
    return { aboutData, sanityData };
  } catch (error) {
    console.error('Error fetching about section:', error);
    return { aboutData: null, sanityData: null };
  }
}

export default async function AboutSection() {
  const { aboutData } = await getAboutSectionData();
  
  // Default/fallback data if no CMS data is provided
  const defaultData: AboutSectionData = {
    id: 'default',
    name: 'Default About Section',
    title: 'About Shakara Festival',
    description: "Africa's premier music festival celebrating the vibrant sounds of the continent. Four days of incredible performances, cultural experiences, and community connection under the Lagos skyline.",
    stats: {
      artistCount: '50+',
      dayCount: '4',
      stageCount: '5',
      expectedAttendance: '50K'
    },
    highlights: [
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
    ],
    essentialInfo: [
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
    ],
    socialSection: {
      title: 'Follow Us',
      showSocialLinks: true,
      socialLinks: {
        instagram: 'https://instagram.com/shakarafestival',
        twitter: 'https://twitter.com/shakarafestival',
        facebook: 'https://facebook.com/shakarafestival',
        youtube: 'https://youtube.com/@shakarafestival'
      }
    },
    active: true,
    order: 1
  };

  // Use CMS data if available, otherwise use defaults
  const sectionData = aboutData || defaultData;
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {sectionData.title}
        </h2>
        
        <div className={styles.contentLayout}>
          {/* Left side - Visual elements and stats */}
          <div className={styles.visualSection}>
            {/* Festival stats - dynamic from CMS */}
            <div className={styles.heroStats}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{sectionData.stats.artistCount}</div>
                <div className={styles.statLabel}>Artists</div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{sectionData.stats.dayCount}</div>
                <div className={styles.statLabel}>Days</div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{sectionData.stats.stageCount}</div>
                <div className={styles.statLabel}>Stages</div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{sectionData.stats.expectedAttendance}</div>
                <div className={styles.statLabel}>Expected</div>
              </div>
            </div>
            
            {/* Festival highlights - dynamic from CMS */}
            <div className={styles.highlights}>
              {sectionData.highlights.map((highlight, index) => (
                <div key={index} className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>
                    <DynamicIcon iconName={highlight.icon} size={32} />
                  </div>
                  <h4 className={styles.highlightTitle}>{highlight.title}</h4>
                  <p className={styles.highlightText}>{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - Essential info and social */}
          <div className={styles.infoSection}>
            {/* Dynamic description from CMS */}
            <p className={styles.description}>
              {sectionData.description}
            </p>
            
            {/* Essential festival info - dynamic from CMS */}
            <div className={styles.essentialInfo}>
              {sectionData.essentialInfo.map((info, index) => (
                <div key={index} className={styles.infoItem}>
                  <h4 className={styles.infoTitle}>{info.title}</h4>
                  <p className={styles.infoText}>
                    {info.content.split('\n').map((line, lineIndex) => (
                      <span key={lineIndex}>
                        {line}
                        {lineIndex < info.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Enhanced social section with CMS data */}
            {sectionData.socialSection.showSocialLinks && (
              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>{sectionData.socialSection.title}</h3>
                <div className={styles.socialLinks}>
                  {Object.entries(sectionData.socialSection.socialLinks)
                    .filter(([_, url]) => url) // Only show platforms with URLs
                    .map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.socialLink} ${getSocialPlatformClass(platform)}`}
                        aria-label={`Follow us on ${getPlatformDisplayName(platform)}`}
                      >
                        {getPlatformDisplayName(platform)}
                      </a>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}