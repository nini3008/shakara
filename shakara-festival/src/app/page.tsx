// app/page.tsx

import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import ParallaxHero from '@/components/v2/ParallaxHero'
import V2Layout from '@/components/v2/Layout'

// Dynamically import heavy components to improve initial load
const LineupLampSection = dynamic(() => import('@/components/sections/LineupLampSection').then(mod => ({ default: mod.LineupLampSection })), {
  loading: () => <div className="min-h-screen bg-slate-950" />,
})

const SponsorsWobbleSection = dynamic(() => import('@/components/sections/SponsorsWobbleSection').then(mod => ({ default: mod.SponsorsWobbleSection })), {
  loading: () => <div className="min-h-[20rem] bg-slate-950" />,
})

export default async function Home() {
  return (
    <V2Layout>
      <div className="relative z-30 h-screen overflow-hidden">
        <ParallaxHero>
          <HeroSection />
        </ParallaxHero>
      </div>
      
      {/* Lineup Lamp Section - No padding/margins, starts immediately after hero */}
      <div className="relative z-10">
        <LineupLampSection />
      </div>
      
      {/* Sponsors Wobble Section */}
      <div className="relative z-10">
        <SponsorsWobbleSection />
      </div>
    </V2Layout>
  )
}