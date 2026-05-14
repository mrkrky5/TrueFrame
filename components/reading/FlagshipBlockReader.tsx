"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { HistoryCard } from "@/types";
import { deriveCardBlocks, ContentBlock } from "@/utils/contentBlocks";
import ReadingProgress from "./ReadingProgress";
import ContentBlockRenderer from "./ContentBlock";

interface FlagshipBlockReaderProps {
  card: HistoryCard;
  learningState: any;
  similarCards: HistoryCard[];
  onComplete?: () => void;
  dictionary: any;
}

export default function FlagshipBlockReader({ card, learningState, similarCards, onComplete, dictionary }: FlagshipBlockReaderProps) {
  const blocks = useMemo(() => deriveCardBlocks(card, dictionary), [card, dictionary]);
  const [currentStep, setCurrentStep] = useState(0);
  const blockRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers = blocks.map((_, index) => {
      return new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCurrentStep(index);
          }
        },
        { threshold: 0.3, rootMargin: "-10% 0% -60% 0%" }
      );
    });

    blocks.forEach((_, index) => {
      const el = blockRefs.current[index];
      if (el) observers[index].observe(el);
    });

    return () => {
      observers.forEach(o => o.disconnect());
    };
  }, [blocks]);

  return (
    <div className="relative">
      {/* Fixed Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-100 safe-area-top pointer-events-none">
        <div className="max-w-lg mx-auto pt-20">
          <ReadingProgress
            totalSteps={blocks.length}
            currentStep={currentStep}
          />
        </div>
      </div>

      {/* Blocks Container */}
      <div className="space-y-12 pb-20">
        {blocks.map((block, index) => {
          const isNearby = Math.abs(index - currentStep) <= 1;
          const isActive = index === currentStep;

          return (
            <div
              key={block.id}
              ref={el => { blockRefs.current[index] = el; }}
              className={`transition-all duration-700 ease-out motion-safe:transition-transform ${isActive
                  ? "opacity-100 translate-y-0"
                  : isNearby
                    ? "opacity-70 -translate-y-2"
                    : "opacity-40 -translate-y-4"
                } motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100`}
            >
              <ContentBlockRenderer
                block={block}
                cardId={card.id}
                learningState={learningState}
                isActive={isActive}
                similarCards={index === blocks.length - 1 ? similarCards : []}
              />
            </div>
          );
        })}
      </div>

      {/* Completion Indicator */}
      {currentStep === blocks.length - 1 && (
        <div className="text-center py-16 animate-in fade-in zoom-in duration-1000 ease-out">
          <div className="inline-flex items-center gap-2 px-8 py-3 bg-green-50 text-green-700 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-green-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            DOSYA TAMAMLANDI
          </div>
        </div>
      )}
    </div>
  );
}
