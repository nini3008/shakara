import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import NewsletterSignup from '@/components/sections/NewsLetterSignup'
import { createPageMetadata } from '@/lib/metadata-utils'

export const metadata = createPageMetadata({
  title: 'Shakara Festival Newsletter | Get Lineup & Ticket Updates',
  description:
    'Join the Shakara Festival newsletter for early ticket access, lineup drops, and insider experiences across Lagos.',
  path: '/newsletter',
  keywords: [
    'Shakara Festival newsletter',
    'Shakara updates',
    'Lagos music festival newsletter',
    'Afrobeat festival news',
  ],
})

export default function NewsletterPage() {
  return (
    <V2Layout currentPageName="Newsletter">
      <ThemedContent transparent>
        <main className="relative pt-32 pb-32 sm:pt-40 sm:pb-36 min-h-[calc(100vh-18rem)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex h-full flex-col">
            <section className="text-center space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Fresh drops • Insider invites • First to know
              </span>
              <h1 className="heading-font text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Stay plugged into the Shakara movement
              </h1>
            </section>

            <section className="mt-12 flex-1 flex items-center justify-center">
              <div className="mx-auto w-full max-w-xl">
                <NewsletterSignup variant="modal" className="bg-gray-950/60 border border-white/10 shadow-none" />
              </div>
            </section>
          </div>
        </main>
      </ThemedContent>
    </V2Layout>
  )
}

