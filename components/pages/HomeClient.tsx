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
import EnglishPilotBanner from "@/components/ui/EnglishPilotBanner";

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
          const blocks = deriveCardBlocks(card);
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

    // Priority 2: Fallback for English Pilot (Any Dossier with at least 1 card)
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
    <div className="px-6 pt-safe max-w-lg mx-auto pb-mobile-nav">
      <header className="mb-6 mt-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-1 font-serif text-neutral-950">{dictionary.common.brandingTitle}</h1>
          <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
            {dateString} • {dictionary.common.brandingSubtitle}
          </p>
        </div>
        <LanguageSwitch />
      </header>

      <EnglishPilotBanner locale={locale} />

      <DailyRealityCheck card={dailyCard} locale={locale} />

      {mounted && clientHistory.continueReading.length > 0 && (
        <ContinueReadingCarousel items={clientHistory.continueReading} />
      )}

      {featuredDossier && (
        <FeaturedDossier dossier={featuredDossier} locale={locale} />
      )}

      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
            <Map size={12} className="text-brand-secondary" /> {dictionary.nav.routes}
          </h2>
          <Link href={`/${locale}/routes`} className="text-[9px] font-black uppercase tracking-widest text-brand-secondary">
            {dictionary.common.seeAll}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {recommendedRoutes.map(route => {
            const Icon = (LucideIcons as any)[route.icon] || Map;
            return (
              <Link key={route.id} href={`/${locale}/routes/${route.id}`} className="bg-white p-5 rounded-4xl border border-black/5 shadow-sm active:scale-[0.98] transition-all flex items-center gap-5">
                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-brand-secondary shrink-0">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-neutral-900 leading-tight mb-2 line-clamp-1">{route.title}</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-secondary" style={{ width: `${route.progress * 100}%` }}></div>
                    </div>
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest tabular-nums">
                      {locale === 'tr' ? `%${Math.round(route.progress * 100)}` : `${Math.round(route.progress * 100)}%`}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <ThematicChips />

      <section className="mt-8 mb-8">
        <Link href={`/${locale}/explore`} className="w-full py-4 flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest text-[11px] text-white bg-neutral-950 active:scale-[0.98] transition-all shadow-xl">
          {dictionary.common.exploreLibrary} <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
