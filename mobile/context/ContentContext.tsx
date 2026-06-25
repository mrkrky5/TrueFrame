import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLocale } from "@/context/LocaleContext";
import {
  getCards,
  isFullCatalogLoaded,
  preloadCatalog,
} from "@shared/content";
import type { HistoryCard } from "../../types/index";
import type { Locale } from "@shared/i18n";

type ContentContextValue = {
  catalogReady: boolean;
  catalogVersion: number;
  ensureCatalog: (locale?: Locale) => Promise<HistoryCard[]>;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { locale, localeReady } = useLocale();
  const [readyLocales, setReadyLocales] = useState<Partial<Record<Locale, boolean>>>({});
  const [catalogVersion, setCatalogVersion] = useState(0);

  const markReady = useCallback((loc: Locale) => {
    setReadyLocales((prev) => {
      if (prev[loc]) return prev;
      return { ...prev, [loc]: true };
    });
    setCatalogVersion((v) => v + 1);
  }, []);

  const ensureCatalog = useCallback(
    async (loc?: Locale) => {
      const target = loc ?? locale;
      const cards = await preloadCatalog(target);
      markReady(target);
      return cards;
    },
    [locale, markReady]
  );

  useEffect(() => {
    if (!localeReady) return;
    void ensureCatalog(locale);
  }, [locale, localeReady, ensureCatalog]);

  const catalogReady = Boolean(readyLocales[locale] ?? isFullCatalogLoaded(locale));

  const value = useMemo<ContentContextValue>(
    () => ({
      catalogReady,
      catalogVersion,
      ensureCatalog,
    }),
    [catalogReady, catalogVersion, ensureCatalog]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent requires ContentProvider");
  return ctx;
}

/** Card list for active locale; updates when lazy catalog finishes loading. */
export function useCards(): HistoryCard[] {
  const { locale } = useLocale();
  const { catalogVersion } = useContent();
  return useMemo(() => getCards(locale), [locale, catalogVersion]);
}
