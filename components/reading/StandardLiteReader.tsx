"use client";

import React from "react";
import { HistoryCard } from "@/types";
import { formatMediaType, formatAccuracyType } from "@/utils/format";
import { Info, AlertTriangle, BookOpen, ExternalLink, ArrowRight, CheckCircle2, Split, FileText, Compass, Archive } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ReadReflection from "@/components/learning/ReadReflection";
import { useSurface } from "@/components/utils/SurfaceProvider";

interface StandardLiteReaderProps {
  card: HistoryCard;
  learningState: any;
  similarCards: HistoryCard[];
  allCards: HistoryCard[];
  readIds: string[];
  dictionary: any;
}

import { useLocale } from "@/hooks/useLocale";

export default function StandardLiteReader({ card, learningState, similarCards, allCards, readIds, dictionary }: StandardLiteReaderProps) {
  const locale = useLocale();
  const { isWebsite } = useSurface();
  const { getReflections, toggleReflection } = learningState;

  return (
    <div className={`space-y-10 pb-20 ${isWebsite ? "pt-0" : "pt-4"}`}>
      {/* Reality Summary */}
      <section className="archival-muted-bg rounded-4xl p-7 archival-border-double shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full -mr-16 -mt-16" />
        <div className="flex items-center gap-2 text-brand-secondary relative z-10">
          <CheckCircle2 size={16} />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.common.realitySummary}</h2>
        </div>
        <div className="space-y-3 relative z-10">
          <div className="inline-block px-3 py-1 bg-brand-secondary/10 border border-brand-secondary/20 text-neutral-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
            {formatAccuracyType(card.accuracyType || "fiction", dictionary)}
          </div>
          <p className="text-[15px] text-neutral-700 leading-relaxed font-medium">
            {card.accuracyNote || card.quickRealityCheck}
          </p>
        </div>
      </section>

      {/* Media Hook / What You Saw */}
      {card.mediaChanged && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-600">
            <Split size={14} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.common.vsReality}</h2>
          </div>
          <div className="p-6 archival-muted-bg rounded-3xl archival-border-double">
            <p className="text-[15px] text-neutral-600 leading-relaxed italic">
              {card.mediaChanged}
            </p>
          </div>
        </section>
      )}

      {/* History Content */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-neutral-600">
          <Archive size={14} />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.common.historicalBackground}</h2>
        </div>
        <div className="font-serif text-[18px] leading-[1.7] text-neutral-900 space-y-4">
          {card.realHistory?.split('\n\n')
            .filter(p => {
              const text = p.trim().toLowerCase();
              return !text.startsWith('kaynakça') && 
                     !text.startsWith('sources') && 
                     !text.startsWith('### kaynakça') && 
                     !text.startsWith('### sources');
            })
            .map((p, i) => {
              const trimmed = p.trim();
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={i} className="text-xl font-bold text-neutral-900 mt-8 mb-4 border-l-4 border-brand-secondary pl-4 font-serif">
                    {trimmed.replace('### ', '').trim()}
                  </h3>
                );
              }
              if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 mb-4">
                    {trimmed.split('\n').map((li, liIndex) => (
                      <li key={liIndex} className="text-neutral-800 leading-relaxed">
                        {li.replace(/^[\*\-]\s+/, '').trim()}
                      </li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{trimmed}</p>;
            })}
        </div>
      </section>

      {/* Why It Matters */}
      {card.whyItMatters && (
        <section className="bg-brand-secondary/5 p-7 rounded-4xl border border-brand-secondary/10 border-l-4 border-l-brand-secondary">
          <div className="flex items-center gap-2 text-brand-secondary mb-3">
            <Compass size={14} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.common.whyItMattersHeader}</h2>
          </div>
          <p className="text-[15px] text-neutral-900 leading-relaxed font-medium">
            {card.whyItMatters}
          </p>
        </section>
      )}

      {/* Sources */}
      {card.sources && card.sources.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-600">
            <FileText size={14} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.common.sourcesTitle}</h2>
          </div>
          <div className="grid gap-2">
            {card.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm border border-black/10 rounded-2xl active:bg-white transition-all shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-neutral-900">{source.title}</span>
                  <span className="text-[8px] text-brand-secondary font-black uppercase tracking-widest mt-1">{source.type}</span>
                </div>
                <ExternalLink size={14} className="text-neutral-600" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Reflection */}
      <section className="pt-6 border-t border-black/5 text-center space-y-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">{dictionary.common.feelQuestion}</p>
        <div className="flex justify-center">
          <ReadReflection
            cardId={card.id}
            selectedReflections={getReflections(card.id)}
            onToggle={(r) => toggleReflection(card.id, r)}
          />
        </div>
      </section>

      {/* Similar Discoveries */}
      {similarCards.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 text-center">{dictionary.common.similarDiscoveries}</h2>
          <div className="space-y-3">
            {similarCards.map((rc) => (
              <Link key={rc.id} href={`/${locale}/card/${rc.id}`} className="flex items-center gap-4 p-4 bg-neutral-50 border border-black/5 rounded-3xl active:scale-[0.98] transition-transform">
                <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-white shadow-sm border border-black/5">
                  {rc.images?.thumbnail ? (
                    <Image src={rc.images.thumbnail.src} alt={rc.title} fill className="object-cover" sizes="48px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <BookOpen size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-base text-neutral-900 leading-tight truncate">{rc.title}</h4>
                  <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest mt-1 truncate">{formatMediaType(rc.mediaType, dictionary)} • {rc.mediaTitle}</p>
                </div>
                <ArrowRight size={14} className="text-neutral-600" />
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
