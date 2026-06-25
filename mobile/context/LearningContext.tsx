import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AccuracyType } from "../../types/index";
import { countLearnedReflections } from "@shared/formatReadStreak";

type LearningState = {
  guesses: Record<string, AccuracyType>;
  reflections: Record<string, string[]>;
};

type LearningContextValue = {
  ready: boolean;
  learnedCount: number;
  learnedCardIds: string[];
  setGuess: (cardId: string, guess: AccuracyType) => void;
  getGuess: (cardId: string) => AccuracyType | undefined;
  toggleReflection: (cardId: string, reflection: string) => void;
  getReflections: (cardId: string) => string[];
};

const LearningContext = createContext<LearningContextValue | null>(null);
const STORAGE_KEY = "learning_state";

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LearningState>({ guesses: {}, reflections: {} });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw);
          setState((current) => ({
            guesses: { ...parsed.guesses, ...current.guesses },
            reflections: { ...parsed.reflections, ...current.reflections },
          }));
        } catch {
          /* ignore */
        }
      })
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback((next: LearningState) => {
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setGuess = useCallback(
    (cardId: string, guess: AccuracyType) => {
      setState((prev) => {
        const next = { ...prev, guesses: { ...prev.guesses, [cardId]: guess } };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const toggleReflection = useCallback(
    (cardId: string, reflection: string) => {
      setState((prev) => {
        const current = prev.reflections[cardId] || [];
        const updated = current.includes(reflection)
          ? current.filter((r) => r !== reflection)
          : [...current, reflection];
        const next = { ...prev, reflections: { ...prev.reflections, [cardId]: updated } };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const getReflections = useCallback(
    (cardId: string) => state.reflections[cardId] || [],
    [state.reflections]
  );

  const getGuess = useCallback((cardId: string) => state.guesses[cardId], [state.guesses]);

  const learnedCount = useMemo(
    () => countLearnedReflections(state.reflections),
    [state.reflections]
  );

  const learnedCardIds = useMemo(
    () =>
      Object.entries(state.reflections)
        .filter(([, tags]) => tags.includes("learned"))
        .map(([id]) => id),
    [state.reflections]
  );

  const value = useMemo(
    () => ({
      ready,
      learnedCount,
      learnedCardIds,
      setGuess,
      getGuess,
      toggleReflection,
      getReflections,
    }),
    [ready, learnedCount, learnedCardIds, setGuess, getGuess, toggleReflection, getReflections]
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error("useLearning requires LearningProvider");
  return ctx;
}
