"use client";

import React, { createContext, useContext, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type SurfaceMode = "website" | "app";

interface SurfaceContextType {
  mode: SurfaceMode;
  isApp: boolean;
  isWebsite: boolean;
}

const SurfaceContext = createContext<SurfaceContextType>({
  mode: "website",
  isApp: false,
  isWebsite: true,
});

export const useSurface = () => useContext(SurfaceContext);

function SurfaceInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<SurfaceMode>("website");

  useEffect(() => {
    const surfaceParam = searchParams.get("surface");
    
    if (surfaceParam === "app") {
      setMode("app");
      sessionStorage.setItem("surface_mode", "app");
    } else {
      const persisted = sessionStorage.getItem("surface_mode");
      if (persisted === "app") {
        setMode("app");
      } else {
        setMode("website");
      }
    }
  }, [searchParams]);

  const value = {
    mode,
    isApp: mode === "app",
    isWebsite: mode === "website",
  };

  return (
    <SurfaceContext.Provider value={value}>
      {children}
    </SurfaceContext.Provider>
  );
}

export function SurfaceProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <SurfaceInner>
        {children}
      </SurfaceInner>
    </Suspense>
  );
}
