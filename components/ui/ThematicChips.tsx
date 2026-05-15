"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { HistoryCard as IHistoryCard } from "@/types";

import { useLocale } from "@/hooks/useLocale";
import { useDictionary } from "@/components/utils/DictionaryProvider";
import { useSurface } from "@/components/utils/SurfaceProvider";

const THEMES = [
  { 
    trId: "antik-dnya", 
    enId: "ancient-world", 
    label: { tr: "Antik Dünya", en: "Ancient World" }, 
    icon: "🏛️" 
  },
  { 
    trId: "orta-a", 
    enId: "middle-ages", 
    label: { tr: "Orta Çağ", en: "Middle Ages" }, 
    icon: "🏰" 
  },
  { 
    trId: "modern-tarih", 
    enId: "modern-history", 
    label: { tr: "Modern Tarih", en: "Modern History" }, 
    icon: "🚀" 
  },
  { 
    trId: "mitoloji", 
    enId: "mythology", 
    label: { tr: "Mitoloji", en: "Mythology" }, 
    icon: "⚡" 
  },
  { 
    trId: "suc", 
    enId: "crime", 
    label: { tr: "Suç ve Mafya", en: "Crime and Mafia" }, 
    icon: "🕵️" 
  },
  { 
    trId: "soguk-savas", 
    enId: "cold-war", 
    label: { tr: "Soğuk Savaş", en: "Cold War" }, 
    icon: "📻" 
  },
  { 
    trId: "denizcilik", 
    enId: "maritime", 
    label: { tr: "Denizcilik", en: "Maritime" }, 
    icon: "⚓" 
  },
  { 
    trId: "samuray", 
    enId: "samurai", 
    label: { tr: "Samuray", en: "Samurai" }, 
    icon: "⚔️" 
  },
];

export default function ThematicChips({ cards = [] }: { cards?: IHistoryCard[] }) {
  const locale = useLocale();
  const dictionary = useDictionary();
  const { isWebsite } = useSurface();

  // Filter themes that have at least one card in the current locale
  const activeThemes = useMemo(() => {
    if (cards.length === 0) return THEMES;
    return THEMES.filter(theme => {
      const themeId = locale === 'tr' ? theme.trId : theme.enId;
      return cards.some(card => card.tags?.includes(themeId));
    });
  }, [cards, locale]);

  if (activeThemes.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-5 flex items-center gap-2">
        <Sparkles size={12} className="text-brand-secondary" fill="currentColor" /> {dictionary.common.thematicExploration}
      </h2>
      <div className={`flex ${isWebsite ? "flex-wrap pb-0" : "overflow-x-auto no-scrollbar -mx-6 px-6 pb-4 snap-x"} lg:flex-wrap lg:overflow-x-visible lg:px-0 lg:mx-0 gap-2`}>
        {activeThemes.map((theme) => {
          const themeId = locale === 'tr' ? theme.trId : theme.enId;
          return (
            <Link
              key={themeId}
              href={`/${locale}/explore?tag=${themeId}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-black/5 rounded-full whitespace-nowrap shadow-sm active:scale-95 transition-all snap-start"
            >
            <span className="text-sm">{theme.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900">{(theme.label as any)[locale]}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
