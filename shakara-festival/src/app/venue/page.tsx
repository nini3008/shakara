import type { Metadata } from 'next'
import Image from 'next/image'
import { Download } from 'lucide-react'
import { createPageMetadata } from '@/lib/metadata-utils'
import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import PaperSection from '@/components/v2/PaperSection'
import styles from './venue.module.scss'

export const metadata: Metadata = createPageMetadata({
  title: 'Venue Map',
  description:
    'View the interactive venue map for Shakara Festival 2025. Find all stages, amenities, food courts, parking areas, and facilities at Nautica Beach Resort, Lagos.',
  path: '/venue',
  keywords: [
    'Shakara Festival venue',
    'Shakara Festival map',
    'Nautica Beach Resort',
    'Festival grounds',
    'Venue layout',
    'Stage locations',
    'Festival amenities',
    'Parking map',
    'Lagos festival venue',
  ],
})

export default function VenuePage() {
  return (
    <V2Layout currentPageName="Venue">
      <ThemedContent transparent>
        <PaperSection>
        <main className="pt-24 pb-12 sm:pt-20 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className={styles.title}>
            Venue Map
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Explore the festival grounds at Nautica Beach Resort, Lagos. Find stages, food courts, facilities, and more.
          </p>
          
          {/* Download Button */}
          <a
            href="/images/venue-map.png"
            download="shakara-festival-venue-map.png"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-lg font-semibold text-base hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 shadow-lg hover:shadow-yellow-400/20"
          >
            <Download className="w-5 h-5" />
            Download Map
          </a>
        </div>

        {/* Map Image */}
        <div className="relative w-full max-w-5xl mx-auto bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="relative w-full aspect-[4/3]">
            <Image
              src="/images/venue-map.png"
              alt="Shakara Festival Venue Map - Nautica Beach Resort, Lagos"
              fill
              className="object-contain rounded-lg"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        </div>

        {/* Legend/Key Information */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Venue Features
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Main Facilities */}
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Main Facilities</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Main Stage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>VIP/VVIP Area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Food Court</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Vendor Market</span>
                  </li>
                </ul>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Amenities</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Entrance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Water Stalls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>First Aid Station</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Toilets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Kiosk</span>
                  </li>
                </ul>
              </div>

              {/* Activities & Services */}
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Activities & Services</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Bank of Shakara (ATM)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>AstroTurf</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Volleyball Court</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Painting Area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Shakara Radio</span>
                  </li>
                </ul>
              </div>

              {/* Parking */}
              <div className="sm:col-span-2 lg:col-span-3">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Parking</h3>
                <ul className="space-y-2 text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>General Car Parking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>VIP/VVIP Parking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Ticketing & Registration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Location
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              <strong className="text-yellow-400">Nautica Beach Resort</strong><br />
              Lekki Peninsula, Lagos, Nigeria
            </p>
            <p className="text-gray-400 mb-4">
              December 18 - 21, 2025
            </p>
            <p className="text-gray-300">
              The festival takes place on the beautiful beachfront of Nautica Beach Resort, offering stunning ocean views and a spacious layout perfect for our 4-day celebration of African music and culture.
            </p>
          </div>
        </div>
      </div>
        </main>
        </PaperSection>
      </ThemedContent>
    </V2Layout>
  )
}

