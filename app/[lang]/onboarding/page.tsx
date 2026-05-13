"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Just redirect to home, the Onboarding component in layout.tsx 
    // will handle whether to show based on localStorage.
    router.replace("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-main">
      <div className="w-8 h-8 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
