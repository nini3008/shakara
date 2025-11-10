// app/layout.tsx

import './tailwind.css'
import './globals.scss'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import React from 'react'
import { BackgroundWrapper } from '@/components/BackgroundWrapper'
import {
  createPageMetadata,
  toAbsoluteUrl,
} from '@/lib/metadata-utils'

// Fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = createPageMetadata({
  title: {
    default: 'Shakara Festival 2025 | Lagos, Nigeria',
    template: '%s | Shakara Festival 2025',
  },
  description:
    "4 Days Celebrating the Best Music of African Origin. December 18-21, 2025 at Lekki Peninsula, Lagos. Join Africa's most electric fusion of sound, culture, and soul.",
  path: '/',
  image: {
    url: '/images/og-image.jpg',
    width: 1200,
    height: 630,
    alt: 'Shakara Festival 2025 - Lagos, Nigeria',
  },
  keywords: [
    'Shakara Festival',
    'Lagos Music Festival',
    'Nigerian Festival',
    'Afrobeats',
    'Lekki Peninsula',
    'African Music',
    'Music Festival 2025',
    'Nigeria Events',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    creator: '@shakarafestival',
    site: '@shakarafestival',
    images: [toAbsoluteUrl('/images/twitter-image.jpg')],
  },
  extra: {
    authors: [{ name: 'Shakara Festival', url: 'https://shakarafestival.com' }],
    creator: 'Shakara Festival',
    publisher: 'Shakara Festival',
    icons: {
      icon: [{ url: '/48.png', sizes: '48x48', type: 'image/png' }],
    },
    category: 'entertainment',
    classification: 'Music Festival',
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* Google Tag Manager */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />
        )}


        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* JSON-LD structured data (safe static content) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicFestival",
              "name": "Shakara Festival",
              "description": "4 Days Celebrating the Best Music of African Origin",
              "startDate": "2025-12-18",
              "endDate": "2025-12-21",
              "location": {
                "@type": "Place",
                "name": "Lekki Peninsula",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Lagos",
                  "addressCountry": "Nigeria",
                },
              },
              "organizer": {
                "@type": "Organization",
                "name": "Shakara Festival",
                "url": "https://shakarafestival.com",
              },
              "image": "https://shakarafestival.com/images/festival-hero.jpg",
              "url": "https://shakarafestival.com",
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <BackgroundWrapper>
          {children}
        </BackgroundWrapper>

        {/* All analytics are managed via GTM. Remove direct GA/other snippets. */}
      </body>
    </html>
  )
}
