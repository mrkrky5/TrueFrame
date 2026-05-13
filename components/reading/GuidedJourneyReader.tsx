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
import NextDiscoveryCard from "@/components/ui/NextDiscoveryCard";

export default function GuidedJourneyReader({ card, learningState, similarCards, allCards, readIds, dictionary, onComplete }: GuidedJourneyReaderProps) {
  const locale = useLocale();
  const blocks = useMemo(() => deriveCardBlocks(card), [card]);
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
      <div ref={containerRef} className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-6 animate-in fade-in zoom-in-95 duration-500">
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

        <div className="w-full mt-6">
          <NextDiscoveryCard 
            currentCard={card}
            allCards={allCards}
            readIds={readIds}
            locale={locale}
            dictionary={dictionary}
          />
        </div>
      </div>
    );
  }

  const currentBlock = blocks[currentStep];
  const isLast = currentStep === blocks.length - 1;
  const progressPercent = Math.round(((currentStep + 1) / blocks.length) * 100);

  // Validation for Accuracy Guess block
  const isNextDisabled = currentBlock.type === "accuracyGuess" && !learningState.getGuess(card.id);

  return (
    <div ref={containerRef} className="relative flex flex-col min-h-[60vh]">
      {/* Header Progress & Exit */}
      <div className="fixed top-0 left-0 right-0 z-80 bg-bg-main/95 backdrop-blur-md pb-4 border-b border-black/5">
        <div className="max-w-lg mx-auto pt-4 px-6 safe-area-top">
          <div className="bg-white rounded-full py-2.5 px-4 shadow-sm border border-black/10 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={handleExit}
                className="p-1.5 -ml-1 text-neutral-950 active:scale-90 transition-transform"
                aria-label={dictionary.common.close}
              >
                <X size={20} strokeWidth={3} />
              </button>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
                aria-label={dictionary.common.journeyProgress}
                className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden mx-2"
              >
                <div
                  className="h-full bg-brand-secondary transition-all duration-700 ease-out shadow-[0_0_8px_rgba(197,160,89,0.4)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-brand-secondary tabular-nums min-w-14 text-right">
                {currentStep + 1} / {blocks.length}
              </span>
            </div>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(0)}
                className="ml-4 p-2 text-neutral-400 active:text-brand-secondary active:scale-90 transition-all"
                aria-label={dictionary.common.restartFromBeginning}
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main
        className="flex-1 pt-28 animate-in fade-in slide-in-from-bottom-4 duration-700"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 20px) + 160px)' }}
      >
        <div className="min-h-[50vh] px-6">
          <ContentBlockRenderer
            block={currentBlock}
            cardId={card.id}
            learningState={learningState}
            isActive={true}
            similarCards={isLast ? similarCards : []}
          />
        </div>
      </main>

      {/* Navigation Controls */}
      <footer className="fixed bottom-0 left-0 right-0 pt-10 pb-[env(safe-area-inset-bottom,16px)] bg-linear-to-t from-bg-main via-bg-main/95 to-transparent z-40 pointer-events-none">
        <div className="max-w-lg mx-auto px-6 flex items-center gap-3 pb-4 pointer-events-auto">
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
      </footer>
    </div>
  );
}
