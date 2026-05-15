"use client";

import React from "react";
import { useSurface } from "@/components/utils/SurfaceProvider";

interface ResponsivePageContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "prose";
  className?: string;
}

export default function ResponsivePageContainer({ 
  children, 
  maxWidth = "7xl", 
  className = "" 
}: ResponsivePageContainerProps) {
  const { isApp } = useSurface();

  // If in App Mode, we force the mobile constraints
  if (isApp) {
    return (
      <div className={`px-6 max-w-lg mx-auto ${className}`}>
        {children}
      </div>
    );
  }

  // In Website Mode, we use a more fluid responsive container
  const maxWidthClass = {
    "sm": "max-w-sm",
    "md": "max-w-md",
    "lg": "max-w-lg",
    "xl": "max-w-xl",
    "2xl": "max-w-2xl",
    "7xl": "max-w-7xl",
    "prose": "max-w-(--breakpoint-md)", // Balanced editorial width
  }[maxWidth];

  return (
    <div className={`${maxWidthClass} mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
}
