"use client";

import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";

export function LineupWobbleSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mx-auto w-full">
      {/* Day 1 Card */}
      <WobbleCard
        containerClassName="col-span-1 h-full min-h-[350px] relative overflow-hidden bg-cover bg-center bg-no-repeat"
        className="bg-[url('/images/lineup/line-up-day-1.jpeg')]">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white drop-shadow-lg">
            Day 1: Opening Night Spectacular
          </h2>
          <p className="mt-4 text-left text-base/6 text-white/90 drop-shadow-md">
            Experience the grand opening with incredible Afrobeats, Amapiano, and traditional Nigerian sounds that will set the tone for an unforgettable festival.
          </p>
        </div>
      </WobbleCard>
      
      {/* Day 2 Card */}
      <WobbleCard
        containerClassName="col-span-1 h-full min-h-[350px] relative overflow-hidden bg-cover bg-center bg-no-repeat"
        className="bg-[url('/images/lineup/line-up-day-2.jpeg')]">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white drop-shadow-lg">
            Day 2: Peak Energy
          </h2>
          <p className="mt-4 text-left text-base/6 text-white/90 drop-shadow-md">
            The heart of the festival with non-stop performances, cultural showcases, and the biggest names in African music.
          </p>
        </div>
      </WobbleCard>
      
      {/* Day 3 Card */}
      <WobbleCard
        containerClassName="col-span-1 h-full min-h-[350px] relative overflow-hidden bg-cover bg-center bg-no-repeat"
        className="bg-[url('/images/lineup/line-up-day-3.jpeg')]">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white drop-shadow-lg">
            Day 3: Grand Finale Weekend
          </h2>
          <p className="mt-4 text-left text-base/6 text-white/90 drop-shadow-md">
            Close out the festival with explosive performances, special collaborations, and memories that will last a lifetime under the Lagos skyline.
          </p>
        </div>
      </WobbleCard>
      
      {/* Day 4 Card */}
      <WobbleCard
        containerClassName="col-span-1 h-full min-h-[350px] relative overflow-hidden bg-cover bg-center bg-no-repeat"
        className="bg-[url('/images/lineup/line-up-day-4.jpeg')]">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white drop-shadow-lg">
            Day 4: After Party Vibes
          </h2>
          <p className="mt-4 text-left text-base/6 text-white/90 drop-shadow-md">
            Keep the energy flowing with intimate sets, DJ sessions, and exclusive after-party experiences that extend the celebration.
          </p>
        </div>
      </WobbleCard>
    </div>
  );
}
