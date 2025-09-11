// app/page.tsx

import ComingSoon from '@/components/ComingSoon'

// Commented out for coming soon page
// import Navigation from '@/components/Navigation'
// import Footer from '@/components/Footer'
// import AboutSection from '@/components/sections/AboutSection'
// import HeroSection from '@/components/sections/HeroSection'
// import LineupSection from '@/components/sections/LineupSection'
// import TicketsSection from '@/components/sections/TicketsSection'
// import ScheduleSection from '@/components/sections/ScheduleSection'
// import MerchSection from '@/components/sections/MerchSection'
// import PartnersSection from '@/components/sections/PartnersSection'
// import ThemedContent from '@/components/ThemedContent'

export default async function Home() {
  return <ComingSoon />
  
  // Full site (commented out)
  /*
  return (
    <div className="min-h-screen bg-black relative">
      <div className="relative z-50">
        <Navigation />
      </div>
      
      <div className="relative z-10 h-screen overflow-hidden -mt-16">
        <HeroSection />
      </div>
      
      <ThemedContent className="relative z-30">
        <AboutSection />
        <LineupSection />
        <TicketsSection />
        <ScheduleSection />
        <PartnersSection />
        <Footer />
      </ThemedContent>
    </div>
  )
  */
}