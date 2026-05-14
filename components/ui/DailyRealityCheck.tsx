"use client";

import React from "react";
import { HistoryCard } from "@/types";
import { Sparkles } from "lucide-react";
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
    <section className="mb-10">
      <div className="flex flex-col gap-1 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-brand-secondary/80 rounded-full" />
          <h2 className="text-xl font-serif text-neutral-950 tracking-tight">
            {dictionary.common.dailyRealityCheck}
          </h2>
        </div>
        <p className="archival-label ml-4.5 flex items-center gap-1.5 text-neutral-500 font-bold">
          <Sparkles size={10} className="text-brand-secondary" />
          {dictionary.home.dailyRealityCheckSignal}
        </p>
      </div>

      <Link
        href={`/${locale}/card/${card.id}`}
        className="group relative block rounded-3xl overflow-hidden shadow-xl transition-all active:scale-[0.99] border border-black/10 archival-surface archival-border-double bg-neutral-900"
      >
        <div className="relative min-h-[280px] md:min-h-[320px] flex flex-col justify-end">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 grayscale-10"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-neutral-900">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--color-brand-secondary) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
              <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
            </div>
          )}

          <div className="relative p-6 md:p-10 z-10 w-full">
            <div className="flex flex-col gap-5 items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-brand-secondary text-[9px] font-black uppercase tracking-widest text-white shadow-lg archival-border-double border-white/10">
                {getMediaIcon(card.mediaType)} {formatMediaType(card.mediaType, dictionary)} {dictionary.common.vsReality}
              </div>

              <div className="max-w-2xl">
                <h3 className="text-3xl md:text-5xl font-serif text-white mb-3 tracking-tight leading-[1.05] drop-shadow-lg">
                  {card.title}
                </h3>
                <p className="text-white/80 text-sm md:text-base font-medium line-clamp-2 max-w-xl leading-relaxed font-sans">
                  {card.quickRealityCheck || card.subtitle}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-6">
                <span className="text-white bg-white/10 backdrop-blur-xl px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 group-hover:bg-brand-secondary group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-lg">
                  {dictionary.common.seeReality}
                </span>
                <span className="archival-label text-white/60! lowercase italic">
                  {card.readingTimeMinutes} {dictionary.common.minutes || "min"} • {locale === 'tr' ? 'dosya açıldı' : 'file opened'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>



    </section>
  );
}

