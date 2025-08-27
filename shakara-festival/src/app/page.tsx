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

export default async function Home() {
  return (
    <div className="min-h-screen bg-black relative">
      {/* Navigation - Highest priority */}
      <div className="relative z-50">
        <Navigation />
      </div>
      
      {/* Hero Section - Lower priority */}
      <div className="relative z-10 h-screen overflow-hidden -mt-16">
        <HeroSection />
      </div>
      
      {/* Solid separator to prevent bleeding */}
      <div className="h-20 bg-black relative z-30"></div>

      {/* CMS-Powered Sections - All with high z-index and solid backgrounds */}
      <div className="relative z-30 bg-black">
        <AboutSection />
        <LineupSection />
        <TicketsSection />
        <ScheduleSection />
        <PartnersSection />
        {/* <MerchSection /> */}
      </div>
      <Footer />
    </div>
  )
}