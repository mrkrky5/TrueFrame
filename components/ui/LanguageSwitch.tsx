"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n-config";
import { Languages } from "lucide-react";

export default function LanguageSwitch() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/");
  const currentLocale = (i18n.locales.includes(segments[1] as any) ? segments[1] : i18n.defaultLocale) as Locale;

  const toggleLocale = () => {
    const nextLocale = currentLocale === "tr" ? "en" : "tr";
    
    // Persist preference via cookie (1 year expiry)
    document.cookie = `preferred-locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    const nextPathname = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
    router.push(nextPathname);
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-[10px] font-black uppercase tracking-widest text-neutral-600 active:scale-95 transition-all shadow-sm"
    >
      <Languages size={14} className="text-brand-secondary" />
      {currentLocale === "tr" ? "TR" : "EN"}
    </button>
  );
}
