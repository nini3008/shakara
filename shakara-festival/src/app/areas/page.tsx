import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import Reveal from '@/components/v2/Reveal'
import ShakaraJunction from '@/components/v2/ShakaraJunction'
import PageHeader from '@/components/v2/PageHeader'

export default function AreasPage() {
  return (
    <V2Layout currentPageName="Areas">
      <ThemedContent className="relative z-30" transparent>
        <PageHeader title="Areas" description="Explore stages, zones and Shakara Junction." />
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <ShakaraJunction />
            </Reveal>
          </div>
        </section>
      </ThemedContent>
    </V2Layout>
  )
}


