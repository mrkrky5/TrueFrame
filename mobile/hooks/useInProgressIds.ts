import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

/** Card IDs with saved flagship progress that is not finished. */
export function useInProgressIds(cardIds: string[], readIds: string[]) {
  const [inProgressIds, setInProgressIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const unread = cardIds.filter((id) => !readIds.includes(id));
    if (unread.length === 0) {
      setInProgressIds(new Set());
      setLoaded(true);
      return;
    }

    Promise.all(
      unread.map(async (id) => {
        const raw = await AsyncStorage.getItem(`progress_${id}`);
        if (!raw) return null;
        const step = parseInt(raw, 10);
        if (isNaN(step) || step <= 0) return null;
        return id;
      })
    ).then((results) => {
      if (!active) return;
      setInProgressIds(new Set(results.filter(Boolean) as string[]));
      setLoaded(true);
    });

    return () => {
      active = false;
    };
  }, [cardIds.join("|"), readIds.join("|")]);

  return { inProgressIds, loaded };
}
