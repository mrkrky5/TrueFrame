"use client";

import Image from "next/image";
import { HistoryCard as IHistoryCard } from "@/types";
import Link from "next/link";
import SaveButton from "@/components/ui/SaveButton";
import StatusBadge from "@/components/ui/StatusBadge";
import { useHistory } from "@/hooks/useHistory";
import { useLearning } from "@/hooks/useLearning";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Check, AlertTriangle } from "lucide-react";
import { getDossierSlug } from "@/utils/dossier";
import { formatMediaType } from "@/utils/format";
import GuidedJourneyReader from "@/components/reading/GuidedJourneyReader";
import StandardLiteReader from "@/components/reading/StandardLiteReader";
import ShareButton from "@/components/ui/ShareButton";
import NextDiscoveryCard from "@/components/ui/NextDiscoveryCard";
import { Locale } from "@/lib/i18n-config";
import ResponsivePageContainer from "@/components/layout/ResponsivePageContainer";
import { useRouter } from "next/navigation";
import { useSurface } from "@/components/utils/SurfaceProvider";

interface CardClientProps {
  card: IHistoryCard;
  allCards: IHistoryCard[];
  locale: Locale;
  dictionary: any;
}

export default function CardClient({ card, allCards, locale, dictionary }: CardClientProps) {
  const router = useRouter();
  const { isWebsite } = useSurface();
  const { addRecent, isRead, markAsRead, readIds } = useHistory();
  const { setGuess, getGuess, toggleReflection, getReflections } = useLearning();
  const [isScrolled, setIsScrolled] = useState(false);
  const [journeyProgress, setJourneyProgress] = useState<number | null>(null);

  useEffect(() => {
    if (card) {
      addRecent(card.id);
      const saved = localStorage.getItem(`progress_${card.id}`);
      if (saved) {
        const step = parseInt(saved, 10);
        if (!isNaN(step)) setJourneyProgress(step);
      }
    }

    const handleScroll = (e: Event) => {
      const target = e.target as any;
      const scrollTop = (target === document || target === window || target === document.documentElement || target === document.body)
        ? window.scrollY 
        : target.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    // Capture scroll events from any element (like .app-scroll-area)
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [card, addRecent]);

  const read = isRead(card.id);

  const similarCards = allCards
    .filter((c) => c.id !== card.id)
    .map((c) => {
      const sharedTags = c.tags?.filter(t => card.tags?.includes(t)) || [];
      let score = sharedTags.length * 2;
      if (c.mediaType === card.mediaType) score += 3;
      if (c.isFlagship) score += 5;
      return { card: c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.card);

  const heroImage = card.images?.hero;
  const spoilerLevel = card.spoilerLevel || "none";
  const [revealSpoiler, setRevealSpoiler] = useState(card.isFlagship ? false : spoilerLevel !== "major");

  const learningState = {
    getGuess,
    setGuess,
    getReflections,
    toggleReflection
  };

  return (
    <div className="bg-bg-main min-h-screen">
      <div
        className={`fixed top-0 left-0 right-0 z-50 safe-area-top transition-all duration-500 ${isScrolled ? "bg-bg-main shadow-md opacity-100" : "bg-transparent opacity-0"
          }`}
      />

      <header className="detail-floating-controls-safe">
        <div className={`flex justify-between items-center pointer-events-auto h-16 px-6 ${isWebsite ? "max-w-7xl mx-auto" : "max-w-lg mx-auto"}`}>
          <button
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push(`/${locale}`);
              }
            }}
            aria-label={dictionary.common.back}
            className="bg-white/95 backdrop-blur-xl w-10 h-10 rounded-full flex items-center justify-center text-neutral-950 active:scale-90 transition-all shadow-xl border border-black/5"
          >
            <ArrowLeft size={20} strokeWidth={3} />
          </button>
          
          <div className="flex gap-4">
            <ShareButton
              title={`${card.title} | ${dictionary.common.brandingTitle}`}
              text={`${card.mediaTitle} | ${card.title}`}
            />
            <SaveButton cardId={card.id} />
          </div>
        </div>
      </header>

      {/* Header Area */}
      {!(card.isFlagship && revealSpoiler) && (
        <div className={`relative ${heroImage ? (isWebsite ? "h-[45vh]" : "h-[35vh]") : (isWebsite ? "h-[30vh]" : "h-[20vh]")} bg-bg-main flex flex-col justify-end border-b border-black/5 overflow-hidden`}>
        {heroImage && (
          <div className="absolute inset-0 z-0 bg-neutral-200">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              className="object-cover opacity-90"
              sizes="(max-width: 512px) 100vw, 512px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-bg-main via-transparent to-black/10"></div>
          </div>
        )}

        <div className={`relative z-10 w-full p-6 pb-12 ${isWebsite ? "max-w-4xl mx-auto md:px-12" : "max-w-lg mx-auto"}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getDossierSlug(card.mediaTitle) ? (
                <Link
                  href={`/${locale}/media/${getDossierSlug(card.mediaTitle)}`}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] underline decoration-brand-secondary/30 underline-offset-4 hover:decoration-brand-secondary active:scale-95 transition-all ${heroImage ? "text-neutral-950 drop-shadow-sm" : "text-brand-secondary"}`}
                >
                  {formatMediaType(card.mediaType, dictionary, locale)} • {card.mediaTitle}
                </Link>
              ) : (
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${heroImage ? "text-neutral-950 drop-shadow-sm" : "text-brand-secondary"}`}>
                  {formatMediaType(card.mediaType, dictionary, locale)} • {card.mediaTitle}
                </span>
              )}
              {card.isFlagship && (
                <span className="bg-neutral-950 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-lg">
                  {dictionary.common.flagship}
                </span>
              )}
            </div>
          </div>
          <h1 className={`text-4xl md:text-6xl font-serif leading-tight ${heroImage ? "text-neutral-950 drop-shadow-sm" : "text-neutral-950"}`}>
            {card.title}
          </h1>
          <div className="flex items-center gap-6 mt-6 text-[10px] font-black uppercase tracking-widest text-neutral-800 opacity-70">
            <span className="flex items-center gap-2"><BookOpen size={14} strokeWidth={2.5} /> {card.readingTimeMinutes} {dictionary.common.minutes} {dictionary.common.readTime}</span>
            {read && <span className="text-green-700 flex items-center gap-2"><Check size={14} strokeWidth={3} /> {dictionary.common.readStatus}</span>}
          </div>
        </div>
      </div>
    )}

      <ResponsivePageContainer maxWidth="prose" className={`relative z-20 ${card.isFlagship && revealSpoiler ? "mt-0 pt-0" : "mt-10"}`}>
        {card.isFlagship ? (
          <div className={!revealSpoiler ? "reader-canvas" : ""}>
            {!revealSpoiler ? (
              <section className="archival-muted-bg p-10 rounded-4xl archival-border-double text-center space-y-4 my-10 shadow-xl">
                <AlertTriangle className="mx-auto text-amber-500" size={32} />
                <div className="space-y-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900">{dictionary.card.spoilers}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-[200px] mx-auto">
                    {card.spoilerNote || dictionary.containsSpoilers}
                  </p>
                </div>
                <button
                  onClick={() => setRevealSpoiler(true)}
                  className="bg-neutral-950 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                >
                  {read ? dictionary.common.reOpen : (journeyProgress && journeyProgress > 0) ? dictionary.common.continueAction : dictionary.common.startJourney}
                </button>
              </section>
            ) : (
              <GuidedJourneyReader
                card={card}
                learningState={learningState}
                similarCards={similarCards}
                allCards={allCards}
                readIds={readIds}
                dictionary={dictionary}
                onComplete={() => markAsRead(card.id)}
              />
            )}
          </div>
        ) : (
          <div className={(!revealSpoiler && card.spoilerNote) ? "reader-canvas" : ""}>
            {!revealSpoiler && card.spoilerNote ? (
              <section className="archival-muted-bg p-10 rounded-4xl archival-border-double text-center space-y-4 my-10 shadow-xl">
                <AlertTriangle className="mx-auto text-amber-500" size={32} />
                <button
                  onClick={() => setRevealSpoiler(true)}
                  className="bg-neutral-950 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                >
                  {dictionary.common.viewContent}
                </button>
              </section>
            ) : (
              <>
                <StandardLiteReader
                  card={card}
                  learningState={learningState}
                  similarCards={similarCards}
                  allCards={allCards}
                  readIds={readIds}
                  dictionary={dictionary}
                />
                <section className="pt-6 border-t border-black/5 flex flex-col gap-4">
                  {!read ? (
                    <button
                      onClick={() => markAsRead(card.id)}
                      className="w-full py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl active:scale-[0.98] bg-neutral-950 text-white"
                    >
                      {dictionary.common.markAsRead}
                    </button>
                  ) : (
                     <div className="bg-green-50/50 rounded-4xl p-6 border border-green-100 text-center">
                        <h3 className="text-lg font-serif text-neutral-950 mb-2">{dictionary.common.explorationComplete}</h3>
                        <Link href={`/${locale}`} className="w-full py-4 rounded-2xl bg-neutral-950 text-white font-black uppercase tracking-widest text-[10px]">
                           {dictionary.common.returnHome}
                        </Link>
                     </div>
                  )}
                </section>
              </>
            )}
          </div>
        )}
      </ResponsivePageContainer>

      <ResponsivePageContainer maxWidth="prose" className="pb-20">
        {(!card.isFlagship || read) && (
          <NextDiscoveryCard 
            currentCard={card}
            allCards={allCards}
            readIds={readIds}
            locale={locale}
            dictionary={dictionary}
          />
        )}
      </ResponsivePageContainer>
    </div>
  );
}
