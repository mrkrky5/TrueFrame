import { useEffect, useState } from "react";

import { clearAppStorage } from "@/utils/clearAppStorage";

const RESET_FIRST_RUN = process.env.EXPO_PUBLIC_RESET_FIRST_RUN === "true";

/**
 * When EXPO_PUBLIC_RESET_FIRST_RUN=true, clears AsyncStorage before any provider
 * reads persisted state (locale, history, card progress, etc.).
 */
export default function DevFreshGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!RESET_FIRST_RUN);

  useEffect(() => {
    if (!RESET_FIRST_RUN) return;
    void clearAppStorage().then(() => setReady(true));
  }, []);

  if (!ready) return null;
  return children;
}
