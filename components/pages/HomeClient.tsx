"use client";

import { useHistory } from "@/hooks/useHistory";
import HistoryCard from "@/components/ui/HistoryCard";
import { HistoryCard as IHistoryCard, ReadingRoute } from "@/types";
import { Map, ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { getStrongDossiers, getAllDossiers } from "@/utils/dossier";
import DailyRealityCheck from "@/components/ui/DailyRealityCheck";
import ContinueReadingCarousel from "@/components/ui/ContinueReadingCarousel";
import FeaturedDossier from "@/components/ui/FeaturedDossier";
import ThematicChips from "@/components/ui/ThematicChips";
import { deriveCardBlocks } from "@/utils/contentBlocks";
import { Locale } from "@/lib/i18n-config";
import ResponsivePageContainer from "@/components/layout/ResponsivePageContainer";
import { useSurface } from "@/components/utils/SurfaceProvider";

interface HomeClientProps {
  cards: IHistoryCard[];
  routes: ReadingRoute[];
  locale: Locale;
  dictionary: any;
  globalDailyId?: string;
}

import LanguageSwitch from "@/components/ui/LanguageSwitch";

export default function HomeClient({ cards: allCards, routes: allRoutes, locale, dictionary, globalDailyId }: HomeClientProps) {
  const { readIds } = useHistory();
  const { isWebsite } = useSurface();

  const [mounted, setMounted] = useState(false);
  const [clientHistory, setClientHistory] = useState<{
    continueReading: { card: IHistoryCard; progress: number }[];
  }>({ continueReading: [] });

  useEffect(() => {
    setMounted(true);

    const recent = localStorage.getItem("recent_cards");
    const read = localStorage.getItem("read_cards");
    const recentIds: string[] = recent ? JSON.parse(recent) : [];
    const readIdsLocal: string[] = read ? JSON.parse(read) : [];

    const progressItems = recentIds
      .filter(id => !readIdsLocal.includes(id))
      .map(id => {
        const card = allCards.find(c => c.id === id);
        if (!card) return null;

        const progressStr = localStorage.getItem(`progress_${id}`);

        // If it's a whitelisted card in recent but no progress recorded yet
        if (!progressStr) {
          return { card, progress: card.isFlagship ? 0 : 10 };
        }

        const step = parseInt(progressStr, 10);
        if (card.isFlagship) {
          const blocks = deriveCardBlocks(card, dictionary);
          const progress = Math.min(100, Math.max(10, Math.round(((step + 1) / blocks.length) * 100)));
          return { card, progress: progress === 100 ? 95 : progress };
        }

        return { card, progress: 50 };
      })
      .filter((item): item is { card: IHistoryCard; progress: number } => item !== null)
      .slice(0, 5);

    setClientHistory({ continueReading: progressItems });
  }, [allCards]);

  const dailyCard = useMemo(() => {
    // Priority 1: Same as Turkish Daily Card if translated
    if (globalDailyId) {
      const match = allCards.find(c => c.id === globalDailyId);
      if (match) return match;
    }

    // Priority 2: Seeded Candidate (Fallback)
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const candidates = allCards.filter(c => c.isFlagship || c.quickRealityCheck);
    if (candidates.length === 0) return allCards[0];
    const sortedCandidates = [...candidates].sort((a, b) => a.id.localeCompare(b.id));
    const index = dateSeed % sortedCandidates.length;
    return sortedCandidates[index];
  }, [allCards, globalDailyId]);

  const featuredDossier = useMemo(() => {
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Priority 1: Strong Dossiers (Multi-card)
    let dossiers = getStrongDossiers(allCards);

    // Priority 2: Fallback for English (Any Dossier with at least 1 card)
    if (dossiers.length === 0) {
      dossiers = getAllDossiers(allCards).filter(d => d.cardIds.length >= 1);
    }

    if (dossiers.length === 0) return null;
    const index = dateSeed % dossiers.length;
    return dossiers[index];
  }, [allCards]);

  const recommendedRoutes = useMemo(() => {
    const routeProgress = allRoutes.map(route => {
      const routeCards = allCards.filter(c => route.cardIds.includes(c.id));
      const completed = routeCards.filter(c => readIds.includes(c.id)).length;
      const progress = routeCards.length > 0 ? completed / routeCards.length : 0;
      return { ...route, progress, completed };
    });

    const sorted = [...routeProgress].sort((a, b) => {
      const aInProgress = a.progress > 0 && a.progress < 1;
      const bInProgress = b.progress > 0 && b.progress < 1;
      if (aInProgress && !bInProgress) return -1;
      if (!aInProgress && bInProgress) return 1;
      if (a.progress === 0 && b.progress === 1) return -1;
      if (a.progress === 1 && b.progress === 0) return 1;
      return 0;
    });

    return sorted.slice(0, 2);
  }, [allRoutes, allCards, readIds]);

  const dateString = new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  return (
    <ResponsivePageContainer className="pt-6">
      <header className="mb-12 mt-6 flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="archival-label opacity-60 flex items-center gap-2">
            <span className="w-5 h-px bg-current" />
            {locale === 'tr' ? 'Dijital Arşiv' : 'Digital Archive'}
            <span className="w-1 h-1 rounded-full bg-brand-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-950 tracking-tight leading-none">
            {dictionary.common.brandingTitle}
          </h1>
          <p className="archival-label flex items-center gap-2 text-neutral-800 font-bold">
            {dateString} <span className="opacity-40">|</span> {dictionary.common.brandingSubtitle}
          </p>
        </div>
        <div className="pt-3">
          <LanguageSwitch />
        </div>
      </header>



      {/* Primary Desktop Layout: Grid */}
      <div className={isWebsite ? "lg:grid lg:grid-cols-12 lg:gap-12" : "flex flex-col"}>
        
        {/* Left Column: Editorial Content */}
        <div className={isWebsite ? "lg:col-span-7 xl:col-span-8" : ""}>
          <DailyRealityCheck card={dailyCard} locale={locale} />
          
          <div className={isWebsite ? "hidden lg:block mt-12" : "hidden"}>
             <ThematicChips cards={allCards} />
          </div>
        </div>

        {/* Right Column: Progress & Featured Sidebar */}
        <div className={isWebsite ? "lg:col-span-5 xl:col-span-4 space-y-12" : "space-y-4"}>
          {mounted && clientHistory.continueReading.length > 0 && (
            <ContinueReadingCarousel items={clientHistory.continueReading} />
          )}

          {featuredDossier && (
            <FeaturedDossier dossier={featuredDossier} locale={locale} />
          )}

          {/* Secondary Mobile Content: Thematic Chips & Routes (moved below hero on desktop) */}
          <div className={isWebsite ? "lg:hidden" : ""}>
            <ThematicChips cards={allCards} />
          </div>

          <section className="mb-10">
            <div className="flex justify-between items-end mb-5 px-1">
              <div className="flex flex-col gap-1">
                <h2 className="archival-label flex items-center gap-2 text-neutral-900!">
                  <Map size={12} className="text-brand-secondary" />
                  {dictionary.nav.routes}
                </h2>
                <div className="h-px w-8 bg-brand-secondary/40" />
              </div>
              <Link href={`/${locale}/routes`} className="archival-label text-brand-secondary! hover:underline transition-all">
                {dictionary.common.seeAll}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {recommendedRoutes.map(route => {
                const Icon = (LucideIcons as any)[route.icon] || Map;
                return (
                  <Link key={route.id} href={`/${locale}/routes/${route.id}`} className="bg-white p-5 rounded-3xl archival-border-double shadow-sm active:scale-[0.98] transition-all flex items-center gap-5 border-black/5">
                    <div className="w-12 h-12 archival-muted-bg rounded-2xl flex items-center justify-center text-brand-secondary shrink-0 archival-border-double border-black/5">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-neutral-900 leading-tight mb-2.5 line-clamp-1">{route.title}</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-secondary" style={{ width: `${route.progress * 100}%` }}></div>
                        </div>
                        <span className="archival-label tabular-nums opacity-60">
                          {locale === 'tr' ? `%${Math.round(route.progress * 100)}` : `${Math.round(route.progress * 100)}%`}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <section className="mt-10 mb-16 border-t border-black/5 pt-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="archival-label opacity-40 uppercase tracking-[0.3em]">
             {locale === 'tr' ? 'Arşivi Derinlemesine Keşfedin' : 'Deeply Explore the Archive'}
          </div>
          <Link href={`/${locale}/explore`} className="inline-flex px-12 py-5 items-center justify-center gap-4 rounded-2xl archival-label text-white! bg-neutral-950 active:scale-[0.98] transition-all shadow-2xl hover:bg-neutral-900 group">
            {dictionary.common.exploreLibrary} <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </ResponsivePageContainer>
  );
}
