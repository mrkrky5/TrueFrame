import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AccuracyType } from "../../types/index";

type LearningState = {
  guesses: Record<string, AccuracyType>;
  reflections: Record<string, string[]>;
};

type LearningContextValue = {
  setGuess: (cardId: string, guess: AccuracyType) => void;
  getGuess: (cardId: string) => AccuracyType | undefined;
  toggleReflection: (cardId: string, reflection: string) => void;
  getReflections: (cardId: string) => string[];
};

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LearningState>({ guesses: {}, reflections: {} });

  useEffect(() => {
    AsyncStorage.getItem("learning_state").then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        setState({
          guesses: parsed.guesses || {},
          reflections: parsed.reflections || {},
        });
      } catch {
        /* ignore */
      }
    });
  }, []);

  const setGuess = useCallback((cardId: string, guess: AccuracyType) => {
    setState((prev) => {
      const next = { ...prev, guesses: { ...prev.guesses, [cardId]: guess } };
      AsyncStorage.setItem("learning_state", JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleReflection = useCallback((cardId: string, reflection: string) => {
    setState((prev) => {
      const current = prev.reflections[cardId] || [];
      const updated = current.includes(reflection)
        ? current.filter((r) => r !== reflection)
        : [...current, reflection];
      const next = { ...prev, reflections: { ...prev.reflections, [cardId]: updated } };
      AsyncStorage.setItem("learning_state", JSON.stringify(next));
      return next;
    });
  }, []);

  const getReflections = useCallback(
    (cardId: string) => state.reflections[cardId] || [],
    [state.reflections]
  );

  const getGuess = useCallback((cardId: string) => state.guesses[cardId], [state.guesses]);

  const value = useMemo(
    () => ({ setGuess, getGuess, toggleReflection, getReflections }),
    [setGuess, getGuess, toggleReflection, getReflections]
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error("useLearning requires LearningProvider");
  return ctx;
}
