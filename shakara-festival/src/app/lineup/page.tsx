import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import { client, SCHEDULE_QUERY } from '@/lib/sanity'
import { ScheduleEvent } from '@/types'
import { SanityScheduleEvent, adaptSanityScheduleEvent } from '@/types/sanity-adapters'
import ScheduleContent from '@/components/schedule/scheduleContext'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import LineupSection from '@/components/sections/LineupSection'
import Reveal from '@/components/v2/Reveal'
import { createPageMetadata } from '@/lib/metadata-utils'

export const metadata = createPageMetadata({
  title: 'Shakara Festival Lagos Lineup 2025 | Artists & Headliners',
  description:
    'Explore the artist lineup and daily schedule for Shakara Festival 2025, featuring the best of African music.',
  path: '/lineup',
})

export default async function LineupPage() {
  let initialEvents: ScheduleEvent[] = []
  let initialSanityEvents: SanityScheduleEvent[] = []

  try {
    const sanityData: SanityScheduleEvent[] = await client.fetch(SCHEDULE_QUERY)
    initialEvents = sanityData.map(adaptSanityScheduleEvent)
    initialSanityEvents = sanityData
  } catch (error) {
    console.error('Error fetching lineup schedule data:', error)
  }

  return (
    <V2Layout currentPageName="Lineup">
      <ThemedContent transparent>
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
            <Tabs defaultValue="featured" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold gradient-text">Browse</h2>
                <TabsList>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="featured" className="mt-0">
                <Reveal>
                  <LineupSection />
                </Reveal>
              </TabsContent>

              <TabsContent value="schedule" className="mt-0">
                <Reveal delay={0.06}>
                  <ScheduleContent initialEvents={initialEvents} initialSanityEvents={initialSanityEvents} />
                </Reveal>
              </TabsContent>
            </Tabs>
            </Reveal>
          </div>
        </main>
      </ThemedContent>
    </V2Layout>
  )
}


