import Link from 'next/link'
import styles from './LineupSection.module.scss'

export default function HomepageCTA() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>
            Don&apos;t miss these incredible performances!
          </p>
          <div className={styles.buttonContainer}>
            <Link 
              href="/tickets"
              className={styles.viewAllButton}
              aria-label="Get tickets to Shakara Festival"
            >
              Get Your Tickets
              <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

