"use client";

import React from "react";
import { MessageSquare, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

interface MissingMediaRequestProps {
  dictionary: any;
}

export default function MissingMediaRequest({ dictionary }: MissingMediaRequestProps) {
  const t = dictionary.explore;

  return (
    <div className="mt-12 pt-8 border-t border-black/5 text-center space-y-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 bg-brand-secondary/10 rounded-xl flex items-center justify-center text-brand-secondary mb-3">
          <MessageSquare size={18} />
        </div>
        <h4 className="text-sm font-serif text-neutral-950 font-bold">{t.missingMediaTitle}</h4>
        <p className="text-xs text-neutral-500 max-w-[240px] mx-auto mt-1 leading-relaxed">
          {t.missingMediaDesc}
        </p>
      </div>
      
      <a 
        href={SITE_CONFIG.feedbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-secondary bg-brand-secondary/5 px-6 py-2.5 rounded-xl border border-brand-secondary/10 active:scale-95 transition-all"
      >
        {t.missingMediaCta} <ArrowRight size={14} />
      </a>
    </div>
  );
}
