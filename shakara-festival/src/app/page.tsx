// app/page.tsx

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AboutSection from '@/components/sections/AboutSection'
import HeroSection from '@/components/sections/HeroSection'
import LineupSection from '@/components/sections/LineupSection'
import TicketsSection from '@/components/sections/TicketsSection'
import ScheduleSection from '@/components/sections/ScheduleSection'
import MerchSection from '@/components/sections/MerchSection'
import PartnersSection from '@/components/sections/PartnersSection'
import ThemedContent from '@/components/ThemedContent'

export default async function Home() {
  return (
    <div className="min-h-screen bg-black relative">
      {/* Navigation - Always dark - Highest priority */}
      <div className="relative z-50">
        <Navigation />
      </div>
      
      {/* Hero Section - Always dark - Lower priority */}
      <div className="relative z-10 h-screen overflow-hidden -mt-16">
        <HeroSection />
      </div>
      
      {/* Themed Content Sections - Apply day/night themes here */}
      <ThemedContent className="relative z-30">
        <AboutSection />
        <LineupSection />
        <TicketsSection />
        <ScheduleSection />
        <PartnersSection />
        {/* <MerchSection /> */}
        <Footer />
      </ThemedContent>
    </div>
  )
}