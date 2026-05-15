"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Map, Bookmark } from "lucide-react";
import { i18n, type Locale } from "@/lib/i18n-config";
import { useDictionary } from "@/components/utils/DictionaryProvider";
import { useSurface } from "@/components/utils/SurfaceProvider";

export default function BottomNav() {
  const pathname = usePathname();
  const dictionary = useDictionary();
  const [shouldHide, setShouldHide] = useState(false);

  // Extract locale from pathname
  const segments = pathname.split("/");
  const locale = (i18n.locales.includes(segments[1] as any) ? segments[1] : i18n.defaultLocale) as Locale;

  useEffect(() => {
    const checkHide = () => {
      setShouldHide(document.body.classList.contains("hide-main-nav"));
    };
    checkHide();
    const observer = new MutationObserver(checkHide);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: "home", label: dictionary.nav.home, path: `/${locale}`, icon: <Home size={20} /> },
    { id: "explore", label: dictionary.nav.explore, path: `/${locale}/explore`, icon: <Compass size={20} /> },
    { id: "routes", label: dictionary.nav.routes, path: `/${locale}/routes`, icon: <Map size={20} /> },
    { id: "saved", label: dictionary.nav.saved, path: `/${locale}/saved`, icon: <Bookmark size={20} /> },
  ];

  const { isApp } = useSurface();

  if (shouldHide) {
    return null;
  }

  // Hide on desktop viewports in Website Mode
  const visibilityClasses = isApp ? "fixed" : "fixed md:hidden";

  return (
    <nav className={`${visibilityClasses} bottom-0 left-0 right-0 z-60 bg-white/80 backdrop-blur-xl border-t border-black/5 animate-in slide-in-from-bottom duration-500 pb-[env(safe-area-inset-bottom,20px)]`}>
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== `/${locale}` && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? "text-brand-secondary scale-110 font-bold" : "text-neutral-400"
                }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-brand-secondary rounded-full animate-pulse" />
                )}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tight mt-1 transition-colors ${isActive ? "text-brand-secondary" : "text-neutral-400"
                }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

