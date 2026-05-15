"use client";

import React from "react";
import { HistoryCard } from "@/types";
import { Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/hooks/useLocale";
import { useDictionary } from "@/components/utils/DictionaryProvider";

interface ProgressItem {
  card: HistoryCard;
  progress: number; // 0 to 100
  currentStep?: number;
  totalSteps?: number;
}

interface ContinueReadingCarouselProps {
  items: ProgressItem[];
}

export default function ContinueReadingCarousel({ items }: ContinueReadingCarouselProps) {
  const locale = useLocale();
  const dictionary = useDictionary();
  
  if (items.length === 0) {
    if (locale === 'en') {
      return (
        <section className="mb-10 opacity-60">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 flex items-center gap-2">
              <Play size={12} className="text-neutral-300" fill="currentColor" /> {dictionary.common.continueReadingTitle}
            </h2>
          </div>
          <div className="bg-neutral-50 rounded-3xl p-6 border border-dashed border-neutral-200 flex flex-col items-center text-center">
             <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest mb-2">No active journeys</p>
             <p className="text-xs text-neutral-500 max-w-[200px]">Start reading your first story!</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 flex items-center gap-2">
          <Play size={12} className="text-brand-secondary" fill="currentColor" /> {dictionary.common.continueReadingTitle}
        </h2>
      </div>

      <div className="flex overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar gap-4 snap-x">
        {items.map(({ card, progress, currentStep, totalSteps }) => (
          <Link
            key={card.id}
            href={`/${locale}/card/${card.id}`}
            className="flex-none w-72 bg-white rounded-3xl p-5 border border-black/5 shadow-sm active:scale-95 transition-all snap-start group"
          >
            <div className="flex gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 border border-black/5">
                {card.images?.thumbnail?.src ? (
                  <Image 
                    src={card.images.thumbnail.src} 
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <Play size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-[11px] font-black uppercase tracking-tight text-neutral-600 line-clamp-1">
                  {card.mediaTitle}
                </h3>
                <h4 className="text-sm font-bold text-neutral-900 leading-tight line-clamp-2 group-hover:text-brand-secondary transition-colors">
                  {card.title}
                </h4>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                  {card.isFlagship ? dictionary.common.deepDossier : dictionary.common.simpleRealityCheck}
                </span>
                <span className="text-[10px] font-black text-brand-secondary tabular-nums">
                  {locale === 'tr' ? `%${Math.round(progress)}` : `${Math.round(progress)}%`}
                </span>
              </div>
              <div className="h-1.5 w-full bg-neutral-50 rounded-full overflow-hidden border border-black/5">
                <div 
                  className="h-full bg-brand-secondary transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-1 text-[9px] font-black uppercase tracking-widest text-neutral-950">
                {card.isFlagship ? dictionary.common.continueAction : dictionary.common.keepReadingAction} <ArrowRight size={10} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
