"use client";

import { useHistory } from "@/hooks/useHistory";
import { HistoryCard } from "@/types";
import { Locale } from "@/lib/i18n-config";
import HistoryCardComponent from "@/components/ui/HistoryCard";
import Link from "next/link";
import { Bookmark, Clock, CheckCircle2 } from "lucide-react";
import EnglishPilotBanner from "@/components/ui/EnglishPilotBanner";
import FeedbackCard from "@/components/ui/FeedbackCard";

export default function SavedClient({ 
  allCards, 
  locale,
  dictionary 
}: { 
  allCards: HistoryCard[];
  locale: Locale;
  dictionary: any;
}) {
  const { savedIds, recentIds, readIds } = useHistory();

  const savedCards = allCards.filter((c) => savedIds.includes(c.id));
  const recentCards = allCards.filter((c) => recentIds.includes(c.id));
  const readCards = allCards.filter((c) => readIds.includes(c.id));

  const t = (key: string) => dictionary.saved?.[key] || key;
  const isGlobalEmpty = savedCards.length === 0 && recentCards.length === 0 && readCards.length === 0;

  return (
    <div className="px-6 max-w-lg mx-auto">
      <header className="mb-10 mt-6">
        <h1 className="text-3xl mb-2 font-serif">{t('title')}</h1>
        <p className="text-gray-400 font-medium text-sm">{t('subtitle')}</p>
      </header>

      <EnglishPilotBanner locale={locale} />

      {isGlobalEmpty ? (
        <section className="mb-12 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white border border-black/5 rounded-5xl p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full -mr-16 -mt-16" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-brand-secondary/10 rounded-3xl flex items-center justify-center text-brand-secondary mx-auto mb-8">
                <Bookmark size={40} strokeWidth={1.5} />
              </div>
              
              <h2 className="text-2xl font-serif text-neutral-950 mb-4 px-4">
                {t('globalEmptyTitle')}
              </h2>
              
              <p className="text-neutral-500 font-medium text-sm leading-relaxed mb-10 max-w-xs mx-auto">
                {t('globalEmptyDesc')}
              </p>
              
              <div className="flex flex-col gap-3">
                <Link 
                  href={`/${locale}`} 
                  className="w-full py-5 rounded-2xl bg-neutral-950 text-white font-black uppercase tracking-widest text-[11px] shadow-xl active:scale-95 transition-all"
                >
                  {t('globalEmptyPrimaryCta')}
                </Link>
                
                <Link 
                  href={`/${locale}/explore`} 
                  className="w-full py-4 rounded-2xl bg-brand-secondary/5 text-brand-secondary font-black uppercase tracking-widest text-[10px] border border-brand-secondary/10 active:scale-95 transition-all"
                >
                  {t('globalEmptySecondaryCta')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="text-lg font-serif mb-6 flex items-center gap-2">
              <Bookmark size={18} className="text-brand-secondary" /> {t('savedItems')}
            </h2>
            {savedCards.length > 0 ? (
              <div className="space-y-4">
                {savedCards.map((card) => (
                  <HistoryCardComponent key={card.id} card={card} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-black/5 rounded-4xl p-10 text-center shadow-sm">
                <Bookmark size={40} className="mx-auto text-neutral-300 mb-4" />
                <p className="text-neutral-500 font-medium text-sm mb-6">
                  {t('emptySavedDesc')}
                </p>
                <Link href={`/${locale}/explore`} className="inline-block text-brand-secondary text-[10px] font-black uppercase tracking-widest bg-brand-secondary/5 px-6 py-3 rounded-xl border border-brand-secondary/10 active:scale-95 transition-all">
                  {t('startExploring')}
                </Link>
              </div>
            )}
          </section>

          <section className="mb-12">
            <h2 className="text-lg font-serif mb-6 flex items-center gap-2">
              <Clock size={18} className="text-brand-secondary" /> {t('recentlyViewed')}
            </h2>
            {recentCards.length > 0 ? (
              <div className="space-y-4">
                {recentCards.map((card) => (
                  <HistoryCardComponent key={card.id} card={card} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-4xl p-8 text-center">
                <p className="text-neutral-400 font-medium text-sm">
                  {t('emptyRecentDesc')}
                </p>
              </div>
            )}
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-serif mb-6 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-brand-secondary" /> {t('completed')}
            </h2>
            {readCards.length > 0 ? (
              <div className="space-y-4">
                {readCards.map((card) => (
                  <HistoryCardComponent key={card.id} card={card} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-black/5 rounded-4xl p-10 text-center shadow-sm">
                <CheckCircle2 size={40} className="mx-auto text-neutral-300 mb-4" />
                <p className="text-neutral-500 font-medium text-sm mb-6">
                  {t('emptyCompletedDesc')}
                </p>
                <Link href={`/${locale}`} className="inline-block text-brand-secondary text-[10px] font-black uppercase tracking-widest bg-brand-secondary/5 px-6 py-3 rounded-xl border border-brand-secondary/10 active:scale-95 transition-all">
                  {t('startFirstStory')}
                </Link>
              </div>
            )}
          </section>
        </>
      )}

      <FeedbackCard dictionary={dictionary} locale={locale} />
    </div>
  );
}
