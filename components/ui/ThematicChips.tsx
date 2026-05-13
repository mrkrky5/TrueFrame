"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { useLocale } from "@/hooks/useLocale";
import { useDictionary } from "@/components/utils/DictionaryProvider";

const THEMES = [
  { id: "antik-dnya", label: { tr: "Antik Dünya", en: "Ancient World" }, icon: "🏛️" },
  { id: "orta-a", label: { tr: "Orta Çağ", en: "Middle Ages" }, icon: "🏰" },
  { id: "modern-tarih", label: { tr: "Modern Tarih", en: "Modern History" }, icon: "🚀" },
  { id: "mitoloji", label: { tr: "Mitoloji", en: "Mythology" }, icon: "⚡" },
  { id: "suc", label: { tr: "Suç ve Mafya", en: "Crime and Mafia" }, icon: "🕵️" },
  { id: "soguk-savas", label: { tr: "Soğuk Savaş", en: "Cold War" }, icon: "📻" },
  { id: "denizcilik", label: { tr: "Denizcilik", en: "Maritime" }, icon: "⚓" },
  { id: "samuray", label: { tr: "Samuray", en: "Samurai" }, icon: "⚔️" },
];

export default function ThematicChips() {
  const locale = useLocale();
  const dictionary = useDictionary();
  return (
    <section className="mb-10">
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-5 flex items-center gap-2">
        <Sparkles size={12} className="text-brand-secondary" fill="currentColor" /> {dictionary.common.thematicExploration}
      </h2>
      <div className="flex overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar gap-2 snap-x">
        {THEMES.map((theme) => (
          <Link
            key={theme.id}
            href={`/${locale}/explore?tag=${theme.id}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-black/5 rounded-full whitespace-nowrap shadow-sm active:scale-95 transition-all snap-start"
          >
            <span className="text-sm">{theme.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900">{(theme.label as any)[locale]}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
