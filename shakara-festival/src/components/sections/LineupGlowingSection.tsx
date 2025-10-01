"use client";

import React from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function LineupGlowingSection() {
  return (
    <div className="max-w-[1600px] mx-auto px-4">
      {/* Featuring Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-8">
        Featuring
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* All cards same size - Day 1 */}
        <GridItem
          image="/images/lineup/line-up-day-1.jpeg"
          title="Day 1: ALTÉ"
          description=""
          cardHeight="h-[350px]"
        />

        {/* Day 2 */}
        <GridItem
          image="/images/lineup/line-up-day-2.jpeg"
          title="Day 2: LEADING LADIES"
          description=""
          cardHeight="h-[350px]"
        />

        {/* Day 3 */}
        <GridItem
          image="/images/lineup/line-up-day-3.jpeg"
          title="Day 3: AFROBEATS"
          description=""
          cardHeight="h-[350px]"
        />

        {/* Day 4 */}
        <GridItem
          image="/images/lineup/line-up-day-4.jpeg"
          title="Day 4: GOSPEL NIGHT"
          description=""
          cardHeight="h-[350px]"
        />

        {/* Shakara Junction */}
        <GridItem
          image="/images/shakara-junction.jpeg"
          title="SHAKARA JUNCTION"
          description=""
          cardHeight="h-[350px]"
        />
      </div>
    </div>
  );
}

const GridItem = ({
  image,
  title,
  description,
  cardHeight = "h-[400px]"
}: {
  image: string;
  title: string;
  description: string;
  cardHeight?: string;
}) => {
  return (
    <div className={`${cardHeight}`}>
      <div className="relative h-full rounded-2xl border border-gray-800 p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          variant="default"
        />
        <div
          className="relative flex h-full flex-col justify-end gap-6 overflow-hidden rounded-xl p-6 md:p-8"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Enhanced overlay for better text readability */}
          {title && (
            <>
              {/* Dark overlay for overall contrast */}
              <div className="absolute inset-0 bg-black/40"></div>
              {/* Gradient overlay for text area */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
            </>
          )}
          
          {/* Content */}
          {title && (
            <div className="relative z-20">
              <h3 className="font-sans text-xl md:text-2xl lg:text-3xl font-semibold text-white drop-shadow-lg mb-3">
                {title}
              </h3>
              {description && (
                <p className="font-sans text-sm md:text-base text-white/90 drop-shadow-md leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
