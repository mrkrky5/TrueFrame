"use client";

import React, { useMemo } from "react";
import { HistoryCard } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { ENGLISH_PILOT_IDS } from "@/lib/i18n-config";
import { formatMediaType } from "@/utils/format";

interface NextDiscoveryCardProps {
  currentCard: HistoryCard;
  allCards: HistoryCard[];
  readIds: string[];
  locale: string;
  dictionary: any;
}

export default function NextDiscoveryCard({
  currentCard,
  allCards,
  readIds,
  locale,
  dictionary
}: NextDiscoveryCardProps) {
  const nextCard = useMemo(() => {
    // 1. Filter candidates based on locale
    let candidates = allCards.filter(c => c.id !== currentCard.id);
    if (locale === 'en') {
      candidates = candidates.filter(c => ENGLISH_PILOT_IDS.includes(c.id));
    }

    // 2. Filter out already read cards if possible
    const unreadCandidates = candidates.filter(c => !readIds.includes(c.id));
    const pool = unreadCandidates.length > 0 ? unreadCandidates : candidates;

    if (pool.length === 0) return null;

    // 3. Priority Logic
    
    // Priority A: Same Media Dossier
    if (currentCard.mediaTitle) {
      const sameDossier = pool.find(c => c.mediaTitle === currentCard.mediaTitle);
      if (sameDossier) return sameDossier;
    }

    // Priority B: Same Main Tag/Thematic
    const currentTags = currentCard.tags || [];
    if (currentTags.length > 0) {
      const sameTag = pool.find(c => c.tags?.some(t => currentTags.includes(t)));
      if (sameTag) return sameTag;
    }

    // Priority C: Same Media Type (game, film, etc.)
    const sameType = pool.find(c => c.mediaType === currentCard.mediaType);
    if (sameType) return sameType;

    // Priority D: Random fallback from pool
    return pool[0];
  }, [currentCard, allCards, readIds, locale]);

  const t = dictionary.card;

  if (!nextCard) {
    return (
      <div className="mt-12 pt-8 border-t border-black/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link 
          href={`/${locale}/explore`}
          className="w-full py-4 rounded-2xl bg-neutral-900 text-white flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          {t.nextDiscoveryFallback} <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-black/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-brand-secondary/10 rounded-lg flex items-center justify-center text-brand-secondary">
          <Sparkles size={16} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            {t.nextDiscoveryTitle}
          </h4>
          <p className="text-sm font-serif text-neutral-900">
            {t.nextDiscoveryDesc}
          </p>
        </div>
      </div>

      <Link 
        href={`/${locale}/card/${nextCard.id}`}
        className="group block bg-white border border-black/5 rounded-3xl p-5 shadow-sm active:scale-[0.98] transition-all relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
             <span className="text-[9px] font-black uppercase tracking-widest text-brand-secondary px-3 py-1 bg-brand-secondary/5 rounded-full border border-brand-secondary/10">
               {formatMediaType(nextCard.mediaType, dictionary)}
             </span>
             <ArrowRight size={14} className="text-neutral-300 group-hover:text-brand-secondary group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-serif text-neutral-950 line-clamp-1 mb-1">
            {nextCard.title}
          </h3>
          <p className="text-[10px] font-medium text-neutral-400 line-clamp-1 uppercase tracking-wider">
            {nextCard.subtitle}
          </p>
        </div>
        <div className="absolute right-0 bottom-0 w-24 h-24 bg-brand-secondary/5 rounded-full -mr-12 -mb-12 group-hover:scale-110 transition-transform duration-500" />
      </Link>
    </div>
  );
}
