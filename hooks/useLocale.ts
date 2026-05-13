"use client";

import { usePathname } from "next/navigation";
import { i18n, Locale } from "@/lib/i18n-config";

export const useLocale = (): Locale => {
  const pathname = usePathname();
  if (!pathname) return i18n.defaultLocale;
  const segments = pathname.split("/");
  const locale = segments[1] as Locale;
  return i18n.locales.includes(locale) ? locale : i18n.defaultLocale;
};
