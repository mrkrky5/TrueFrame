"use client";

import React from "react";
import { MessageSquare, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

interface FeedbackCardProps {
  dictionary: any;
}

export default function FeedbackCard({ dictionary, locale }: { dictionary: any; locale: string }) {
  const t = dictionary.feedback;

  return (
    <section className="mt-8 mb-12">
      <div className="bg-brand-secondary/5 border border-brand-secondary/10 rounded-4xl p-8 relative overflow-hidden group">
        <div className="absolute -right-8 -top-8 text-brand-secondary opacity-[0.04] rotate-12 group-hover:rotate-0 transition-transform duration-500 pointer-events-none select-none">
          <MessageSquare size={100} />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-xl font-serif text-neutral-950 mb-2 flex items-center gap-2">
            <MessageSquare size={20} className="text-brand-secondary" />
            {t.title}
          </h2>
          <p className="text-sm text-neutral-600 mb-6 max-w-[280px] leading-relaxed">
            {t.desc}
          </p>
          
          <a 
            href={`mailto:${(SITE_CONFIG.feedbackEmail as any)[locale] || SITE_CONFIG.feedbackEmail.tr}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
          >
            {t.cta} <ArrowRight size={14} />
          </a>

          <div className="mt-8 flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-neutral-400">
            <a href={`/${locale}/privacy`} className="hover:text-brand-secondary transition-colors">{dictionary.legal.privacy}</a>
            <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
            <a href={`/${locale}/terms`} className="hover:text-brand-secondary transition-colors">{dictionary.legal.terms}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
