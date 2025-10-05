import LayoutWrapper from '@/components/v2/LayoutWrapper'
import ThemedContent from '@/components/ThemedContent'
import AboutSection from '@/components/sections/AboutSection'
import PaperSection from '@/components/v2/PaperSection'

export default function AboutPage() {
  return (
    <LayoutWrapper currentPageName="About">
      <ThemedContent transparent>
        <PaperSection>
          <AboutSection />
        </PaperSection>
      </ThemedContent>
    </LayoutWrapper>
  )
}


