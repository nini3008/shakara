// components/sections/AboutSection.tsx - Following the same pattern as other CMS sections

import { client, ABOUT_SECTION_QUERY } from '@/lib/sanity';
import { adaptSanityAboutSection } from '@/types/sanity-adapters';
import { festivalInfo } from '@/data/mockData'; // Keep as fallback
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

export default async function AboutSection() {
  // Fetch about section data directly, same pattern as other sections
  const aboutSectionData = await client.fetch(ABOUT_SECTION_QUERY);
  
  // Use CMS data if available, otherwise fall back to mock data
  const sectionData = aboutSectionData ? adaptSanityAboutSection(aboutSectionData) : {
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
        icon: '🎵',
        title: 'Music',
        description: 'Afrobeats, Amapiano, Highlife & more'
      },
      {
        icon: '🍽️',
        title: 'Food',
        description: 'Authentic African cuisine'
      },
      {
        icon: '🎨',
        title: 'Art',
        description: 'Cultural installations & workshops'
      },
      {
        icon: '👥',
        title: 'Community',
        description: 'Connect with music lovers'
      }
    ],
    essentialInfo: [
      {
        title: 'When & Where',
        content: `${new Date(festivalInfo.dates.start).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric' 
        })} – ${new Date(festivalInfo.dates.end).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        })}\n${festivalInfo.location.venue}, ${festivalInfo.location.city}`
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
      socialLinks: festivalInfo.socialLinks
    }
  };
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
                  <span className={styles.highlightIcon}>{highlight.icon}</span>
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

// Example usage in your page component:
/*
import { client } from '@/sanity/client';
import { ABOUT_SECTION_QUERY } from '@/sanity/client';
import { adaptSanityAboutSection } from '@/types/sanity-adapters';
import AboutSection from '@/components/sections/AboutSection';

export async function getStaticProps() {
  const aboutSectionData = await client.fetch(ABOUT_SECTION_QUERY);
  
  return {
    props: {
      aboutData: aboutSectionData ? adaptSanityAboutSection(aboutSectionData) : null,
    },
    revalidate: 60, // Revalidate every minute
  };
}

// In your page component:
export default function HomePage({ aboutData }: { aboutData: AboutSectionData | null }) {
  if (!aboutData) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <AboutSection aboutData={aboutData} />
    </main>
  );
}
*/