"use client";

import { useState, useEffect, useMemo } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Play, RotateCcw, ChevronRight, Layers, Sparkles } from "lucide-react";
import { getDossierBySlug, getStrongDossiers, MediaDossier } from "@/utils/dossier";
import { AccuracyType, HistoryCard } from "@/types";
import { Locale } from "@/lib/i18n-config";
import HistoryCardComponent from "@/components/ui/HistoryCard";
import { formatMediaType, formatAccuracyType, formatTag } from "@/utils/format";
import ShareButton from "@/components/ui/ShareButton";
import { useHistory } from "@/hooks/useHistory";

export default function MediaDossierClient({ 
  initialDossier, 
  allCards, 
  locale,
  dictionary 
}: { 
  initialDossier: MediaDossier;
  allCards: HistoryCard[];
  locale: Locale;
  dictionary: any;
}) {
  const { readIds, isRead } = useHistory();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const derivedValueProp = useMemo(() => {
    const tags = initialDossier.topTags.slice(0, 2).map(t => formatTag(t, dictionary)).join(locale === 'tr' ? " ve " : " and ");
    const typeLabel = formatMediaType(initialDossier.mediaType, dictionary);
    return locale === 'tr' 
      ? `Bu dosya, ${initialDossier.title} ${typeLabel.toLowerCase()} yapımının arkasındaki ${tags.toLowerCase()} gerçeklerini ve tarihin nasıl kurgulandığını inceler.`
      : `This dossier explores the ${tags} truths behind ${initialDossier.title} and how history was dramatized in this ${typeLabel.toLowerCase()}.`;
  }, [initialDossier, locale]);

  const progress = useMemo(() => {
    if (!mounted) return { completed: 0, total: 0, percentage: 0 };
    const completed = initialDossier.cardIds.filter(id => readIds.includes(id)).length;
    const total = initialDossier.cardIds.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  }, [initialDossier, readIds, mounted]);

  const recommendedCard = useMemo(() => {
    // Priority: Unread Flagship > Unread Standard > First card
    const unreadFlagships = initialDossier.cards.filter(c => c.isFlagship && !readIds.includes(c.id));
    if (unreadFlagships.length > 0) return unreadFlagships[0];

    const unreadStandard = initialDossier.cards.filter(c => !c.isFlagship && !readIds.includes(c.id));
    if (unreadStandard.length > 0) return unreadStandard[0];

    return initialDossier.cards.find(c => c.isFlagship) || initialDossier.cards[0];
  }, [initialDossier, readIds]);

  const relatedDossiers = useMemo(() => {
    const strongOnes = getStrongDossiers(allCards);
    return strongOnes
      .filter(d => d.slug !== initialDossier.slug && (d.mediaType === initialDossier.mediaType || d.topTags.some(t => initialDossier.topTags.includes(t))))
      .slice(0, 3);
  }, [initialDossier, allCards]);

  const flagshipCards = initialDossier.cards.filter(c => c.isFlagship);
  const standardCards = initialDossier.cards.filter(c => !c.isFlagship);

  return (
    <div className="bg-bg-main min-h-screen pb-mobile-nav">
      <div
        className={`fixed top-0 left-0 right-0 z-60 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm opacity-100" : "bg-transparent opacity-0"}`}
        style={{ height: 'calc(env(safe-area-inset-top, 20px) + 72px)' }}
      />

      <header className="fixed top-0 left-0 right-0 z-70 pointer-events-none pt-safe">
        <div className="px-6 py-4 flex justify-between items-center max-w-lg mx-auto pointer-events-auto">
          <Link href={`/${locale}/explore`} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-black/5 flex items-center justify-center text-neutral-950 active:scale-95 transition-transform shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <ShareButton
            title={`${initialDossier.title} | ${dictionary.common.brandingTitle}`}
            text={derivedValueProp}
            className="w-10! h-10! bg-white/80 backdrop-blur-md shadow-sm"
          />
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        <section className="pt-24 pb-8 px-6 text-center border-b border-black/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-brand-secondary/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black/5 text-brand-secondary rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
              <Layers size={12} /> {formatMediaType(initialDossier.mediaType, dictionary)} {dictionary.common.dossierHeader}
            </div>
            <h1 className="text-4xl font-serif text-neutral-950 mb-6 leading-tight px-4">
              {initialDossier.title}
            </h1>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs mx-auto mb-10 font-medium">
              {derivedValueProp}
            </p>
            <div className="max-w-[280px] mx-auto bg-white rounded-3xl p-5 border border-black/5 shadow-xl">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  {dictionary.common.dossierProgress}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">
                  {mounted ? progress.percentage : 0}%
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-50 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-brand-secondary transition-all duration-1000 ease-out"
                  style={{ width: `${mounted ? progress.percentage : 0}%` }}
                />
              </div>
              <div className="text-[11px] font-bold text-neutral-600 uppercase tracking-tight">
                {mounted ? (
                  progress.completed === progress.total 
                    ? dictionary.common.dossierCompleted 
                    : `${progress.completed} / ${progress.total} ${progress.total === 1 ? dictionary.common.cardRead : dictionary.common.cardsRead}`
                ) : dictionary.common.loading}
              </div>
            </div>
          </div>
        </section>

        {recommendedCard && (
          <section className="px-6 -mt-8 mb-12 relative z-20">
            <div className="bg-neutral-950 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/20 blur-3xl -mr-16 -mt-16 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-brand-secondary mb-3">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {dictionary.common.nextStep}
                  </span>
                </div>
                <h3 className="text-white text-xl font-serif mb-2">{recommendedCard.title}</h3>
                <p className="text-neutral-400 text-xs mb-6 line-clamp-2 leading-relaxed">
                  {recommendedCard.subtitle}
                </p>
                <Link
                  href={`/${locale}/card/${recommendedCard.id}`}
                  className="inline-flex items-center gap-3 bg-white text-neutral-950 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                >
                  {isRead(recommendedCard.id) ? (
                    <><RotateCcw size={16} /> {dictionary.common.readAgain}</>
                  ) : (
                    <><Play size={16} fill="currentColor" /> {progress.completed > 0 ? dictionary.common.continueJourney : dictionary.common.startJourney}</>
                  )}
                </Link>
              </div>
            </div>
          </section>
        )}

        <div className="px-6 space-y-10 mb-16">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-3">
              {dictionary.common.realityAnalysis} <span className="flex-1 h-px bg-black/5"></span>
            </h2>
            <div className="bg-white rounded-4xl p-6 border border-black/5 shadow-sm space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="text-2xl font-serif text-neutral-950">{initialDossier.cards.length}</div>
                  <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <BookOpen size={10} /> {initialDossier.cards.length === 1 ? dictionary.common.cardCount : dictionary.common.cardsCount}
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-2xl font-serif text-neutral-950">{initialDossier.totalReadingTime} {dictionary.common.minutes}</div>
                  <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <Clock size={10} /> {dictionary.common.totalTime}
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-neutral-50">
                {Object.entries(initialDossier.accuracyDistribution).map(([type, count]) => {
                  if (count === 0) return null;
                  const percentage = Math.round((count / initialDossier.cardIds.length) * 100);
                  return (
                    <div key={type} className="space-y-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-neutral-600 uppercase tracking-tight">{formatAccuracyType(type as AccuracyType, dictionary)}</span>
                        <span className="text-[10px] font-bold text-neutral-400">{percentage}%</span>
                      </div>
                      <div className="h-1 w-full bg-neutral-50 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${type === "real" ? "bg-green-500" :
                            type === "fictionalized" ? "bg-red-500" :
                              type === "partly-real" ? "bg-blue-500" : "bg-amber-500"
                            }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {flagshipCards.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-3">
                {dictionary.common.deepDossiers} <span className="flex-1 h-px bg-black/5"></span>
              </h2>
              <div className="space-y-4">
                {flagshipCards.map((card) => (
                  <HistoryCardComponent key={card.id} card={card} variant="full" />
                ))}
              </div>
            </section>
          )}

          {standardCards.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-3">
                {dictionary.common.quickDiscoveries} <span className="flex-1 h-px bg-black/5"></span>
              </h2>
              <div className="space-y-4">
                {standardCards.map((card) => (
                  <HistoryCardComponent key={card.id} card={card} variant="compact" />
                ))}
              </div>
            </section>
          )}

          {relatedDossiers.length > 0 && (
            <section className="pt-10 border-t border-black/5">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-8 text-center">
                {dictionary.common.exploreSimilarDossiers}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {relatedDossiers.map((rd) => (
                  <Link
                    key={rd.slug}
                    href={`/${locale}/media/${rd.slug}`}
                    className="flex items-center justify-between p-6 bg-white border border-black/5 rounded-3xl active:scale-[0.98] transition-all shadow-sm group"
                  >
                    <div>
                      <span className="text-[9px] font-black text-brand-secondary uppercase tracking-widest block mb-1">
                        {formatMediaType(rd.mediaType, dictionary)}
                      </span>
                      <h4 className="text-lg font-serif text-neutral-950">{rd.title}</h4>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1">
                        {rd.cardIds.length} {rd.cardIds.length === 1 ? dictionary.common.cardCount : dictionary.common.cardsCount} • {rd.flagshipCount} {locale === 'en' ? (rd.flagshipCount === 1 ? dictionary.common.flagshipCountLabel : dictionary.common.flagshipsCountLabel) : dictionary.common.flagship}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-950 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
