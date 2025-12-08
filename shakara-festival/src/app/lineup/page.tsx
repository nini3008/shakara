import { Suspense } from 'react'
import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import LineupSection from '@/components/sections/LineupSection'
import Reveal from '@/components/v2/Reveal'
import { createPageMetadata } from '@/lib/metadata-utils'

export const metadata = createPageMetadata({
  title: 'Shakara Festival Lagos Lineup 2025 | Artists & Headliners',
  description:
    'Explore the artist lineup for Shakara Festival 2025, featuring live performances, DJs, speakers, and Shakara After Dark.',
  path: '/lineup',
})

export default function LineupPage() {
  return (
    <V2Layout currentPageName="Lineup">
      <ThemedContent transparent>
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <Suspense fallback={<div className="text-white text-center py-12">Loading lineup...</div>}>
                <LineupSection />
              </Suspense>
            </Reveal>
          </div>
        </main>
      </ThemedContent>
    </V2Layout>
  )
}

