import V2Layout from '@/components/v2/Layout'
import ThemedContent from '@/components/ThemedContent'
import Reveal from '@/components/v2/Reveal'
import PaperSection from '@/components/v2/PaperSection'
import Image from 'next/image'
import { client, FEATURED_PARTNERS_QUERY, PARTNERS_QUERY } from '@/lib/sanity'
import PageHeader from '@/components/v2/PageHeader'

type Partner = {
  _id: string
  name: string
  slug?: { current: string }
  logo?: any
  website?: string
  tier?: string
  featured?: boolean
  order?: number
}

async function getSponsors(): Promise<Partner[]> {
  try {
    const partners: Partner[] = await client.fetch(PARTNERS_QUERY)
    return partners?.filter((p) => p.active !== false) ?? []
  } catch {
    return []
  }
}

export default async function SponsorsPage() {
  const sponsors = await getSponsors()
  const tiers = ['title', 'presenting', 'official', 'media', 'supporting']

  return (
    <V2Layout currentPageName="Sponsors">
      <ThemedContent className="relative z-30" transparent>
        <PaperSection bgImage="/images/torn-paper-background.png">
        <section className="py-8 md:py-12">
          <PageHeader title="Sponsors" description="Brands powering the Shakara experience." />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {tiers.map((tier) => {
              const tierSponsors = sponsors.filter((s) => s.tier === tier)
              if (!tierSponsors.length) return null
              const tierTitleMap: Record<string, string> = {
                title: 'Title Sponsor',
                presenting: 'Presenting Sponsor',
                official: 'Official Partners',
                media: 'Media Partners',
                supporting: 'Supporting Partners',
              }
              return (
                <Reveal key={tier}>
                  <div className="mb-12 md:mb-16">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-200 mb-6">
                      {tierTitleMap[tier] || tier}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 items-center">
                      {tierSponsors.map((s) => (
                        <a
                          key={s._id}
                          href={s.website || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-xl border border-gray-800/60 bg-white/5 hover:bg-white/10 transition-all p-4 flex items-center justify-center h-28"
                          aria-label={s.name}
                        >
                          {s.logo ? (
                            <Image
                              src={s.logo?.asset?._ref ? `/api/placeholder/logo/${s._id}` : '/images/SHAKARAWhite.png'}
                              alt={s.name}
                              width={200}
                              height={80}
                              className="max-h-16 w-auto opacity-90 group-hover:opacity-100"
                            />
                          ) : (
                            <span className="text-sm text-gray-300 font-medium">{s.name}</span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>
        </PaperSection>
      </ThemedContent>
    </V2Layout>
  )
}


