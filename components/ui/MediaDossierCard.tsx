import React from "react";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { MediaDossier } from "@/utils/dossier";
import { formatMediaType, formatTag } from "@/utils/format";

import { useLocale } from "@/hooks/useLocale";
import { useDictionary } from "@/components/utils/DictionaryProvider";

interface Props {
  dossier: MediaDossier;
}

export default function MediaDossierCard({ dossier }: Props) {
  const locale = useLocale();
  const dictionary = useDictionary();
  return (
    <Link href={`/${locale}/media/${dossier.slug}`} className="block group">
      <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm active:scale-[0.98] transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-brand-secondary/10 text-brand-secondary px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">
            {formatMediaType(dossier.mediaType, dictionary, locale)}
          </span>
          <div className="flex items-center gap-2 text-neutral-600 text-[9px] font-bold uppercase tracking-tight">
            <BookOpen size={10} />
            {dossier.cardIds.length} {dossier.cardIds.length === 1 ? dictionary.common.cardCount : dictionary.common.cardsCount}
          </div>
        </div>
        
        <h3 className="text-xl font-serif text-neutral-950 mb-2 group-hover:text-brand-secondary transition-colors">
          {dossier.title}
        </h3>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-neutral-500">
            <Clock size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{dossier.totalReadingTime} {locale === 'tr' ? dictionary.common.minutes?.toLocaleUpperCase('tr-TR') : dictionary.common.minutes?.toUpperCase()}</span>
          </div>
          {dossier.flagshipCount > 0 && (
            <span className="text-brand-secondary text-[10px] font-bold uppercase tracking-widest">
              {dossier.flagshipCount} {locale === 'en' ? (dossier.flagshipCount === 1 ? dictionary.common.flagshipCountLabel : dictionary.common.flagshipsCountLabel) : dictionary.common.flagship}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-black/5">
          <div className="flex gap-2 overflow-hidden flex-wrap max-h-4">
            {dossier.topTags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[8px] font-black text-neutral-600 uppercase tracking-widest whitespace-nowrap opacity-80">
                #{formatTag(tag, dictionary, locale)}
              </span>
            ))}
          </div>
          <ArrowRight size={14} className="text-brand-secondary group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
