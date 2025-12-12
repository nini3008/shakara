'use client'

import { Download, X } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface VenueMapModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VenueMapModal({ isOpen, onClose }: VenueMapModalProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch('/images/venue-map.png')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'shakara-festival-venue-map.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading map:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!fixed !inset-0 !top-0 !left-0 !translate-x-0 !translate-y-0 !w-screen !h-screen !max-w-none sm:!max-w-none flex flex-col bg-gray-900 backdrop-blur-xl border-0 rounded-none p-0"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-800/50">
          <DialogHeader className="p-0 border-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Venue Map
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-lg font-medium text-sm hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 shadow-lg hover:shadow-yellow-400/20"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-red-500/80 text-gray-300 hover:text-white rounded-lg transition-all duration-200 border border-gray-700 hover:border-red-500"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Image Container */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-6">
          <Image
            src="/images/venue-map.png"
            alt="Shakara Festival Venue Map"
            width={1200}
            height={900}
            className="max-w-full max-h-full object-contain"
            priority
          />
        </div>

        {/* Footer hint */}
        <p className="text-center text-gray-400 text-xs sm:text-sm py-4 border-t border-gray-800/50">
          Pinch to zoom on mobile • Click download to save the map
        </p>
      </DialogContent>
    </Dialog>
  )
}

