"use client"

import React, { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

type MetaPixelProps = {
  pixelId: string
}

/**
 * Injects Meta Pixel base code and tracks SPA route changes.
 * Renders nothing visually. Place near the end of body.
 */
export default function MetaPixel({ pixelId }: MetaPixelProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Fire PageView on route change
  useEffect(() => {
    if (typeof window === 'undefined') return
    // @ts-expect-error fbq is injected by the base script below
    if (typeof window.fbq === 'function') {
      // @ts-expect-error fbq global
      window.fbq('track', 'PageView')
    }
    // Include search params in dep so it tracks when query changes
  }, [pathname, searchParams])

  return (
    <>
      {/* Base code */}
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '${pixelId}'); fbq('track', 'PageView');`,
        }}
      />

      {/* NoScript Fallback */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}



