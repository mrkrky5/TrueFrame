"use client";

import React, { useEffect, useState } from "react";

interface ReadingProgressProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export default function ReadingProgress({ totalSteps, currentStep, className = "" }: ReadingProgressProps) {
  return (
    <div className={`flex gap-1 h-0.5 px-10 ${className}`}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;

        return (
          <div 
            key={i}
            className={`flex-1 rounded-full transition-all duration-700 ease-out ${
              isCurrent 
                ? "bg-brand-secondary opacity-100 scale-y-[2]" 
                : isCompleted
                  ? "bg-brand-secondary opacity-60" 
                  : "bg-neutral-200 opacity-40"
            } motion-reduce:transition-none motion-reduce:scale-y-100`}
            style={{
              transitionDelay: isCurrent ? '0ms' : `${Math.abs(i - currentStep) * 50}ms`
            }}
          />
        );
      })}
    </div>
  );
}
