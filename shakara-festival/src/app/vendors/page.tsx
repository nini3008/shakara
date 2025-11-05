import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import PaperSection from '@/components/v2/PaperSection'
import { createPageMetadata } from '@/lib/metadata-utils'

export const metadata = createPageMetadata({
  title: 'Shakara Festival Vendors | Marketplace & Food Stalls',
  description: 'Discover vendor opportunities and marketplace offerings at Shakara Festival 2025.',
  path: '/vendors',
})

export default function VendorsPage() {
  return (
    <V2Layout currentPageName="Vendors">
      <ThemedContent transparent>
        <PaperSection>
          <div className="min-h-screen flex items-center justify-center py-24 px-4">
            <div className="text-center max-w-2xl mx-auto">
              <div className="mb-8">
                <span className="text-8xl">🛍️</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="gradient-text">Coming Soon</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300">
                Our vendor marketplace is currently being prepared. Check back soon!
              </p>
            </div>
          </div>
        </PaperSection>
      </ThemedContent>
    </V2Layout>
  )
}
