// app/layout.tsx

import './tailwind.css'
import './globals.scss'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import React from 'react'
import { BackgroundWrapper } from '@/components/BackgroundWrapper'

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

export const metadata: Metadata = {
  title: {
    default: 'Shakara Festival 2025 | Lagos, Nigeria',
    template: '%s | Shakara Festival 2025',
  },
  description:
    "4 Days Celebrating the Best Music of African Origin. December 18-21, 2025 at Victoria Island, Lagos. Join Africa's most electric fusion of sound, culture, and soul.",
  keywords: [
    'Shakara Festival',
    'Lagos Music Festival',
    'Nigerian Festival',
    'Afrobeats',
    'Victoria Island',
    'African Music',
    'Music Festival 2025',
    'Nigeria Events',
  ],
  authors: [{ name: 'Shakara Festival', url: 'https://shakarafestival.com' }],
  creator: 'Shakara Festival',
  publisher: 'Shakara Festival',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shakarafestival.com',
    siteName: 'Shakara Festival',
    title: 'Shakara Festival 2025 | Lagos, Nigeria',
    description: '4 Days Celebrating the Best Music of African Origin',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Shakara Festival 2025 - Lagos, Nigeria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shakara Festival 2025 | Lagos, Nigeria',
    description: '4 Days Celebrating the Best Music of African Origin',
    images: ['/images/twitter-image.jpg'],
    creator: '@shakarafestival',
    site: '@shakarafestival',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#ff6b9d',
      },
    ],
  },
  // manifest: '/site.webmanifest',
  category: 'entertainment',
  classification: 'Music Festival',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

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
                "name": "Victoria Island",
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
