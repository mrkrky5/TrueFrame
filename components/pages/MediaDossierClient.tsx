"use client";

import { useState, useEffect, useMemo } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Clock, Play, RotateCcw, ChevronRight, Layers, Sparkles } from "lucide-react";
import { getDossierBySlug, getStrongDossiers, MediaDossier } from "@/utils/dossier";
import { AccuracyType, HistoryCard } from "@/types";
import { Locale } from "@/lib/i18n-config";
import HistoryCardComponent from "@/components/ui/HistoryCard";
import { formatMediaType, formatAccuracyType, formatTag } from "@/utils/format";
import ShareButton from "@/components/ui/ShareButton";
import { useHistory } from "@/hooks/useHistory";
import ResponsivePageContainer from "@/components/layout/ResponsivePageContainer";
import { useSurface } from "@/components/utils/SurfaceProvider";

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
  const { isWebsite } = useSurface();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = (e: Event) => {
      const target = e.target as any;
      const scrollTop = (target === document || target === window || target === document.documentElement || target === document.body)
        ? window.scrollY 
        : target.scrollTop;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
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
    <div className="bg-bg-main min-h-screen">
      <div
        className={`fixed top-0 left-0 right-0 z-60 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm opacity-100" : "bg-transparent opacity-0"}`}
        style={{ height: 'calc(env(safe-area-inset-top, 20px) + 72px)' }}
      />

      <header className="detail-floating-controls-safe">
        <div className={`px-6 flex justify-between items-center pointer-events-auto h-16 ${isWebsite ? "max-w-7xl mx-auto" : "max-w-lg mx-auto"}`}>
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

      <main>
        <ResponsivePageContainer className={`pt-24 pb-12 text-center border-b border-black/5 relative overflow-hidden ${isWebsite ? "min-h-[40vh] flex flex-col justify-center" : ""}`}>
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-brand-secondary/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black/5 text-brand-secondary rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
              <Layers size={12} /> {formatMediaType(initialDossier.mediaType, dictionary)} {dictionary.common.dossierHeader}
            </div>
            <h1 className={`font-serif text-neutral-950 mb-6 leading-tight px-4 ${isWebsite ? "text-6xl" : "text-4xl"}`}>
              {initialDossier.title}
            </h1>
            <p className={`text-neutral-500 leading-relaxed mx-auto mb-10 font-medium ${isWebsite ? "text-lg max-w-2xl" : "text-sm max-w-xs"}`}>
              {derivedValueProp}
            </p>
            <div className={`mx-auto bg-white rounded-4xl p-6 border border-black/5 shadow-2xl ${isWebsite ? "max-w-md" : "max-w-[280px]"}`}>
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  {dictionary.common.dossierProgress}
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-brand-secondary">
                  {mounted ? progress.percentage : 0}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-neutral-50 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-brand-secondary transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(var(--color-brand-secondary-rgb),0.3)]"
                  style={{ width: `${mounted ? progress.percentage : 0}%` }}
                />
              </div>
              <div className="text-[12px] font-bold text-neutral-600 uppercase tracking-tight">
                {mounted ? (
                  progress.completed === progress.total 
                    ? dictionary.common.dossierCompleted 
                    : `${progress.completed} / ${progress.total} ${progress.total === 1 ? dictionary.common.cardRead : dictionary.common.cardsRead}`
                ) : dictionary.common.loading}
              </div>
            </div>
          </div>
        </ResponsivePageContainer>

        {recommendedCard && (
        <ResponsivePageContainer className="-mt-10 mb-16 relative z-20">
            <div className={`bg-neutral-950 rounded-4xl shadow-2xl relative overflow-hidden group flex flex-col ${isWebsite ? "md:flex-row min-h-[300px] max-w-3xl mx-auto" : "p-8"}`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/10 blur-3xl -mr-32 -mt-32 rounded-full" />
              
              {isWebsite && recommendedCard.images?.thumbnail && (
                <div className="md:w-1/3 relative min-h-[200px]">
                   <Image 
                      src={recommendedCard.images.hero?.src || recommendedCard.images.thumbnail.src}
                      alt={recommendedCard.title}
                      fill
                      className="object-cover opacity-40 grayscale-20 group-hover:scale-105 transition-transform duration-1000"
                   />
                   <div className="absolute inset-0 bg-linear-to-r from-transparent to-neutral-950" />
                </div>
              )}

              <div className={`relative z-10 flex flex-col justify-center ${isWebsite ? "p-10 md:w-2/3" : ""}`}>
                <div className="flex items-center gap-2 text-brand-secondary mb-4">
                  <Sparkles size={16} />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    {dictionary.common.nextStep}
                  </span>
                </div>
                <h3 className={`text-white font-serif mb-3 leading-tight ${isWebsite ? "text-4xl" : "text-2xl"}`}>{recommendedCard.title}</h3>
                <p className={`text-neutral-400 mb-8 leading-relaxed line-clamp-3 ${isWebsite ? "text-base max-w-xl" : "text-xs"}`}>
                  {recommendedCard.quickRealityCheck || recommendedCard.subtitle}
                </p>
                <div className="flex">
                  <Link
                    href={`/${locale}/card/${recommendedCard.id}`}
                    className="inline-flex items-center gap-4 bg-white text-neutral-950 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl hover:bg-brand-secondary hover:text-white"
                  >
                    {isRead(recommendedCard.id) ? (
                      <><RotateCcw size={18} /> {dictionary.common.readAgain}</>
                    ) : (
                      <><Play size={18} fill="currentColor" /> {progress.completed > 0 ? dictionary.common.continueJourney : dictionary.common.startJourney}</>
                    )}
                  </Link>
                </div>
              </div>
            </div>
        </ResponsivePageContainer>
      )}

        <ResponsivePageContainer className="space-y-10 mb-16">
          <section>
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-3">
                {dictionary.common.realityAnalysis} <span className="flex-1 h-px bg-black/5"></span>
              </h2>
              <p className="text-[9px] text-neutral-400 font-medium italic">
                {locale === 'tr' 
                  ? "Bu dağılım, dosyadaki kartların tarihsel gerçekliğe yakınlık durumunu gösterir."
                  : "This breakdown shows how the cards in this dossier relate to historical reality."}
              </p>
            </div>
            <div className={`bg-white rounded-4xl border border-black/5 shadow-xl ${isWebsite ? "p-10" : "p-6"}`}>
              <div className={`grid gap-8 mb-10 ${isWebsite ? "md:grid-cols-2" : "grid-cols-2"}`}>
                <div className="space-y-1">
                  <div className={`font-serif text-neutral-950 ${isWebsite ? "text-4xl" : "text-2xl"}`}>{initialDossier.cards.length}</div>
                  <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={12} /> {initialDossier.cards.length === 1 ? dictionary.common.cardCount : dictionary.common.cardsCount}
                  </div>
                </div>
                <div className={`space-y-1 ${isWebsite ? "md:text-right" : "text-right"}`}>
                  <div className={`font-serif text-neutral-950 ${isWebsite ? "text-4xl" : "text-2xl"}`}>{initialDossier.totalReadingTime} {dictionary.common.minutes}</div>
                  <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 justify-end">
                    <Clock size={12} /> {dictionary.common.totalTime}
                  </div>
                </div>
              </div>
              
              <div className={`pt-10 border-t border-neutral-100 ${isWebsite ? "grid md:grid-cols-2 gap-x-12 gap-y-6" : "space-y-4"}`}>
                {Object.entries(initialDossier.accuracyDistribution).map(([type, count]) => {
                  if (count === 0) return null;
                  const percentage = Math.round((count / initialDossier.cardIds.length) * 100);
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[11px] font-black text-neutral-800 uppercase tracking-tight">
                          {formatAccuracyType(type as AccuracyType, dictionary)}
                        </span>
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                          {count} {count === 1 ? dictionary.common.cardUnit : dictionary.common.cardsUnit} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-neutral-50 rounded-full overflow-hidden shadow-inner">
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
              <div className={`grid gap-6 ${isWebsite ? "md:grid-cols-2" : "space-y-4"}`}>
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
              <div className={`grid gap-4 ${isWebsite ? "md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}`}>
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
              <div className={`grid gap-4 ${isWebsite ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {relatedDossiers.map((rd) => (
                  <Link
                    key={rd.slug}
                    href={`/${locale}/media/${rd.slug}`}
                    className="flex flex-col p-8 bg-white border border-black/5 rounded-4xl active:scale-[0.98] transition-all shadow-xl hover:shadow-2xl group relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <span className="text-[10px] font-black text-brand-secondary uppercase tracking-widest block mb-4">
                        {formatMediaType(rd.mediaType, dictionary)}
                      </span>
                      <h4 className="text-2xl font-serif text-neutral-950 mb-3 group-hover:text-brand-secondary transition-colors leading-tight">{rd.title}</h4>
                      <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight flex items-center gap-2">
                        {rd.cardIds.length} {dictionary.common.cardsCount} • {rd.flagshipCount} {dictionary.common.flagship}
                      </p>
                    </div>
                    <div className="absolute bottom-6 right-6 w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-950 group-hover:text-white transition-all transform group-hover:translate-x-1">
                      <ChevronRight size={24} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </ResponsivePageContainer>
      </main>
    </div>
  );
}
