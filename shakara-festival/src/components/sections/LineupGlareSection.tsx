"use client";

import React from "react";
import { GlareCard } from "@/components/ui/glare-card";

export function LineupGlareSection() {
  return (
    <div className="columns-1 md:columns-2 gap-0 max-w-full mx-auto w-full">
      {lineupDays.map((day, idx) => (
        <GlareCard key={day.title || `card-${idx}`} className="flex flex-col items-start justify-end p-8 break-inside-avoid w-full" style={{ minHeight: day.height || '400px' }}>
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${day.image})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#1e1e1e'
            }}
          />
          {/* Subtle gradient overlay at bottom for text readability - only if text exists */}
          {day.title && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>}
          
          {day.title && (
            <div className="relative z-20">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                {day.title}
              </h3>
              {day.description && (
                <p className="text-white/90 text-base leading-relaxed drop-shadow-md">
                  {day.description}
                </p>
              )}
            </div>
          )}
        </GlareCard>
      ))}
    </div>
  );
}

const lineupDays = [
  {
    title: "Day 1: Opening Night Spectacular",
    description: "Experience the grand opening with incredible Afrobeats, Amapiano, and traditional Nigerian sounds that will set the tone for an unforgettable festival.",
    image: "/images/lineup/line-up-day-1.jpeg",
    height: "500px"
  },
  {
    title: "Day 2: Peak Energy",
    description: "The heart of the festival with non-stop performances, cultural showcases, and the biggest names in African music.",
    image: "/images/lineup/line-up-day-2.jpeg",
    height: "450px"
  },
  {
    title: "Day 3: Grand Finale Weekend", 
    description: "Close out the festival with explosive performances, special collaborations, and memories that will last a lifetime under the Lagos skyline.",
    image: "/images/lineup/line-up-day-3.jpeg",
    height: "480px"
  },
  {
    title: "Day 4: After Party Vibes",
    description: "Keep the energy flowing with intimate sets, DJ sessions, and exclusive after-party experiences that extend the celebration.",
    image: "/images/lineup/line-up-day-4.jpeg",
    height: "420px"
  },
  {
    title: "", // No text for Shakara Junction - last card
    description: "",
    image: "/images/shakara-junction.jpeg",
    height: "550px"
  }
];
