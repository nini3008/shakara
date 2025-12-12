'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Map } from 'lucide-react'
import VenueMapModal from './VenueMapModal'

export default function FloatingMapButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()
  
  // Hide on venue page since it's redundant
  if (pathname === '/venue') {
    return null
  }

  return (
    <>
      {/* Floating button - positioned above the help button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 group"
        aria-label="View venue map"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          
          {/* Button */}
          <div className="relative bg-gray-900/95 backdrop-blur-sm border-2 border-yellow-400/30 group-hover:border-yellow-400 rounded-full p-3 sm:p-4 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
            <Map className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
          </div>
        </div>
        
        {/* Tooltip - hidden on mobile */}
        <span className="hidden sm:block absolute bottom-full right-0 mb-2 px-3 py-1.5 text-xs font-medium text-gray-100 bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          View venue map
        </span>
      </button>

      {/* Venue Map Modal */}
      <VenueMapModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

