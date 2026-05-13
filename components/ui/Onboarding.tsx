"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Swords, BookOpen, ShieldAlert } from "lucide-react";
import { useDictionary } from "@/components/utils/DictionaryProvider";

export default function Onboarding() {
  const [isVisible, setIsVisible] = useState(false);
  const dictionary = useDictionary();

  useEffect(() => {
    const hasCompleted = localStorage.getItem("onboarding-completed");
    if (!hasCompleted) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("force-onboarding");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleComplete = () => {
    localStorage.setItem("onboarding-completed", "true");
    document.documentElement.classList.remove("force-onboarding");
    document.body.style.overflow = "auto";
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-100 bg-white/95 backdrop-blur-xl flex flex-col p-8 animate-in fade-in zoom-in duration-500 overflow-y-auto">
      <div className="max-w-xs w-full mx-auto my-auto py-10 flex flex-col min-h-full">
        <header className="animate-in fade-in slide-in-from-top-8 duration-700 delay-150 mb-12 text-center">
          <div className="w-16 h-16 bg-brand-secondary/10 rounded-3xl flex items-center justify-center text-brand-secondary mx-auto mb-8 shadow-inner">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-serif text-neutral-950 mb-4 tracking-tight">
            {dictionary.common?.onboarding?.welcome || "Welcome"}
          </h1>
          <p className="text-[13px] text-neutral-500 leading-relaxed font-medium">
            {dictionary.common?.onboarding?.subtitle || "Journey Beyond History"}
          </p>
        </header>

        <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 flex-1">
          <FeatureItem
            icon={<Swords size={18} />}
            title={dictionary.common?.onboarding?.features?.media?.title || "Media & Reality"}
            desc={dictionary.common?.onboarding?.features?.media?.desc || "Explore the real history behind games, films, and series."}
          />
          <FeatureItem
            icon={<BookOpen size={18} />}
            title={dictionary.common?.onboarding?.features?.content?.title || "Deep Content"}
            desc={dictionary.common?.onboarding?.features?.content?.desc || "Instead of short notes, enjoy meaningful readings supported by sources."}
          />
          <FeatureItem
            icon={<ShieldAlert size={18} />}
            title={dictionary.common?.onboarding?.features?.spoiler?.title || "Spoiler Protection"}
            desc={dictionary.common?.onboarding?.features?.spoiler?.desc || "Don't spoil the story with protection that activates when you want."}
          />
        </div>

        <div className="pt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <button
            onClick={handleComplete}
            className="w-full bg-neutral-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] active:scale-95 transition-all shadow-2xl hover:bg-neutral-800"
          >
            {dictionary.common?.onboarding?.cta || "Start Exploring"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-10 h-10 bg-white border border-black/5 rounded-xl flex items-center justify-center text-brand-secondary shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-1">{title}</h3>
        <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
