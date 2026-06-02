import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useCardProgress(cardId: string, totalBlocks: number) {
  const [step, setStep] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(`progress_${cardId}`).then((raw) => {
      if (!active) return;
      const n = raw ? parseInt(raw, 10) : 0;
      setStep(!isNaN(n) && n >= 0 ? n : 0);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [cardId]);

  const pct = totalBlocks > 0 ? Math.min(100, Math.round(((step + 1) / totalBlocks) * 100)) : 0;
  const inProgress = loaded && step > 0 && step < totalBlocks - 1;

  return { step, pct, inProgress, loaded };
}
