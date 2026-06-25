import { useCallback } from "react";

import { useHistory } from "@/context/HistoryContext";
import { useLearning } from "@/context/LearningContext";

export function useCardReflection(cardId: string) {
  const { getReflections, toggleReflection } = useLearning();
  const { toggleSave, isSaved } = useHistory();

  const selectedReflections = getReflections(cardId);

  const onToggle = useCallback(
    (reflection: string) => {
      const wasSelected = selectedReflections.includes(reflection);
      toggleReflection(cardId, reflection);
      if (reflection === "later" && !wasSelected && !isSaved(cardId)) {
        toggleSave(cardId);
      }
    },
    [cardId, selectedReflections, toggleReflection, toggleSave, isSaved]
  );

  return {
    selectedReflections,
    onToggle,
    showLaterSaved: selectedReflections.includes("later"),
    showSurprisedHint: selectedReflections.includes("surprised"),
  };
}
