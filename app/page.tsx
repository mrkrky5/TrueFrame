"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    // 1. Check for manual preference cookie
    const match = document.cookie.match(new RegExp('(^| )preferred-locale=([^;]+)'));
    const savedLocale = match ? match[2] : null;
    
    if (savedLocale && (savedLocale === 'tr' || savedLocale === 'en')) {
      router.replace(`/${savedLocale}`);
      return;
    }
    
    // 2. Check browser/device language
    const isTurkish = navigator.language.toLowerCase().startsWith('tr');
    router.replace(isTurkish ? '/tr' : '/en');
  }, [router]);
  
  return null;
}
