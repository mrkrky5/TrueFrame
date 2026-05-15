"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-neutral-950 rounded-full" />
          <h2 className="text-xl font-serif text-neutral-950 tracking-tight">
            {dictionary.common.featuredDossier}
          </h2>
        </div>
      </div>

      <div className={`bg-neutral-900 rounded-3xl overflow-hidden relative shadow-lg archival-surface archival-border-double border-black/10 min-h-[260px] flex flex-col ${representativeImage ? 'md:flex-row lg:flex-col' : ''}`}>
        {/* Visual Background Pattern when no image */}
        {!representativeImage && (
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        )}

        {representativeImage && (
          <div className="flex-1 relative min-h-[160px] md:min-h-full lg:min-h-[200px]">
            <Image
              src={representativeImage}
              alt={dossier.title}
              fill
              className="object-cover opacity-60 grayscale-30 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-900 md:bg-linear-to-r md:from-transparent md:to-neutral-900 lg:bg-linear-to-t lg:from-neutral-900 lg:to-transparent" />
          </div>
        )}


        <div className={`relative z-10 p-6 md:p-9 flex flex-col justify-center ${representativeImage ? 'md:w-[60%] lg:w-full' : 'w-full'}`}>
          <div className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <div className="archival-label text-white/60! tracking-[0.4em]!">
                {dictionary.common.mediaDossierTitle}
              </div>
              <div className="archival-label text-neutral-300! font-medium lowercase! italic">
                {formatMediaType(dossier.mediaType, dictionary)} • {dossier.cardIds.length} {dossier.cardIds.length === 1 ? dictionary.common.cardCount : dictionary.common.cardsCount}
              </div>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-serif text-white mb-3 tracking-tight leading-tight">
                {dossier.title}
              </h3>
              <p className="text-white/80 text-[13px] md:text-sm leading-relaxed line-clamp-2 max-w-lg font-medium font-sans">
                {dictionary.common.dossierDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 opacity-80">
              {dossier.topTags.slice(0, 2).map(tag => (
                <span key={tag} className="archival-label text-white/80! px-2 py-1 rounded bg-white/10 border border-white/20">
                  #{formatTag(tag, dictionary)}
                </span>
              ))}
            </div>


            <div className="pt-4">
              <Link
                href={`/${locale}/media/${dossier.slug}`}
                className="inline-flex items-center gap-3 bg-white text-neutral-950 px-7 py-3.5 rounded-2xl archival-label tracking-widest! hover:bg-brand-secondary hover:text-white transition-all shadow-xl active:scale-95"
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
