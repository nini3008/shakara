'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronDown, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface FAQ {
  _id: string
  category: string
  question: string
  answer: string
  order: number
}

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (isOpen) {
      fetchFAQs()
    }
  }, [isOpen])

  async function fetchFAQs() {
    try {
      setLoading(true)
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

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))]

  // Filter FAQs based on search and category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group filtered FAQs by category
  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {} as Record<string, FAQ[]>)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl h-[90vh] sm:h-[80vh] flex flex-col bg-gray-900/98 backdrop-blur-xl border-2 border-yellow-400/20 shadow-2xl">
        <DialogHeader className="border-b border-gray-800/50 pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            How can we help?
          </DialogTitle>
        </DialogHeader>

        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:border-yellow-400/50 transition-colors text-white placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
          ) : filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {searchTerm ? 
                  `No FAQs found matching "${searchTerm}"` : 
                  'No FAQs available'
                }
              </p>
            </div>
          ) : (
            Object.entries(groupedFAQs).map(([category, categoryFaqs]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  {category}
                </h3>
                {categoryFaqs.map((faq) => (
                  <div
                    key={faq._id}
                    className="bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-200 group"
                  >
                    <button
                      onClick={() => toggleExpanded(faq._id)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between text-left"
                    >
                      <span className="text-gray-100 font-medium pr-3 text-sm sm:text-base group-hover:text-white transition-colors">{faq.question}</span>
                      <ChevronDown 
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 group-hover:text-yellow-400 ${
                          expandedItems.has(faq._id) ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedItems.has(faq._id) ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="px-4 sm:px-5 pb-3 sm:pb-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700/50">
          <p className="text-center text-gray-400 mb-3 text-sm sm:text-base">
            Still need help? Contact us directly:
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 sm:gap-4">
            <a
              href="mailto:admin@shakarafestival.com"
              className="text-yellow-400 hover:text-yellow-300 transition-colors text-xs sm:text-sm"
            >
              admin@shakarafestival.com
            </a>
            <span className="hidden sm:block text-gray-600">|</span>
            <a
              href="mailto:contact@shakarafestival.com"
              className="text-yellow-400 hover:text-yellow-300 transition-colors text-xs sm:text-sm"
            >
              contact@shakarafestival.com
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
