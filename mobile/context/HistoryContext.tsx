import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { normalizeDailyGoal, type DailyGoalCards } from "@shared/readingGoal";
import { addReadDay, computeReadStreak, formatReadDay } from "@shared/readStreak";

const KEYS = {
  saved: "saved_cards",
  recent: "recent_cards",
  read: "read_cards",
  readDays: "read_days",
  readsTodayDate: "reads_today_date",
  readsTodayCount: "reads_today_count",
  onboarding: "onboarding-completed",
  saveHint: "save_hint_seen",
  dailyReminder: "daily_reminder_enabled",
  dailyGoal: "daily_goal_cards",
} as const;

type HistoryState = {
  savedIds: string[];
  recentIds: string[];
  readIds: string[];
};

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)];
}

type HistoryContextValue = HistoryState & {
  ready: boolean;
  readStreak: number;
  readToday: boolean;
  readsTodayCount: number;
  dailyReminderEnabled: boolean;
  setDailyReminderEnabled: (enabled: boolean) => Promise<void>;
  dailyGoalCards: DailyGoalCards;
  setDailyGoalCards: (goal: DailyGoalCards) => Promise<void>;
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
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? uniqueIds(parsed) : [];
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
  const [readsToday, setReadsToday] = useState({ date: "", count: 0 });
  const [dailyReminderEnabled, setDailyReminderEnabledState] = useState(true);
  const [dailyGoalCards, setDailyGoalCardsState] = useState<DailyGoalCards>(1);

  useEffect(() => {
    (async () => {
      const [savedIds, recentIds, readIds, days, onboarding, saveHint, reminder, goalRaw, todayDate, todayCount] =
        await Promise.all([
          readJson(KEYS.saved),
          readJson(KEYS.recent),
          readJson(KEYS.read),
          readJson(KEYS.readDays),
          AsyncStorage.getItem(KEYS.onboarding),
          AsyncStorage.getItem(KEYS.saveHint),
          AsyncStorage.getItem(KEYS.dailyReminder),
          AsyncStorage.getItem(KEYS.dailyGoal),
          AsyncStorage.getItem(KEYS.readsTodayDate),
          AsyncStorage.getItem(KEYS.readsTodayCount),
        ]);

      const today = formatReadDay();
      const parsedCount =
        todayDate === today ? parseInt(todayCount ?? "0", 10) || 0 : 0;

      setState({ savedIds, recentIds, readIds });
      setReadDays(days);
      setReadsToday({ date: todayDate === today ? today : "", count: parsedCount });
      setOnboardingDone(onboarding === "true");
      setSaveHintSeen(saveHint === "true");
      setDailyReminderEnabledState(reminder !== "false");
      setDailyGoalCardsState(normalizeDailyGoal(parseInt(goalRaw ?? "", 10)));
      setReady(true);
    })();
  }, []);

  const readStreak = useMemo(() => computeReadStreak(readDays), [readDays]);
  const readToday = useMemo(() => readDays.includes(formatReadDay()), [readDays]);

  const setDailyReminderEnabled = useCallback(async (enabled: boolean) => {
    setDailyReminderEnabledState(enabled);
    await AsyncStorage.setItem(KEYS.dailyReminder, enabled ? "true" : "false");
  }, []);

  const setDailyGoalCards = useCallback(async (goal: DailyGoalCards) => {
    setDailyGoalCardsState(goal);
    await AsyncStorage.setItem(KEYS.dailyGoal, String(goal));
  }, []);

  const dismissSaveHint = useCallback(() => {
    setSaveHintSeen(true);
    void AsyncStorage.setItem(KEYS.saveHint, "true");
  }, []);

  const toggleSave = useCallback(
    (id: string) => {
      setState((prev) => {
        const removing = prev.savedIds.includes(id);
        const savedIds = removing
          ? prev.savedIds.filter((x) => x !== id)
          : uniqueIds([...prev.savedIds, id]);
        void AsyncStorage.setItem(KEYS.saved, JSON.stringify(savedIds));
        if (!removing) dismissSaveHint();
        return { ...prev, savedIds };
      });
    },
    [dismissSaveHint]
  );

  const addRecent = useCallback((id: string) => {
    setState((prev) => {
      const recentIds = [id, ...prev.recentIds.filter((x) => x !== id)].slice(0, 10);
      void AsyncStorage.setItem(KEYS.recent, JSON.stringify(recentIds));
      return { ...prev, recentIds };
    });
  }, []);

  const readsTodayCount = readsToday.date === formatReadDay() ? readsToday.count : 0;

  const markAsRead = useCallback((id: string) => {
    setState((prev) => {
      if (prev.readIds.includes(id)) return prev;
      const readIds = [...prev.readIds, id];
      void AsyncStorage.setItem(KEYS.read, JSON.stringify(readIds));
      return { ...prev, readIds };
    });
    setReadDays((prev) => {
      const next = addReadDay(prev);
      void AsyncStorage.setItem(KEYS.readDays, JSON.stringify(next));
      return next;
    });
    setReadsToday((prev) => {
      const today = formatReadDay();
      const next =
        prev.date === today
          ? { date: today, count: prev.count + 1 }
          : { date: today, count: 1 };
      void AsyncStorage.setItem(KEYS.readsTodayDate, next.date);
      void AsyncStorage.setItem(KEYS.readsTodayCount, String(next.count));
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
      readsTodayCount,
      dailyReminderEnabled,
      setDailyReminderEnabled,
      dailyGoalCards,
      setDailyGoalCards,
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
      readsTodayCount,
      dailyReminderEnabled,
      setDailyReminderEnabled,
      dailyGoalCards,
      setDailyGoalCards,
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
