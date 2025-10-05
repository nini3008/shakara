// app/page.tsx

import HeroSection from '@/components/sections/HeroSection'
import ParallaxHero from '@/components/v2/ParallaxHero'
import LayoutWrapper from '@/components/v2/LayoutWrapper'

// Lineup section hidden
// Sponsors section hidden

export default async function Home() {
  return (
    <LayoutWrapper>
      <div className="relative z-30 h-screen overflow-hidden">
        <ParallaxHero>
          <HeroSection />
        </ParallaxHero>
      </div>

      {/* Lineup Lamp Section - Hidden for now */}
      {/* <div className="relative z-10">
        <LineupLampSection />
      </div> */}

      {/* Sponsors section hidden */}
    </LayoutWrapper>
  )
}