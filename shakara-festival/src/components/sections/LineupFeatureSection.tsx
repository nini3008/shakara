"use client";

import React from "react";
import { useId } from "react";

export function LineupFeatureSection() {
  return (
    <div className="py-0 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6 max-w-7xl mx-auto">
        {lineupDays.map((day) => (
          <div
            key={day.title}
            className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white rounded-3xl overflow-hidden min-h-[400px]"
            style={{
              backgroundImage: `url(${day.image})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#1e1e1e'
            }}
          >
            {/* Subtle gradient overlay only at bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <Grid size={20} />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
                {day.title}
              </h3>
              <p className="text-white/90 text-base font-normal drop-shadow-md leading-relaxed">
                {day.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const lineupDays = [
  {
    title: "Day 1: Opening Night Spectacular",
    description: "Experience the grand opening with incredible Afrobeats, Amapiano, and traditional Nigerian sounds that will set the tone for an unforgettable festival.",
    image: "/images/lineup/line-up-day-1.jpeg"
  },
  {
    title: "Day 2: Peak Energy",
    description: "The heart of the festival with non-stop performances, cultural showcases, and the biggest names in African music.",
    image: "/images/lineup/line-up-day-2.jpeg"
  },
  {
    title: "Day 3: Grand Finale Weekend", 
    description: "Close out the festival with explosive performances, special collaborations, and memories that will last a lifetime under the Lagos skyline.",
    image: "/images/lineup/line-up-day-3.jpeg"
  },
  {
    title: "Day 4: After Party Vibes",
    description: "Keep the energy flowing with intimate sets, DJ sessions, and exclusive after-party experiences that extend the celebration.",
    image: "/images/lineup/line-up-day-4.jpeg"
  }
];

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }: { width: number; height: number; x: string; y: string; squares?: number[][]; className?: string }) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map((square: number[]) => (
            <rect
              strokeWidth="0"
              key={`${square[0]}-${square[1]}`}
              width={width + 1}
              height={height + 1}
              x={square[0] * width}
              y={square[1] * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
