'use client';

import React from 'react';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(10, 8, 15)" // Dark base with slight purple
        gradientBackgroundEnd="rgb(5, 5, 5)" // Very dark grey base
        firstColor="120, 40, 40" // Deep red
        secondColor="140, 60, 25" // Deep burnt orange
        thirdColor="150, 70, 30" // Muted orange
        fourthColor="130, 50, 20" // Deep burnt orange
        fifthColor="110, 35, 35" // Deep red
        pointerColor="140, 65, 30" // Warm accent
        size="50%"
        blendingValue="soft-light"
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
