'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './FAQSection.module.scss'

interface FAQ {
  _id: string
  category: string
  question: string
  answer: string
  order: number
}

interface FAQsByCategoryProps {
  faqs: FAQ[]
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.faqItem}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.questionButton}
      >
        <span className={styles.questionText}>{faq.question}</span>
        <ChevronDown className={`${styles.icon} ${isOpen ? styles.open : ''}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px]' : 'max-h-0'
        }`}
      >
        <div className={styles.answer}>
          {faq.answer}
        </div>
      </div>
    </div>
  )
}

function FAQsByCategory({ faqs }: FAQsByCategoryProps) {
  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {} as Record<string, FAQ[]>)

  const categories = Object.keys(faqsByCategory).sort()

  return (
    <div className={styles.faqSection}>
      {categories.map((category) => (
        <div key={category} className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>
            {category}
          </h2>
          <div className={styles.faqList}>
            {faqsByCategory[category].map((faq) => (
              <FAQItem key={faq._id} faq={faq} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const response = await fetch('/api/faq')
        if (response.ok) {
          const data = await response.json()
          setFaqs(data)
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  return (
    <section className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Toned down background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={styles.title}>
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to know about Shakara Festival
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading FAQs...</p>
          </div>
        )}

        {/* FAQs */}
        {!loading && faqs.length > 0 && <FAQsByCategory faqs={faqs} />}

        {/* Empty State */}
        {!loading && faqs.length === 0 && (
          <div className="text-center py-12 bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50">
            <p className="text-gray-400 text-lg">
              No FAQs available at the moment. Please check back later.
            </p>
          </div>
        )}

        {/* Contact Section */}
        <div className={styles.contactSection}>
          <h3 className={styles.contactTitle}>
            Need More Information?
          </h3>
          <p className={styles.contactText}>
            Can&apos;t find what you&apos;re looking for? Reach out to us directly:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300">
              <p className="text-yellow-400 font-bold mb-2 text-base">Sponsorship</p>
              <a
                href="mailto:contact@shakarafestival.com"
                className="text-gray-300 hover:text-white transition-colors text-base"
              >
                contact@shakarafestival.com
              </a>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300">
              <p className="text-yellow-400 font-bold mb-2 text-base">Media Enquiries</p>
              <a
                href="mailto:publicrelations@shakarafestival.com"
                className="text-gray-300 hover:text-white transition-colors text-base"
              >
                publicrelations@shakarafestival.com
              </a>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300">
              <p className="text-yellow-400 font-bold mb-2 text-base">Vendors</p>
              <a
                href="mailto:vendors@shakarafestival.com"
                className="text-gray-300 hover:text-white transition-colors text-base"
              >
                vendors@shakarafestival.com
              </a>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300">
              <p className="text-yellow-400 font-bold mb-2 text-base">Talent & Bookings</p>
              <a
                href="mailto:bookings@shakarafestival.com"
                className="text-gray-300 hover:text-white transition-colors text-base"
              >
                bookings@shakarafestival.com
              </a>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 md:col-span-2">
              <p className="text-yellow-400 font-bold mb-2 text-base">Other Enquiries</p>
              <a
                href="mailto:admin@shakarafestival.com"
                className="text-gray-300 hover:text-white transition-colors text-base"
              >
                admin@shakarafestival.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
