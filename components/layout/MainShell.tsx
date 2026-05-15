"use client";

import React from "react";
import { useSurface } from "@/components/utils/SurfaceProvider";

export default function MainShell({ children }: { children: React.ReactNode }) {
  const { isApp } = useSurface();

  // APP MODE: Fixed shell with internal scroll (current behavior)
  if (isApp) {
    return (
      <div className="app-shell">
        <div className="top-system-safe-area" />
        <main className="app-scroll-area">
          {children}
        </main>
      </div>
    );
  }

  // WEBSITE MODE: Standard document scroll, fluid layout
  return (
    <div className="website-shell min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
