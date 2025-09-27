// app/page.tsx

// import ComingSoon from '@/components/ComingSoon'

// Uncommented for preview branch
import AboutSection from '@/components/sections/AboutSection'
import HeroSection from '@/components/sections/HeroSection'
import ThemedContent from '@/components/ThemedContent'
import Reveal from '@/components/v2/Reveal'
import ParallaxHero from '@/components/v2/ParallaxHero'
import V2Layout from '@/components/v2/Layout'
import RippedDivider from '@/components/v2/RippedDivider'
import PaperSection from '@/components/v2/PaperSection'

export default async function Home() {
  // return <ComingSoon />
  
  // Full site (uncommented for preview)
  return (
    <V2Layout>
      <div className="relative z-30 h-screen overflow-hidden">
        <ParallaxHero>
          <HeroSection />
        </ParallaxHero>
      </div>
      <ThemedContent className="relative z-10" transparent>
        <PaperSection tone="cream" flush bgImage="/images/torn-paper-background.png">
          <Reveal>
            <AboutSection />
          </Reveal>
        </PaperSection>
      </ThemedContent>
    </V2Layout>
  )
}