'use client'

import React from 'react'

type RippedDividerProps = {
  position?: 'top' | 'bottom'
  topColor?: string
  bottomColor?: string
  height?: number
  className?: string
  aggressive?: boolean
}

/**
 * RippedDivider renders a lightweight SVG "torn paper" edge
 * that can be used between sections. It stretches horizontally
 * using preserveAspectRatio="none" so it always fills the width.
 */
export default function RippedDivider({
  position = 'bottom',
  topColor = '#fffdf6',
  bottomColor = '#0f0f10',
  height = 64,
  className = '',
  aggressive = false,
}: RippedDividerProps) {
  const isTop = position === 'top'
  return (
    <div
      aria-hidden
      className={className}
      style={{
        height,
        lineHeight: 0,
        marginTop: -1, // eliminate hairline gap above
        marginBottom: -1, // eliminate hairline gap below
        transform: isTop ? 'rotate(180deg)' : undefined,
        display: 'block'
      }}
    >
      <svg
        viewBox="0 0 1200 200"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bottom (under) surface */}
        <rect width="1200" height="200" fill={bottomColor} />

        {/* Jagged tear shape (two layers; aggressive variant exaggerates peaks) */}
        {/* Top paper that overlaps with a torn edge */}
        <path
          d={aggressive ?
            "M0,0 L0,130 C70,160 120,90 200,145 C270,175 330,95 400,145 C470,180 540,95 610,150 C680,185 750,95 820,160 C890,190 980,105 1060,165 C1120,195 1160,125 1200,150 L1200,0 Z" :
            "M0,0 L0,140 C60,135 140,105 210,130 C270,150 330,115 390,130 C450,145 520,115 585,130 C660,150 720,110 780,135 C840,160 900,115 960,135 C1020,155 1110,115 1200,140 L1200,0 Z"
          }
          fill={topColor}
        />

        {/* Thin highlight along the tear to enhance contrast */}
        <path
          d={aggressive ?
            "M0,110 C70,160 120,90 200,145 C270,175 330,95 400,145 C470,180 540,95 610,150 C680,185 750,95 820,160 C890,190 980,105 1060,165 C1120,195 1160,125 1200,150" :
            "M0,120 C60,135 140,105 210,130 C270,150 330,115 390,130 C450,145 520,115 585,130 C660,150 720,110 780,135 C840,160 900,115 960,135 C1020,155 1110,115 1200,140"}
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth={aggressive ? 9 : 6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Paper crease tapes - add small pieces at random positions */}
        <g opacity="0.6">
          <defs>
            <linearGradient id="tapeGrad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
            </linearGradient>
          </defs>
          <rect x="140" y="32" width="120" height="18" rx="2" fill="url(#tapeGrad)" transform="rotate(-6 140 32)" />
          <rect x="920" y="28" width="140" height="20" rx="2" fill="url(#tapeGrad)" transform="rotate(7 920 28)" />
          <rect x="520" y="46" width="110" height="16" rx="2" fill="url(#tapeGrad)" transform="rotate(-3 520 46)" />
        </g>

        {/* Soft shadow into the section below */}
        <linearGradient id="shadowGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <path
          d={aggressive ? "M0,150 L1200,175 L1200,200 L0,200 Z" : "M0,140 L1200,160 L1200,200 L0,200 Z"}
          fill="url(#shadowGrad)"
        />
      </svg>
    </div>
  )
}


