// components/sections/MerchSection.tsx

import { client, FEATURED_MERCH_QUERY, urlFor } from '@/lib/sanity';
import { MerchItem } from '@/types';
import { SanityMerchItem, adaptSanityMerchItem } from '@/types/sanity-adapters';
import Image from 'next/image';
import Link from 'next/link';
import styles from './MerchSection.module.scss';

async function getFeaturedMerch(): Promise<{ merchItems: MerchItem[], sanityMerchItems: SanityMerchItem[] }> {
  try {
    const sanityMerchItems: SanityMerchItem[] = await client.fetch(FEATURED_MERCH_QUERY);
    const merchItems = sanityMerchItems.map(adaptSanityMerchItem);
    return { merchItems, sanityMerchItems };
  } catch (error) {
    console.error('Error fetching featured merch:', error);
    return { merchItems: [], sanityMerchItems: [] };
  }
}

export default async function MerchSection() {
  const { merchItems, sanityMerchItems } = await getFeaturedMerch();

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'apparel':
      case 'clothing':
        return '👕';
      case 'headwear':
      case 'hats':
        return '🧢';
      case 'accessories':
        return '👜';
      case 'gear':
        return '🎒';
      default:
        return '🛍️';
    }
  };

  return (
    <section id="merch" className={styles.merchSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Merchandise
        </h2>
        
        {merchItems.length > 0 ? (
          <>
            <div className={styles.merchGrid}>
              {merchItems.slice(0, 4).map((item, index) => {
                const sanityItem = sanityMerchItems[index];
                return (
                  <div key={item.id} className={styles.merchGroup}>
                    <Link href={`/merch/${sanityItem.slug.current}`}>
                      <div className={styles.merchCard}>
                        {sanityItem.images && sanityItem.images.length > 0 ? (
                          <div className={styles.imageContainer}>
                            <Image
                              src={urlFor(sanityItem.images[0]).width(300).height(300).url()}
                              alt={item.name}
                              fill
                              className={styles.merchImage}
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            />
                            <div className={styles.badgeContainer}>
                              {sanityItem.newArrival && (
                                <span className={styles.newBadge}>
                                  NEW
                                </span>
                              )}
                              {sanityItem.limitedEdition && (
                                <span className={styles.limitedBadge}>
                                  LIMITED
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className={styles.placeholderImage}>
                            <span className={styles.placeholderIcon}>
                              {getCategoryIcon(item.category)}
                            </span>
                          </div>
                        )}
                        
                        <div className={styles.cardContent}>
                          <h3 className={styles.itemName}>
                            {item.name}
                          </h3>
                          
                          {item.category && (
                            <p className={styles.itemCategory}>
                              {item.category}
                            </p>
                          )}
                          
                          <div className={styles.priceContainer}>
                            <span className={styles.currentPrice}>
                              {formatPrice(item.price)}
                            </span>
                            {sanityItem.compareAtPrice && sanityItem.compareAtPrice > item.price && (
                              <span className={styles.comparePrice}>
                                {formatPrice(sanityItem.compareAtPrice)}
                              </span>
                            )}
                          </div>
                          
                          {item.sizes && item.sizes.length > 0 && (
                            <div className={styles.optionsContainer}>
                              {item.sizes.slice(0, 4).map((size) => (
                                <span key={size} className={styles.optionTag}>
                                  {size}
                                </span>
                              ))}
                              {item.sizes.length > 4 && (
                                <span className={styles.moreOptions}>+{item.sizes.length - 4}</span>
                              )}
                            </div>
                          )}
                          
                          {item.colors && item.colors.length > 0 && (
                            <div className={styles.optionsContainer}>
                              {item.colors.slice(0, 3).map((color) => (
                                <span key={color} className={styles.optionTag}>
                                  {color}
                                </span>
                              ))}
                              {item.colors.length > 3 && (
                                <span className={styles.moreOptions}>+{item.colors.length - 3}</span>
                              )}
                            </div>
                          )}
                          
                          <div className={styles.availabilityContainer}>
                            {!item.available ? (
                              <span className={styles.outOfStock}>Out of Stock</span>
                            ) : sanityItem.preOrder ? (
                              <span className={styles.preOrder}>Pre-Order</span>
                            ) : (
                              <span className={styles.available}>Available</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
            
            <div className={styles.buttonContainer}>
              <Link href="/merch" className={styles.shopAllButton}>
                Shop All Merch
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👕</div>
            <h3 className={styles.emptyTitle}>Festival Merch</h3>
            <p className={styles.emptyDescription}>
              Exclusive Shakara Festival merchandise coming soon!
            </p>
            <div className={styles.previewGrid}>
              <div className={styles.previewItem}>
                <div className={styles.previewIcon}>👕</div>
                <div className={styles.previewLabel}>T-Shirts</div>
              </div>
              <div className={styles.previewItem}>
                <div className={styles.previewIcon}>🧢</div>
                <div className={styles.previewLabel}>Caps</div>
              </div>
              <div className={styles.previewItem}>
                <div className={styles.previewIcon}>👜</div>
                <div className={styles.previewLabel}>Bags</div>
              </div>
              <div className={styles.previewItem}>
                <div className={styles.previewIcon}>🎒</div>
                <div className={styles.previewLabel}>Gear</div>
              </div>
            </div>
            <button className={styles.notifyButton}>
              Notify Me
            </button>
          </div>
        )}
      </div>
    </section>
  );
}