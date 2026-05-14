"use client";

import { ReadingRoute, HistoryCard } from "@/types";
import { useHistory } from "@/hooks/useHistory";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import { Compass, Map as MapIcon, Layers, Clock, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { Locale } from "@/lib/i18n-config";
import EnglishPilotBanner from "@/components/ui/EnglishPilotBanner";

interface RoutesClientProps {
  routes: ReadingRoute[];
  cards: HistoryCard[];
  locale: Locale;
  dictionary: any;
}

export default function RoutesClient({ routes, cards: allCards, locale, dictionary }: RoutesClientProps) {
  const { readIds } = useHistory();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (key: string) => dictionary.routes?.[key] || key;

  const routeStats = useMemo(() => {
    return routes.map(route => {
      const routeCards = allCards.filter(c => route.cardIds.includes(c.id));
      const completedCount = routeCards.filter(c => readIds.includes(c.id)).length;
      const totalReadingTime = routeCards.reduce((acc, c) => acc + c.readingTimeMinutes, 0);
      const progress = routeCards.length > 0 ? (completedCount / routeCards.length) * 100 : 0;
      
      return {
        ...route,
        completedCount,
        totalCards: routeCards.length,
        totalReadingTime,
        progress
      };
    });
  }, [routes, allCards, readIds]);

  const activeRoutes = useMemo(() => {
    if (!mounted) return [];
    return routeStats.filter(r => r.progress > 0 && r.progress < 100);
  }, [routeStats, mounted]);

  const recommendedRoutes = useMemo(() => {
    return routeStats.filter(r => !activeRoutes.find(ar => ar.id === r.id));
  }, [routeStats, activeRoutes]);

  return (
    <div className="bg-bg-main min-h-screen">
      <div className="px-6 max-w-lg mx-auto">
        <header className="mb-12 mt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Compass size={12} /> {t('learningJourneys')}
          </div>
          <h1 className="text-4xl font-serif text-neutral-950 mb-4 leading-tight">{dictionary.nav.routes}</h1>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-xs font-medium">
            {t('subtitle')}
          </p>
        </header>

        <EnglishPilotBanner locale={locale} />

        {mounted && activeRoutes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-3">
              {t('continueJourney')} <span className="flex-1 h-px bg-black/5"></span>
            </h2>
            <div className="space-y-4">
              {activeRoutes.map((route) => {
                const IconComponent = (LucideIcons as any)[route.icon] || LucideIcons.Map;
                return (
                  <Link key={route.id} href={`/${locale}/routes/${route.id}`} className="block group">
                    <div className="bg-neutral-950 rounded-3xl p-6 shadow-xl relative overflow-hidden active:scale-[0.98] transition-all">
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-brand-secondary border border-white/10">
                            <IconComponent size={20} strokeWidth={2} />
                          </div>
                          <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest bg-brand-secondary/10 px-2 py-1 rounded">
                            {locale === 'tr' ? `%${Math.round(route.progress)}` : `${Math.round(route.progress)}%`}
                          </span>
                        </div>
                        <h3 className="text-white text-xl font-serif mb-2">{route.title}</h3>
                        <div className="mt-6 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                          {t('continue')} <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="space-y-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-3">
            {t('allRoutes')} <span className="flex-1 h-px bg-black/5"></span>
          </h2>
          
          <div className="space-y-6">
            {recommendedRoutes.map((route) => {
              const IconComponent = (LucideIcons as any)[route.icon] || LucideIcons.Map;
              const isCompleted = mounted && route.progress === 100;

              return (
                <Link key={route.id} href={`/${locale}/routes/${route.id}`} className="block group">
                  <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm active:scale-[0.98] transition-all hover:shadow-md relative overflow-hidden">
                    {isCompleted && (
                      <div className="absolute top-4 right-4 text-green-500">
                        <CheckCircle2 size={20} />
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-black/5 ${isCompleted ? "bg-green-50 text-green-600" : "bg-neutral-50 text-neutral-400"}`}>
                        <IconComponent size={24} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-serif text-neutral-950 mb-1 group-hover:text-brand-secondary transition-colors">
                          {route.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-500 leading-relaxed mb-6 line-clamp-2">
                      {route.description}
                    </p>
                    
                    {isCompleted ? (
                      <div className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
                        {t('completed')} <Sparkles size={12} />
                      </div>
                    ) : (
                      <div className="text-[10px] font-black text-neutral-950 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {t('explore')} <ChevronRight size={14} />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
