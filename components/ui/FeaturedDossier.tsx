"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { MediaDossier } from "@/utils/dossier";
import { useDictionary } from "@/components/utils/DictionaryProvider";
import { formatMediaType, formatTag } from "@/utils/format";

interface FeaturedDossierProps {
  dossier: MediaDossier;
  locale: string;
}

export default function FeaturedDossier({ dossier, locale }: FeaturedDossierProps) {
  const dictionary = useDictionary();
  const flagship = dossier.cards.find(c => c.isFlagship) || dossier.cards[0];
  const representativeImage = flagship?.images?.hero?.src || flagship?.images?.thumbnail?.src;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif text-neutral-950 flex items-center gap-2">
          <div className="w-2 h-8 bg-neutral-950 rounded-full" />
          {dictionary.common.featuredDossier}
        </h2>
      </div>

      <div className={`bg-neutral-900 rounded-4xl overflow-hidden relative shadow-xl border border-white/5 min-h-[240px] flex flex-col ${representativeImage ? 'md:flex-row' : ''}`}>
        {/* Visual Background Pattern when no image */}
        {!representativeImage && (
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        )}

        {representativeImage && (
          <div className="flex-1 relative min-h-[140px] md:min-h-full">
            <Image
              src={representativeImage}
              alt={dossier.title}
              fill
              className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-900 md:bg-linear-to-r md:from-transparent md:to-neutral-900" />
          </div>
        )}

        <div className={`relative z-10 p-5 md:p-8 flex flex-col justify-center ${representativeImage ? 'md:w-[60%]' : 'w-full'}`}>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">
                {dictionary.common.mediaDossierTitle}
              </div>
              <div className="text-[9px] font-extrabold text-amber-200 uppercase tracking-widest">
                {formatMediaType(dossier.mediaType, dictionary)} • {dossier.cardIds.length} {dossier.cardIds.length === 1 ? dictionary.common.cardCount : dictionary.common.cardsCount}
              </div>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
                {dossier.title}
              </h3>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed line-clamp-3 max-w-lg font-medium">
                {dictionary.common.dossierDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {dossier.topTags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[8px] font-black text-white/30 uppercase tracking-widest px-2 py-1 rounded border border-white/5 bg-white/5 max-w-[140px] truncate">
                  #{formatTag(tag, dictionary)}
                </span>
              ))}
            </div>

            <div className="pt-6">
              <Link
                href={`/${locale}/media/${dossier.slug}`}
                className="inline-flex items-center gap-3 bg-white text-neutral-950 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-brand-secondary hover:text-white transition-all shadow-lg active:scale-95"
              >
                {dictionary.common.exploreDossier} <ArrowRight size={14} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
