"use client";

import React from "react";
import { InfiniteMovingSponsors } from "@/components/ui/infinite-moving-sponsors";

export function SponsorsWobbleSection() {
  return (
    <div className="min-h-[20rem] flex flex-col antialiased items-center justify-center relative overflow-hidden bg-slate-950 py-16">
      <div className="mb-12 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
          Our Partners
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-base">
          Proudly supported by leading brands who share our vision for celebrating African music and culture
        </p>
      </div>

      {/* Infinite Moving Cards for All Sponsors */}
      <InfiniteMovingSponsors
        items={allSponsors}
        direction="right"
        speed="slow"
        pauseOnHover={true}
      />
    </div>
  );
}

const allSponsors = [
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
