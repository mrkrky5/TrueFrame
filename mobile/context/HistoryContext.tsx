import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { addReadDay, computeReadStreak, formatReadDay } from "@shared/readStreak";

const KEYS = {
  saved: "saved_cards",
  recent: "recent_cards",
  read: "read_cards",
  readDays: "read_days",
  onboarding: "onboarding-completed",
  saveHint: "save_hint_seen",
  dailyReminder: "daily_reminder_enabled",
} as const;

type HistoryState = {
  savedIds: string[];
  recentIds: string[];
  readIds: string[];
};

type HistoryContextValue = HistoryState & {
  ready: boolean;
  readStreak: number;
  readToday: boolean;
  dailyReminderEnabled: boolean;
  setDailyReminderEnabled: (enabled: boolean) => Promise<void>;
  toggleSave: (id: string) => void;
  addRecent: (id: string) => void;
  markAsRead: (id: string) => void;
  isSaved: (id: string) => boolean;
  isRead: (id: string) => boolean;
  onboardingDone: boolean;
  completeOnboarding: () => Promise<void>;
  saveHintSeen: boolean;
  dismissSaveHint: () => void;
};

const HistoryContext = createContext<HistoryContextValue | null>(null);

async function readJson(key: string): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HistoryState>({
    savedIds: [],
    recentIds: [],
    readIds: [],
  });
  const [ready, setReady] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(true);
  const [saveHintSeen, setSaveHintSeen] = useState(true);
  const [readDays, setReadDays] = useState<string[]>([]);
  const [dailyReminderEnabled, setDailyReminderEnabledState] = useState(true);

  useEffect(() => {
    (async () => {
      const [savedIds, recentIds, readIds, days, onboarding, saveHint, reminder] =
        await Promise.all([
          readJson(KEYS.saved),
          readJson(KEYS.recent),
          readJson(KEYS.read),
          readJson(KEYS.readDays),
          AsyncStorage.getItem(KEYS.onboarding),
          AsyncStorage.getItem(KEYS.saveHint),
          AsyncStorage.getItem(KEYS.dailyReminder),
        ]);

      setState({ savedIds, recentIds, readIds });
      setReadDays(days);
      setOnboardingDone(onboarding === "true");
      setSaveHintSeen(saveHint === "true");
      setDailyReminderEnabledState(reminder !== "false");
      setReady(true);
    })();
  }, []);

  const readStreak = useMemo(() => computeReadStreak(readDays), [readDays]);
  const readToday = useMemo(() => readDays.includes(formatReadDay()), [readDays]);

  const setDailyReminderEnabled = useCallback(async (enabled: boolean) => {
    setDailyReminderEnabledState(enabled);
    await AsyncStorage.setItem(KEYS.dailyReminder, enabled ? "true" : "false");
  }, []);

  const dismissSaveHint = useCallback(() => {
    setSaveHintSeen(true);
    void AsyncStorage.setItem(KEYS.saveHint, "true");
  }, []);

  const toggleSave = useCallback(
    (id: string) => {
      setState((prev) => {
        const savedIds = prev.savedIds.includes(id)
          ? prev.savedIds.filter((x) => x !== id)
          : [...prev.savedIds, id];
        AsyncStorage.setItem(KEYS.saved, JSON.stringify(savedIds));
        return { ...prev, savedIds };
      });
      dismissSaveHint();
    },
    [dismissSaveHint]
  );

  const addRecent = useCallback((id: string) => {
    setState((prev) => {
      const recentIds = [id, ...prev.recentIds.filter((x) => x !== id)].slice(0, 10);
      AsyncStorage.setItem(KEYS.recent, JSON.stringify(recentIds));
      return { ...prev, recentIds };
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setState((prev) => {
      if (prev.readIds.includes(id)) return prev;
      const readIds = [...prev.readIds, id];
      AsyncStorage.setItem(KEYS.read, JSON.stringify(readIds));
      return { ...prev, readIds };
    });
    setReadDays((prev) => {
      const next = addReadDay(prev);
      void AsyncStorage.setItem(KEYS.readDays, JSON.stringify(next));
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(KEYS.onboarding, "true");
    setOnboardingDone(true);
  }, []);

  const value = useMemo<HistoryContextValue>(
    () => ({
      ...state,
      ready,
      readStreak,
      readToday,
      dailyReminderEnabled,
      setDailyReminderEnabled,
      toggleSave,
      addRecent,
      markAsRead,
      isSaved: (id) => state.savedIds.includes(id),
      isRead: (id) => state.readIds.includes(id),
      onboardingDone,
      completeOnboarding,
      saveHintSeen,
      dismissSaveHint,
    }),
    [
      state,
      ready,
      readStreak,
      readToday,
      dailyReminderEnabled,
      setDailyReminderEnabled,
      toggleSave,
      addRecent,
      markAsRead,
      onboardingDone,
      completeOnboarding,
      saveHintSeen,
      dismissSaveHint,
    ]
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory requires HistoryProvider");
  return ctx;
}
