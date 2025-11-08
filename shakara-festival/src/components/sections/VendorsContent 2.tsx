'use client'

import { useState, useMemo } from 'react'
import { Vendor } from '@/types'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import { Search, MapPin, ExternalLink, CreditCard, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react'
import ThemedContent from '@/components/ThemedContent'

interface VendorsContentProps {
  vendors: Vendor[]
}

const categoryLabels: Record<string, string> = {
  food: 'Food & Beverages',
  fashion: 'Fashion & Apparel',
  arts: 'Arts & Crafts',
  beauty: 'Beauty & Wellness',
  accessories: 'Accessories & Jewelry',
  lifestyle: 'Home & Lifestyle',
  tech: 'Tech & Gadgets',
  entertainment: 'Entertainment',
  services: 'Services',
  other: 'Other'
}

const priceRangeLabels: Record<string, string> = {
  budget: '$',
  moderate: '$$',
  premium: '$$$',
  luxury: '$$$$'
}

const categoryIcons: Record<string, string> = {
  food: '🍔',
  fashion: '👗',
  arts: '🎨',
  beauty: '💄',
  accessories: '💍',
  lifestyle: '🏠',
  tech: '💻',
  entertainment: '🎭',
  services: '🛠️',
  other: '🏪'
}

export default function VendorsContent({ vendors }: VendorsContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Get unique categories from vendors
  const categories = useMemo(() => {
    const cats = new Set(vendors.map(v => v.category))
    return Array.from(cats).sort()
  }, [vendors])

  // Filter vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [vendors, searchQuery, selectedCategory])

  // Group filtered vendors by featured status
  const featuredVendors = filteredVendors.filter(v => v.featured)
  const regularVendors = filteredVendors.filter(v => !v.featured)

  return (
    <ThemedContent transparent>
      <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 gradient-text">
              Festival Vendors
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Discover amazing food, fashion, art, and more from our curated selection of local vendors
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-12 space-y-6">
            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search vendors, categories, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                All Vendors
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <span className="mr-1.5">{categoryIcons[category]}</span>
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8 text-center text-gray-400">
            Showing {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'}
          </div>

          {/* Featured Vendors */}
          {featuredVendors.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Featured Vendors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredVendors.map(vendor => (
                  <VendorCard key={vendor.id} vendor={vendor} featured />
                ))}
              </div>
            </div>
          )}

          {/* Regular Vendors */}
          {regularVendors.length > 0 && (
            <div>
              {featuredVendors.length > 0 && (
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">All Vendors</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularVendors.map(vendor => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredVendors.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No vendors found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </ThemedContent>
  )
}

function VendorCard({ vendor, featured = false }: { vendor: Vendor; featured?: boolean }) {
  const logoUrl = vendor.logo ? urlFor(vendor.logo).width(400).height(400).url() : null
  const coverUrl = vendor.coverImage ? urlFor(vendor.coverImage).width(800).height(400).url() : null

  return (
    <div className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border transition-all hover:scale-[1.02] hover:shadow-2xl ${
      featured
        ? 'border-orange-500/50 shadow-lg shadow-orange-500/20'
        : 'border-gray-700 hover:border-orange-500/30'
    }`}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          ⭐ Featured
        </div>
      )}

      {/* Cover Image or Logo */}
      <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={vendor.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : logoUrl ? (
          <div className="flex items-center justify-center h-full p-8">
            <Image
              src={logoUrl}
              alt={vendor.name}
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl">{categoryIcons[vendor.category]}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Logo (if cover exists) */}
        {coverUrl && logoUrl && (
          <div className="mb-4 -mt-16 relative z-10">
            <div className="w-20 h-20 rounded-lg overflow-hidden border-4 border-gray-800 bg-white shadow-xl">
              <Image
                src={logoUrl}
                alt={vendor.name}
                width={80}
                height={80}
                className="object-contain w-full h-full p-1"
              />
            </div>
          </div>
        )}

        {/* Vendor Info */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-white pr-2">{vendor.name}</h3>
            {vendor.priceRange && (
              <span className="text-orange-400 font-semibold text-sm whitespace-nowrap">
                {priceRangeLabels[vendor.priceRange]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-700/50 text-gray-300">
              <span className="mr-1.5">{categoryIcons[vendor.category]}</span>
              {categoryLabels[vendor.category]}
            </span>
            {vendor.acceptsPayments && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-900/30 text-green-400 text-xs">
                <CreditCard className="w-3 h-3 mr-1" />
                Card
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
          {vendor.description}
        </p>

        {/* Highlights */}
        {vendor.highlights && vendor.highlights.length > 0 && (
          <ul className="mb-4 space-y-1">
            {vendor.highlights.slice(0, 3).map((highlight, idx) => (
              <li key={idx} className="text-xs text-gray-400 flex items-start">
                <span className="text-orange-400 mr-2">•</span>
                <span className="line-clamp-1">{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Location */}
        {vendor.location && (
          <div className="flex items-center text-xs text-gray-400 mb-4">
            <MapPin className="w-3 h-3 mr-1.5" />
            {vendor.location}
          </div>
        )}

        {/* Footer - Social Links & Website */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            {vendor.socialLinks?.instagram && (
              <a href={vendor.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-orange-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {vendor.socialLinks?.twitter && (
              <a href={vendor.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-orange-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {vendor.socialLinks?.facebook && (
              <a href={vendor.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-orange-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {vendor.socialLinks?.tiktok && (
              <a href={vendor.socialLinks.tiktok} target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-orange-400 transition-colors" title="TikTok">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            )}
            {vendor.socialLinks?.linkedin && (
              <a href={vendor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-orange-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>

          {vendor.website && (
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-medium text-orange-400 hover:text-orange-300 transition-colors"
            >
              Visit Site
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>

        {/* Tags */}
        {vendor.tags && vendor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-700">
            {vendor.tags.slice(0, 4).map((tag, idx) => (
              <span key={idx} className="text-xs px-2 py-0.5 rounded bg-gray-700/50 text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
