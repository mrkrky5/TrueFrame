"use client";

import React from "react";
import { HistoryCard } from "@/types";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDictionary } from "@/components/utils/DictionaryProvider";
import { formatMediaType } from "@/utils/format";

interface DailyRealityCheckProps {
  card: HistoryCard;
  locale: string;
}

export default function DailyRealityCheck({ card, locale }: DailyRealityCheckProps) {
  const dictionary = useDictionary();
  const imageUrl = card.images?.hero?.src || card.images?.thumbnail?.src;

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'game': return '🎮';
      case 'film': return '🎬';
      case 'series': return '📺';
      case 'book': return '📖';
      default: return '📖';
    }
  };

  return (
    <section className="mb-8">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-xl font-serif text-neutral-950 flex items-center gap-2">
          <div className="w-2 h-8 bg-brand-secondary rounded-full" />
          {dictionary.common.dailyRealityCheck}
        </h2>
        <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-4 flex items-center gap-1.5">
          <Sparkles size={10} className="text-brand-secondary/60" />
          {dictionary.home.dailyRealityCheckSignal}
        </p>
      </div>

      <Link href={`/${locale}/card/${card.id}`} className="group relative overflow-hidden rounded-4xl bg-neutral-900 min-h-[240px] shadow-2xl flex flex-col justify-end transition-transform active:scale-[0.99]">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={card.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-neutral-900">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--color-brand-secondary)_0%,transparent_70%)]" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
          </div>
        )}

        <div className="relative p-5 md:p-8 z-10 w-full">
          <div className="flex flex-col gap-4 items-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-secondary text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
              {getMediaIcon(card.mediaType)} {formatMediaType(card.mediaType, dictionary)} {dictionary.common.vsReality}
            </div>

            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
                {card.title}
              </h3>
              <p className="text-white/70 text-sm md:text-base font-medium line-clamp-2 max-w-xl leading-relaxed">
                {card.quickRealityCheck || card.subtitle}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 group-hover:bg-brand-secondary group-hover:text-white transition-colors">
                {dictionary.common.seeReality}
              </span>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                {card.readingTimeMinutes} {dictionary.common.minutes?.toUpperCase() || "MIN"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
