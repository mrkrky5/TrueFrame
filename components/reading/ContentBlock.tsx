"use client";

import React from "react";
import { ContentBlock } from "@/utils/contentBlocks";
import { formatMediaType, formatAccuracyType } from "@/utils/format";
import AccuracyGuess from "@/components/learning/AccuracyGuess";
import ReadReflection from "@/components/learning/ReadReflection";
import { ExternalLink, Info, AlertTriangle, BookOpen, ArrowRight, Archive, Compass, FileText, Split, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlockRendererProps {
  block: ContentBlock;
  cardId: string;
  learningState: {
    getGuess: (id: string) => any;
    setGuess: (id: string, guess: any) => void;
    getReflections: (id: string) => any;
    toggleReflection: (id: string, r: any) => void;
  };
  isActive?: boolean;
  similarCards?: any[];
}

import { useLocale } from "@/hooks/useLocale";
import { useDictionary } from "@/components/utils/DictionaryProvider";

export default function ContentBlockRenderer({ block, cardId, learningState, isActive, similarCards }: BlockRendererProps) {
  const locale = useLocale();
  const dictionary = useDictionary();
  const { getGuess, setGuess, getReflections, toggleReflection } = learningState;

  switch (block.type) {
    case "hook":
      return (
        <section className="space-y-6 py-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-secondary/10 border border-brand-secondary/20 rounded-full">
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-secondary">
                {formatMediaType(block.metadata.mediaType, dictionary)} • {block.metadata.mediaTitle}
              </span>
            </div>
            <h1 className="text-3xl font-serif text-neutral-950 leading-tight font-bold">{block.title}</h1>
            {block.metadata.subtitle && (
              <p className="text-sm font-serif italic text-neutral-500 border-l-2 border-brand-secondary/30 pl-4 py-1">
                {block.metadata.subtitle}
              </p>
            )}
          </div>

          <div className="bg-neutral-950 text-white p-7 rounded-4xl shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Info size={120} strokeWidth={1} />
            </div>
            <div className="flex items-center gap-2 text-neutral-400 mb-4 relative z-10">
              <Archive size={12} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">{dictionary.startingNote}</h2>
            </div>
            <p className="text-lg font-medium leading-relaxed relative z-10">
              {block.content}
            </p>
          </div>
        </section>
      );

    case "shortContext":
      return (
        <section className="archival-muted-bg p-8 rounded-4xl archival-border-double shadow-xl space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 rounded-full -mr-12 -mt-12" />
          <div className="flex items-center gap-2 text-brand-secondary relative z-10">
            <BookOpen size={16} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.knowThisFirst}</h2>
          </div>
          <div className="text-neutral-900 leading-[1.7] font-serif text-[19px] relative z-10">
            {block.content}
          </div>
        </section>
      );

    case "accuracyGuess":
      return (
        <div className="py-4">
          <AccuracyGuess
            cardId={cardId}
            actualAccuracy={block.metadata.actualAccuracy}
            onGuess={(guess) => setGuess(cardId, guess)}
            savedGuess={getGuess(cardId)}
            explanation={block.metadata.explanation}
          />
        </div>
      );

    case "mediaChanged":
      return (
        <section className="archival-muted-bg rounded-4xl p-8 archival-border-double shadow-md space-y-6">
          <div className="flex items-center gap-2 text-brand-secondary mb-1">
            <Split size={16} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">{dictionary.vsReality}</h2>
          </div>
          <div className="space-y-4">
            <div className="p-5 bg-neutral-50 rounded-2xl border-l-4 border-l-neutral-300">
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600 block mb-2">{dictionary.whatInFiction}</span>
              <p className="text-[15px] text-neutral-700 leading-relaxed italic">
                {block.content}
              </p>
            </div>
          </div>
        </section>
      );

    case "history":
      // Detect if this is a "Key Detail" (short insight)
      const isKeyDetail = block.content.length < 150 && !block.title;

      return (
        <section className="space-y-6">
          {block.title && (
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-4 flex items-center gap-3">
              <Archive size={12} className="text-brand-secondary/40" />
              <span className="text-neutral-950 font-black">{block.title}</span>
              <span className="flex-1 h-px bg-neutral-100"></span>
            </h2>
          )}

          {isKeyDetail ? (
            <div className="border-l-4 p-8 rounded-r-3xl bg-brand-secondary/5 border-l-brand-secondary shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <FileText size={48} />
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-brand-secondary mb-3">{dictionary.keyDetail}</div>
              <div className="text-neutral-900 leading-relaxed font-serif text-[19px] relative z-10">
                {block.content}
              </div>
            </div>
          ) : (
            <div className="leading-[1.8] font-serif text-[20px] text-neutral-950 px-1 space-y-4">
              {block.content.split('\n\n').map((p: string, i: number) => {
                const trimmed = p.trim();
                if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                  return (
                    <ul key={i} className="list-disc pl-8 space-y-3 my-4">
                      {trimmed.split('\n').map((li, liIndex) => (
                        <li key={liIndex} className="text-neutral-900">
                          {li.replace(/^[\*\-]\s+/, '').trim()}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="whitespace-pre-wrap">{trimmed}</p>;
              })}
            </div>
          )}
        </section>
      );

    case "whyItMatters":
      return (
        <section className="bg-brand-secondary/5 p-8 rounded-4xl border border-brand-secondary/20 border-l-4 border-l-brand-secondary relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 opacity-5">
            <Compass size={120} />
          </div>
          <div className="flex items-center gap-2 text-brand-secondary mb-4 relative z-10">
            <Compass size={16} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">{block.title || dictionary.conclusionImportance}</h2>
          </div>
          <p className="text-[17px] text-neutral-950 leading-relaxed font-medium relative z-10">
            {block.content}
          </p>
        </section>
      );

    case "sources":
      return (
        <section className="space-y-6 pt-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={16} className="text-neutral-600" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">{dictionary.sourcesReading}</h2>
            <span className="flex-1 h-px bg-neutral-100"></span>
          </div>
          <div className="grid gap-3">
            {(block.content as any[]).map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 bg-white/60 backdrop-blur-sm border border-black/5 rounded-2xl active:bg-white transition-all shadow-sm hover:shadow-md hover:border-brand-secondary/20"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-bold text-neutral-900 group-hover:text-brand-secondary transition-colors">{source.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-brand-secondary font-black uppercase tracking-widest bg-brand-secondary/5 px-1.5 py-0.5 rounded">
                      {source.type}
                    </span>
                    <span className="text-[9px] text-neutral-600 truncate max-w-[150px]">{new URL(source.url).hostname}</span>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-neutral-50 text-neutral-600 group-hover:bg-brand-secondary/10 group-hover:text-brand-secondary transition-all">
                  <ExternalLink size={14} />
                </div>
              </a>
            ))}
          </div>
        </section>
      );

    case "reflection":
      return (
        <section className="pt-10 text-center space-y-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">{dictionary.feelQuestion}</p>
          <div className="flex justify-center">
            <ReadReflection
              cardId={cardId}
              selectedReflections={getReflections(cardId)}
              onToggle={(r) => toggleReflection(cardId, r)}
            />
          </div>
        </section>
      );

    case "similar":
      if (!similarCards || similarCards.length === 0) return null;
      return (
        <section className="pt-10 space-y-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 text-center">{dictionary.similarDiscoveries}</h2>
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
      );

    default:
      return null;
  }
}
