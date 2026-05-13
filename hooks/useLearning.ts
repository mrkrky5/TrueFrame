import { useState, useEffect } from "react";
import { AccuracyType } from "@/types";

interface LearningState {
  guesses: Record<string, AccuracyType>;
  reflections: Record<string, string[]>;
}

export function useLearning() {
  const [state, setState] = useState<LearningState>({
    guesses: {},
    reflections: {}
  });

  useEffect(() => {
    const saved = localStorage.getItem("learning_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({
          guesses: parsed.guesses || {},
          reflections: parsed.reflections || {}
        });
      } catch (e) {
        console.error("Öğrenme durumu yüklenemedi", e);
      }
    }
  }, []);

  const saveState = (newState: LearningState) => {
    setState(newState);
    localStorage.setItem("learning_state", JSON.stringify(newState));
  };

  const setGuess = (cardId: string, guess: AccuracyType) => {
    const newState = {
      ...state,
      guesses: { ...state.guesses, [cardId]: guess }
    };
    saveState(newState);
  };

  const toggleReflection = (cardId: string, reflection: string) => {
    const current = state.reflections[cardId] || [];
    const updated = current.includes(reflection)
      ? current.filter(r => r !== reflection)
      : [...current, reflection];
    
    const newState = {
      ...state,
      reflections: { ...state.reflections, [cardId]: updated }
    };
    saveState(newState);
  };

  const getGuess = (cardId: string) => state.guesses[cardId];
  const getReflections = (cardId: string) => state.reflections[cardId] || [];

  return { setGuess, getGuess, toggleReflection, getReflections };
}

// Utility to handle JSON parse safely if needed, but here simple helper
function jsonParse(str: string) {
  return JSON.parse(str);
}
