"use client";

import React from "react";
import { InfiniteMovingSponsors } from "@/components/ui/infinite-moving-sponsors";

export function SponsorsMovingSection() {
  return (
    <div className="min-h-[16rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden bg-slate-950 py-12">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center gradient-text mb-2">
          Our Partners
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm">
          Proudly supported by leading brands who share our vision for celebrating African music and culture
        </p>
      </div>
      <InfiniteMovingSponsors 
        items={sponsors} 
        direction="right" 
        speed="slow" 
        pauseOnHover={true}
      />
    </div>
  );
}

const sponsors = [
  {
    name: "Flutterwave",
    logo: "/images/partners/Flutterwave-Logo.png"
  },
  {
    name: "Glenfiddich",
    logo: "/images/partners/Glenfiddich-logo.png"
  },
  {
    name: "GTBank", 
    logo: "/images/partners/GTBank_logo.svg.png"
  },
  {
    name: "TDA Couture",
    logo: "/images/partners/tda-couture-logo.png.webp"
  },
];
