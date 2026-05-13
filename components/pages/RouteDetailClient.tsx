"use client";

import { useMemo, useState, useEffect } from "react";
import { ReadingRoute, HistoryCard } from "@/types";
import { Locale } from "@/lib/i18n-config";
import { useHistory } from "@/hooks/useHistory";
import HistoryCardComponent from "@/components/ui/HistoryCard";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Play, RotateCcw, Sparkles } from "lucide-react";

export default function RouteDetailClient({ 
  route, 
  allCards, 
  locale,
  dictionary 
}: { 
  route: ReadingRoute;
  allCards: HistoryCard[];
  locale: Locale;
  dictionary: any;
}) {
  const { readIds } = useHistory();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const routeCards = useMemo(() => {
    return allCards.filter(c => route.cardIds.includes(c.id));
  }, [route, allCards]);

  const progress = useMemo(() => {
    const completed = routeCards.filter(c => readIds.includes(c.id)).length;
    const total = routeCards.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  }, [routeCards, readIds]);

  const nextStep = useMemo(() => {
    return routeCards.find(c => !readIds.includes(c.id)) || routeCards[0];
  }, [routeCards, readIds]);

  const totalReadingTime = useMemo(() => {
    return routeCards.reduce((acc, c) => acc + c.readingTimeMinutes, 0);
  }, [routeCards]);

  const learningOutcomes = useMemo(() => {
    return locale === 'tr' ? [
      `${route.title} konusundaki temel tarihsel gerçekler.`,
      "Medyanın neleri değiştirdiğini ve nelerin kurgu olduğunu keşfetme.",
      "Olayların ardındaki sosyal ve politik dinamikleri anlama."
    ] : [
      `Core historical facts about ${route.title}.`,
      "Discovering what media changed and what is fictional.",
      "Understanding the social and political dynamics behind the events."
    ];
  }, [route, locale]);

  return (
    <div className="bg-bg-main min-h-screen pb-mobile-nav pt-safe">
      <div className="px-6 pt-12 max-w-lg mx-auto border-b border-black/5 pb-12">
        <Link href={`/${locale}/routes`} className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-neutral-950 active:scale-90 transition-transform shadow-sm border border-black/10 mb-8">
          <ArrowLeft size={20} />
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
          <Sparkles size={12} /> {locale === 'tr' ? 'TARİHSEL YOLCULUK' : 'HISTORICAL JOURNEY'}
        </div>

        <h1 className="text-4xl font-serif text-neutral-950 mb-4 leading-tight">{route.title}</h1>
        <p className="text-neutral-500 text-sm leading-relaxed mb-8 font-medium">{route.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white p-4 rounded-3xl border border-black/5 shadow-sm">
            <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">{locale === 'tr' ? 'SÜRE' : 'DURATION'}</div>
            <div className="text-lg font-serif text-neutral-950">{totalReadingTime} {dictionary.common.minutes}</div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-black/5 shadow-sm">
            <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">{locale === 'tr' ? 'İLERLEME' : 'PROGRESS'}</div>
            <div className="text-lg font-serif text-neutral-950">{mounted ? (locale === 'tr' ? `%${progress.percentage}` : `${progress.percentage}%`) : 0}</div>
          </div>
        </div>

        <div className="bg-neutral-950 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/10 blur-3xl -mr-16 -mt-16 rounded-full" />
          <div className="relative z-10">
            <div className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-4">{locale === 'tr' ? 'SIRADAKİ ADIM' : 'NEXT STEP'}</div>
            <h3 className="text-white text-xl font-serif mb-6">{nextStep.title}</h3>
            <Link
              href={`/${locale}/card/${nextStep.id}`}
              className="inline-flex items-center gap-3 bg-white text-neutral-950 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
            >
              {mounted && readIds.includes(nextStep.id) ? (
                <><RotateCcw size={16} /> {locale === 'tr' ? 'TEKRAR OKU' : 'READ AGAIN'}</>
              ) : (
                <><Play size={16} fill="currentColor" /> {progress.completed > 0 ? (locale === 'tr' ? "DEVAM ET" : "CONTINUE") : (locale === 'tr' ? "YOLCULUĞA BAŞLA" : "START JOURNEY")}</>
              )}
            </Link>
          </div>
        </div>
      </div>

      <section className="px-6 py-12 max-w-lg mx-auto bg-white/50 border-b border-black/5">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-8 flex items-center gap-3">
          {locale === 'tr' ? 'BU ROTADA NE ÖĞRENECEKSİN?' : 'WHAT WILL YOU LEARN?'} <span className="flex-1 h-px bg-black/5"></span>
        </h2>
        <div className="space-y-4">
          {learningOutcomes.map((outcome, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-6 h-6 bg-brand-secondary/10 text-brand-secondary rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} />
              </div>
              <p className="text-sm text-neutral-600 font-medium leading-relaxed">{outcome}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 py-16 max-w-lg mx-auto">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-12 flex items-center gap-3 text-center justify-center">
          {locale === 'tr' ? 'ADIM ADIM YOL HARİTASI' : 'STEP-BY-STEP ROADMAP'}
        </h2>

        <div className="space-y-12 relative">
          <div className="absolute left-6 top-6 bottom-6 w-px bg-neutral-100 -z-10" />

          {routeCards.map((card, index) => {
            const isRead = mounted && readIds.includes(card.id);
            const isNext = mounted && nextStep.id === card.id && !isRead;

            return (
              <div key={card.id} className="relative flex gap-8 items-start">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 z-10 ${isRead ? "bg-green-500 border-green-500 text-white" :
                    isNext ? "bg-neutral-950 border-neutral-950 text-white shadow-xl scale-110" :
                      "bg-white border-neutral-100 text-neutral-300"
                  }`}>
                  {isRead ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <span className="text-lg font-serif">{index + 1}</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-4">
                    <span className={`text-[9px] font-black uppercase tracking-widest mb-1 block ${isRead ? "text-green-600" : isNext ? "text-brand-secondary" : "text-neutral-400"}`}>
                      {isRead ? (locale === 'tr' ? "TAMAMLANDI" : "COMPLETED") : isNext ? (locale === 'tr' ? "SIRADAKİ DURAK" : "NEXT STOP") : `${locale === 'tr' ? 'ADIM' : 'STEP'} ${index + 1}`}
                    </span>
                    <h4 className={`text-xl font-serif leading-tight ${isRead ? "text-neutral-500" : "text-neutral-950"}`}>
                      {card.title}
                    </h4>
                  </div>

                  <HistoryCardComponent
                    card={card}
                    variant={card.isFlagship ? "full" : "compact"}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {mounted && progress.percentage === 100 && (
          <div className="mt-16 text-center bg-white rounded-4xl p-10 border border-black/5 shadow-xl animate-in fade-in zoom-in-95 duration-700">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={40} />
            </div>
            <h3 className="text-2xl font-serif text-neutral-950 mb-4">{locale === 'tr' ? 'Tebrikler, Rota Tamamlandı!' : 'Congratulations, Route Completed!'}</h3>
            <p className="text-neutral-500 text-sm mb-10 leading-relaxed max-w-[280px] mx-auto">
              {locale === 'tr' ? 'Bu yolculuğu başarıyla bitirdin. Yeni bir konuya başlamaya ne dersin?' : 'You have successfully finished this journey. How about starting a new topic?'}
            </p>
            <Link href={`/${locale}/routes`} className="inline-flex items-center gap-3 bg-neutral-950 text-white px-10 py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
              {locale === 'tr' ? 'DİĞER ROTALARA GÖZ AT' : 'BROWSE OTHER ROUTES'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
