"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { HistoryCard } from "@/types";
import { deriveCardBlocks, ContentBlock } from "@/utils/contentBlocks";
import ReadingProgress from "./ReadingProgress";
import ContentBlockRenderer from "./ContentBlock";
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Home, ArrowLeft, X } from "lucide-react";
import Link from "next/link";

interface GuidedJourneyReaderProps {
  card: HistoryCard;
  learningState: any;
  similarCards: HistoryCard[];
  allCards: HistoryCard[];
  readIds: string[];
  dictionary: any;
  onComplete?: () => void;
}

import { useLocale } from "@/hooks/useLocale";
import ShareButton from "@/components/ui/ShareButton";
import SaveButton from "@/components/ui/SaveButton";
import { useSurface } from "@/components/utils/SurfaceProvider";

export default function GuidedJourneyReader({ card, learningState, similarCards, allCards, readIds, dictionary, onComplete }: GuidedJourneyReaderProps) {
  const locale = useLocale();
  const { isWebsite } = useSurface();
  const blocks = useMemo(() => deriveCardBlocks(card, dictionary), [card, dictionary]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Persistence: Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(`progress_${card.id}`);
    if (saved) {
      const step = parseInt(saved, 10);
      if (!isNaN(step) && step >= 0 && step < blocks.length) {
        setCurrentStep(step);
      }
    }
  }, [card.id, blocks.length]);

  // Persistence: Save progress on change
  useEffect(() => {
    if (!isCompleted) {
      localStorage.setItem(`progress_${card.id}`, currentStep.toString());
    }
  }, [card.id, currentStep, isCompleted]);

  // Manage visibility of main BottomNav and safe body class
  useEffect(() => {
    document.body.classList.add("hide-main-nav");
    return () => {
      document.body.classList.remove("hide-main-nav");
    };
  }, []);

  // Auto-scroll to top when step changes or completion
  useEffect(() => {
    if (containerRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, isCompleted]);

  const handleExit = () => {
    window.history.back();
  };

  const nextStep = () => {
    if (currentStep < blocks.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete?.();
      setIsCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (isCompleted) {
    return (
      <div ref={containerRef} className="flex flex-col items-center justify-center py-12 px-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-green-500/10 rounded-3xl flex items-center justify-center text-green-500 mb-6 mx-auto">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-3xl font-serif text-neutral-950 mb-3 text-center">{dictionary.common.dossierCompletedTitle}</h2>
        <p className="text-sm text-neutral-500 leading-relaxed text-center mb-10 max-w-xs mx-auto">
          {dictionary.common.dossierCompletedDesc}
        </p>

        <div className="grid gap-3 w-full max-w-xs mx-auto">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full py-4 bg-neutral-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-[0.98] transition-all"
          >
            <ArrowLeft size={16} /> {dictionary.common.goBackAndContinue}
          </button>
          <Link
            href={`/${locale}`}
            className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-black/5 text-neutral-900 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-[0.98] transition-all"
          >
            <Home size={16} /> {dictionary.common.returnHome}
          </Link>
        </div>

      </div>
    );
  }

  const currentBlock = blocks[currentStep];
  const isLast = currentStep === blocks.length - 1;
  const progressPercent = Math.round(((currentStep + 1) / blocks.length) * 100);

  // Validation for Accuracy Guess block
  const isNextDisabled = currentBlock.type === "accuracyGuess" && !learningState.getGuess(card.id);

  // Determine step density for adaptive styling
  const stepDensity = useMemo(() => {
    if (!currentBlock) return "medium";
    // Check type first
    if (["accuracyGuess", "hook", "summary"].includes(currentBlock.type)) return "short";

    // Check content length if available
    const contentText = typeof currentBlock.content === "string" ? currentBlock.content : "";
    if (contentText.length < 450) return "short";
    if (contentText.length > 900) return "long";
    return "medium";
  }, [currentBlock]);

  // Navigation button rendering (shared between modes)
  const navButtons = (
    <div className={`flex items-center gap-3 ${isWebsite ? "w-full" : "max-w-lg mx-auto px-6"}`}>
      {currentStep > 0 && (
        <button
          onClick={prevStep}
          className="h-14 w-14 shrink-0 rounded-2xl bg-white flex items-center justify-center text-neutral-950 active:scale-90 transition-all border border-black/10 shadow-lg"
          aria-label={dictionary.common.back}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <button
        onClick={nextStep}
        disabled={isNextDisabled}
        className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs transition-all shadow-2xl active:scale-[0.98] ${isNextDisabled
          ? "bg-neutral-200 text-neutral-400 shadow-none active:scale-100"
          : isLast
            ? "bg-green-600 text-white"
            : "bg-neutral-950 text-white"
          }`}
      >
        {isLast ? (
          <>
            <CheckCircle2 size={18} />
            {dictionary.common.completeJourney}
          </>
        ) : (
          <>
            {dictionary.common.continue}
            <ChevronRight size={18} />
          </>
        )}
      </button>
    </div>
  );

  return (
    <div ref={containerRef} className="relative flex flex-col min-h-screen">
      {/* Minimal Header for Progress */}
      <div className="fixed top-0 left-0 right-0 z-60 pointer-events-none transition-all duration-500">
        <div className="max-w-lg mx-auto px-6 pt-4 lg:hidden">
          <div className="bg-white/80 backdrop-blur-md rounded-full py-1.5 px-4 shadow-sm border border-black/5 flex items-center justify-between pointer-events-auto max-w-[140px] mx-auto">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
              aria-label={dictionary.common.journeyProgress}
              className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-brand-secondary transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[9px] font-black text-brand-secondary tabular-nums ml-3">
              {currentStep + 1}/{blocks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main
        className={`flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700 ${isWebsite ? "pt-24 lg:pt-32" : "pt-36"}`}
        style={!isWebsite ? { paddingBottom: "calc(env(safe-area-inset-bottom, 20px) + 160px)" } : undefined}
      >
        <div className={`px-6 ${isWebsite ? "max-w-7xl mx-auto" : "max-w-lg mx-auto"}`}>
          <div className={isWebsite ? "lg:grid lg:grid-cols-12 lg:gap-16 items-start" : ""}>

            {/* Main Stage (Content Column) */}
            <div className={`${isWebsite ? "lg:col-span-7 xl:col-span-8" : "w-full"}`}>
              <div className={isWebsite && stepDensity === "short" ? "min-h-[40vh] flex flex-col justify-center" : ""}>
                <ContentBlockRenderer
                  block={currentBlock}
                  cardId={card.id}
                  learningState={learningState}
                  isActive={true}
                  similarCards={isLast ? similarCards : []}
                />

                {/* Website Mode: Inline navigation that flows with content */}
                {isWebsite && (
                  <div className={`mt-12 mb-20 px-0 transition-all ${stepDensity === "short" ? "max-w-md" : "max-w-2xl"}`}>
                    {navButtons}
                  </div>
                )}
              </div>
            </div>

            {/* Context Rail (Desktop Only) */}
            {isWebsite && (
              <aside className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-32 self-start space-y-10 border-l border-black/5 pl-10 h-fit">
                {/* Progress Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    <span>{dictionary.common.journeyProgress}</span>
                    <span className="text-brand-secondary">{progressPercent}%</span>
                  </div>
                  <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-secondary transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Journey Map / Vertical Steps */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-900">
                    {dictionary.common.dossierStructure}
                  </h3>
                  <div className="relative space-y-6 pl-4 border-l border-neutral-100">
                    {blocks.map((block, idx) => {
                      const isActive = idx === currentStep;
                      const isPast = idx < currentStep;
                      return (
                        <div key={idx} className="relative group">
                          {/* Dot */}
                          <div className={`absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 z-10 ${isActive ? "bg-brand-secondary border-brand-secondary scale-125 shadow-sm" :
                              isPast ? "bg-brand-secondary border-brand-secondary opacity-40" :
                                "bg-white border-neutral-200"
                            }`} />

                          <div className={`transition-all duration-300 ${isActive ? "opacity-100 translate-x-1" : "opacity-40"}`}>
                            <div className="text-[9px] font-black uppercase tracking-tighter text-neutral-400 mb-0.5">
                              {idx + 1}. {block.type}
                            </div>
                            <div className={`text-[11px] leading-tight font-serif ${isActive ? "text-neutral-900 font-bold" : "text-neutral-600"}`}>
                              {block.title || (idx === 0 ? "Entry" : "Historical Insight")}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Context Mini Card */}
                <div className="p-5 bg-neutral-50 rounded-2xl border border-black/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      {card.mediaType}
                    </span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-neutral-900 leading-snug">
                    {card.title}
                  </h4>
                  <div className="flex items-center gap-3 pt-2">
                    <ShareButton
                      title={card.title}
                      text={card.quickRealityCheck || card.subtitle}
                    />
                    <SaveButton cardId={card.id} />
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>

      {/* App Mode: Fixed bottom navigation for thumb-friendly mobile UX */}
      {!isWebsite && (
        <footer className="fixed bottom-0 left-0 right-0 pt-10 pb-[env(safe-area-inset-bottom,16px)] bg-linear-to-t from-bg-main via-bg-main/95 to-transparent z-40 pointer-events-none">
          <div className="pointer-events-auto">
            {navButtons}
          </div>
          <div className="h-4" />
        </footer>
      )}
    </div>
  );
}
