import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import AboutSection from '@/components/sections/AboutSection'
import PaperSection from '@/components/v2/PaperSection'

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


