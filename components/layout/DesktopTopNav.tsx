"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Map, Bookmark } from "lucide-react";
import { Locale } from "@/lib/i18n-config";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import { useSurface } from "@/components/utils/SurfaceProvider";

interface DesktopTopNavProps {
  locale: Locale;
  dictionary: any;
}

export default function DesktopTopNav({ locale, dictionary }: DesktopTopNavProps) {
  const pathname = usePathname();
  const { isApp } = useSurface();

  // Hidden in App Mode or Mobile viewports
  if (isApp) return null;

  const navItems = [
    { id: "home", label: dictionary.nav.home, path: `/${locale}`, icon: <Home size={16} /> },
    { id: "explore", label: dictionary.nav.explore, path: `/${locale}/explore`, icon: <Compass size={16} /> },
    { id: "routes", label: dictionary.nav.routes, path: `/${locale}/routes`, icon: <Map size={16} /> },
    { id: "saved", label: dictionary.nav.saved, path: `/${locale}/saved`, icon: <Bookmark size={16} /> },
  ];

  return (
    <nav className="hidden md:block sticky top-0 z-100 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href={`/${locale}`} className="text-lg font-serif font-black tracking-tight text-neutral-950">
            {dictionary.common.brandingTitle}
          </Link>
          
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== `/${locale}` && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    isActive ? "text-brand-secondary" : "text-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitch />
        </div>
      </div>
    </nav>
  );
}
