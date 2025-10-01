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
      
      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-5 lg:gap-4 xl:grid-rows-4">
        <GridItem
          area="md:[grid-area:1/1/3/7] xl:[grid-area:1/1/3/5]"
          image="/images/lineup/line-up-day-1.jpeg"
          title="Day 1: Opening Night Spectacular"
          description="Experience the grand opening with incredible Afrobeats, Amapiano, and traditional Nigerian sounds that will set the tone for an unforgettable festival."
          mobileHeight="h-[450px]"
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:1/5/2/9]"
          image="/images/lineup/line-up-day-2.jpeg"
          title="Day 2: LEADING LADIES"
          description=""
          mobileHeight="h-[400px]"
        />
        <GridItem
          area="md:[grid-area:2/7/4/13] xl:[grid-area:1/9/3/13]"
          image="/images/lineup/line-up-day-3.jpeg"
          title="Day 3: AFROBEATS"
          description=""
          mobileHeight="h-[420px]"
        />
        <GridItem
          area="md:[grid-area:5/1/6/13] xl:[grid-area:3/9/5/13]"
          image="/images/lineup/line-up-day-4.jpeg"
          title="Day 4: GOSPEL NIGHT"
          description=""
          mobileHeight="h-[500px]"
        />
        <GridItem
          area="md:[grid-area:5/1/6/13] xl:[grid-area:3/9/5/13]"
          image="/images/shakara-junction.jpeg"
          title=""
          description=""
          mobileHeight="h-[500px]"
        />
      </ul>
    </div>
  );
}

const GridItem = ({
  area,
  image,
  title,
  description,
  mobileHeight = "h-[400px]"
}: {
  area: string;
  image: string;
  title: string;
  description: string;
  mobileHeight?: string;
}) => {
  return (
    <li className={`list-none ${mobileHeight} md:h-auto ${area}`}>
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
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Gradient overlay for text readability - only if text exists */}
          {title && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
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
    </li>
  );
};
