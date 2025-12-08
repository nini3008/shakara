"use client";

import React, { useRef } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Artist } from "@/types";
import { SanityArtist } from "@/types/sanity-adapters";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";

interface LineupGlowingSectionProps {
  featuredArtists: { artist: Artist; sanityArtist: SanityArtist }[];
}

export function LineupGlowingSection({ featuredArtists }: LineupGlowingSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 320;
    const newScrollLeft = carouselRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
    carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4">
      {/* Featured Artists Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-8">
        Featured Artists
      </h2>
      
      <div className="relative group">
        <button
          onClick={() => scrollCarousel('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 md:opacity-100 -translate-x-1/2 shadow-lg border border-white/10 backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scrollCarousel('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 md:opacity-100 translate-x-1/2 shadow-lg border border-white/10 backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredArtists.map(({ artist, sanityArtist }) => (
            <div key={artist.id} className="snap-start flex-shrink-0 w-[280px] md:w-[320px]">
              <Link 
                href={`/lineup#${
                  artist.performanceWindow === 'afterDark' ? 'afterDark' :
                  artist.roles?.includes('dj') ? 'dj' :
                  artist.roles?.includes('speaker') ? 'speaker' :
                  'livePerformance'
                }`}
              >
                <GridItem
                  image={sanityArtist.image ? urlFor(sanityArtist.image).width(600).height(800).url() : ''}
                  title={artist.name}
                  description={artist.genre || ''}
                  cardHeight="h-[400px]"
                />
              </Link>
            </div>
          ))}

          {featuredArtists.length === 0 && (
            <div className="w-full text-center text-white/60 py-12">
              Lineup announcements coming soon!
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-12">
        <Link
          href="/lineup"
          className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition-all"
        >
          View Full Lineup
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
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
    <div className={`${cardHeight} w-full`}>
      <div className="relative h-full rounded-2xl border border-gray-800 p-2 md:rounded-3xl md:p-3 group">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          variant="default"
        />
        <div className="relative h-full overflow-hidden rounded-xl">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
              <span className="text-6xl font-bold text-white/10">{title.charAt(0)}</span>
            </div>
          )}
          
          {/* Enhanced overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-sans text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg mb-2">
              {title}
            </h3>
            {description && (
              <p className="font-sans text-sm md:text-base text-orange-400 font-medium tracking-wide uppercase">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
