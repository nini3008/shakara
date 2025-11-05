import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import AboutSection from '@/components/sections/AboutSection'
import PaperSection from '@/components/v2/PaperSection'
import { createPageMetadata } from '@/lib/metadata-utils'

export const metadata = createPageMetadata({
  title: 'About Shakara Festival | Lagos | Dec 18, 2025',
  description:
    'Discover the story behind Shakara Festival, our mission, and how we celebrate African music and culture in Lagos.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <V2Layout currentPageName="About">
      <ThemedContent transparent>
        <PaperSection>
          <AboutSection />
        </PaperSection>
      </ThemedContent>
    </V2Layout>
  )
}


