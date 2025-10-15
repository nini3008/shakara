'use client';

import React from 'react';

export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </>
  );
}
