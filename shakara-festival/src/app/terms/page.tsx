import type { Metadata } from 'next'

const pageTitle = 'Page Not Available'
const pageDescription =
  'This page is intentionally hidden from search results.'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">{pageTitle}</h1>
      <p className="text-muted-foreground">{pageDescription}</p>
      <p className="text-sm text-muted-foreground">
        If you believe this is an error, please contact
        {' '}
        <a
          className="text-primary underline decoration-dotted underline-offset-4"
          href="mailto:info@shakarafestival.com"
        >
          info@shakarafestival.com
        </a>
        .
      </p>
    </main>
  )
}


