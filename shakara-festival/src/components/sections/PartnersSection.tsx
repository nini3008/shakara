// components/sections/PartnersSection.tsx - Following AboutSection Pattern

import { client, FEATURED_PARTNERS_QUERY, urlFor } from '@/lib/sanity';
import { Partner } from '@/types';
import { SanityPartner, adaptSanityPartner } from '@/types/sanity-adapters';
import Image from 'next/image';
import EmailButton from '@/components/EmailButton';
import styles from './PartnersSection.module.scss';

async function getPartners(): Promise<{ partners: Partner[], sanityPartners: SanityPartner[] }> {
  try {
    const sanityPartners: SanityPartner[] = await client.fetch(FEATURED_PARTNERS_QUERY);
    const partners = sanityPartners.map(adaptSanityPartner);
    return { partners, sanityPartners };
  } catch (error) {
    console.error('Error fetching partners:', error);
    return { partners: [], sanityPartners: [] };
  }
}

// Helper function to group partners by tier
const groupPartnersByTier = (partners: Partner[], sanityPartners: SanityPartner[]) => {
  const tierOrder = ['title', 'presenting', 'official', 'media', 'supporting'];
  const grouped: Record<string, { partners: Partner[], sanityPartners: SanityPartner[] }> = {};
  
  tierOrder.forEach(tier => {
    const tierPartners = partners.filter((_, index) => sanityPartners[index].tier === tier);
    const tierSanityPartners = sanityPartners.filter(p => p.tier === tier);
    
    if (tierPartners.length > 0) {
      grouped[tier] = {
        partners: tierPartners,
        sanityPartners: tierSanityPartners
      };
    }
  });
  
  return grouped;
};

const getTierLabel = (tier: string) => {
  const labels: Record<string, string> = {
    title: 'Title Sponsor',
    presenting: 'Presenting Sponsors',
    official: 'Official Partners',
    media: 'Media Partners',
    supporting: 'Supporting Partners'
  };
  return labels[tier] || 'Partners';
};

const getTierClass = (tier: string) => {
  const classes: Record<string, string> = {
    title: styles.titleSponsor,
    presenting: styles.presentingSponsor,
    official: styles.officialPartner,
    media: styles.mediaPartner,
    supporting: styles.supportingPartner
  };
  return classes[tier] || styles.officialPartner;
};

export default async function PartnersSection() {
  const { partners, sanityPartners } = await getPartners();
  
  if (partners.length === 0) {
    return (
      <section id="partners" className={styles.partnersSection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Partnership Opportunities</h2>
          
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} role="img" aria-label="Handshake emoji">🤝</div>
            <h3 className={styles.emptyTitle}>Join Our Festival Family</h3>
            <p className={styles.emptyDescription}>
              {"Partner with Shakara Festival to connect with thousands of music lovers and showcase your brand alongside Africa's finest artists."}
            </p>
            <div className={styles.partnershipTypes}>
              <div className={styles.partnershipType}>
                <div className={styles.typeIcon} role="img" aria-label="Trophy emoji">🏆</div>
                <div className={styles.typeLabel}>Title Sponsors</div>
              </div>
              <div className={styles.partnershipType}>
                <div className={styles.typeIcon} role="img" aria-label="Music emoji">🎵</div>
                <div className={styles.typeLabel}>Media Partners</div>
              </div>
              <div className={styles.partnershipType}>
                <div className={styles.typeIcon} role="img" aria-label="Food emoji">🍕</div>
                <div className={styles.typeLabel}>Food & Beverage</div>
              </div>
              <div className={styles.partnershipType}>
                <div className={styles.typeIcon} role="img" aria-label="Briefcase emoji">💼</div>
                <div className={styles.typeLabel}>Official Partners</div>
              </div>
            </div>
            <EmailButton
              email="contact@shakarafestival.com"
              subject="Partnership Opportunity - Shakara Festival"
              className={styles.partnerButton}
              aria-label="Become a festival partner"
            >
              Become a Partner
            </EmailButton>
          </div>
        </div>
      </section>
    );
  }

  const groupedPartners = groupPartnersByTier(partners, sanityPartners);

  return (
    <section id="partners" className={styles.partnersSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our Partners</h2>
        <p className={styles.subtitle}>
          Proudly supported by industry leaders and innovative brands who share our vision for celebrating African music and culture
        </p>
        
        {Object.entries(groupedPartners).map(([tier, { partners: tierPartners, sanityPartners: tierSanityPartners }]) => (
          <div key={tier} className={styles.tierSection}>
            <h3 className={styles.tierTitle}>{getTierLabel(tier)}</h3>
            
            <div className={`${styles.partnersGrid} ${getTierClass(tier)}`}>
              {tierPartners.map((partner, index) => {
                const sanityPartner = tierSanityPartners[index];
                const logoUrl = urlFor(partner.logo).width(800).url();
                
                const PartnerContent = (
                  <div className={styles.partnerCard}>
                    <div 
                      className={styles.logoContainer}
                      style={{
                        backgroundImage: `url(${logoUrl})`,
                      }}
                    >
                      {/* Hidden image for accessibility and SEO */}
                      <Image 
                        src={logoUrl}
                        alt={`${partner.name} logo`}
                        fill
                        style={{ 
                          display: 'none',
                          objectFit: 'contain'
                        }}
                        sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 400px"
                      />
                    </div>
                  </div>
                );

                return (
                  <div key={partner.id} className={styles.partnerItem}>
                    {sanityPartner.website ? (
                      <a 
                        href={sanityPartner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.partnerLink}
                        aria-label={`Visit ${partner.name} website`}
                      >
                        {PartnerContent}
                      </a>
                    ) : (
                      <div className={styles.partnerWrapper}>
                        {PartnerContent}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Enhanced call to action for potential partners */}
        <div className={styles.partnerCta}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>{"Ready to Partner with Us?"}</h3>
            <p className={styles.ctaDescription}>
              {"Join our growing family of partners and connect your brand with Africa's most vibrant music festival experience. Let's create something extraordinary together."}
            </p>
            <div className={styles.ctaButtons}>
              {/* <button 
                className={styles.primaryCtaButton}
                aria-label="Learn about partnership opportunities"
              >
                Partnership Info
              </button> */}
              <EmailButton
                email="contact@shakarafestival.com"
                subject="Partnership Opportunity - Shakara Festival"
                className={styles.secondaryCtaButton}
                aria-label="Contact us about partnering"
              >
                Contact Us
              </EmailButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}