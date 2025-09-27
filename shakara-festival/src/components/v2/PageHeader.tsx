import React from 'react'

type Stat = { label: string; value: string | number }

interface PageHeaderProps {
  title: string
  description?: string
  stats?: Stat[]
}

export default function PageHeader({ title, description, stats }: PageHeaderProps) {
  return (
    <section className="relative pt-24 pb-6">
      <div className="absolute inset-x-0 top-0 h-[180px] bg-[url('/images/torn-paper-background.png')] bg-no-repeat bg-top bg-contain pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/40 backdrop-blur-md p-6 md:p-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight gradient-text">{title}</h1>
            {description ? (
              <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-700 dark:text-gray-300">{description}</p>
            ) : null}
          </div>

          {stats && stats.length > 0 && (
            <div className="mt-6 md:mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">{s.value}</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


