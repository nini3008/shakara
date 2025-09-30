'use client';

import React from 'react';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(108, 0, 162)" // Deep purple base
        gradientBackgroundEnd="rgb(0, 17, 82)" // Dark blue base
        firstColor="138, 43, 226" // Blue violet from logo
        secondColor="255, 20, 147" // Hot pink/magenta from logo
        thirdColor="0, 191, 255" // Bright cyan/blue from logo
        fourthColor="255, 165, 0" // Orange from logo
        fifthColor="50, 205, 50" // Lime green from logo
        pointerColor="255, 69, 0" // Red orange from logo
        size="80%"
        blendingValue="hard-light"
        interactive={true}
        containerClassName="fixed inset-0"
        className="absolute inset-0"
      />
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </>
  );
}
