import AsyncStorage from "@react-native-async-storage/async-storage";

/** Keys written by HistoryContext */
export const HISTORY_STORAGE_KEYS = [
  "saved_cards",
  "recent_cards",
  "read_cards",
  "read_days",
  "onboarding-completed",
  "save_hint_seen",
  "daily_reminder_enabled",
] as const;

const OTHER_APP_KEYS = ["app_locale", "learning_state"] as const;

function isAppStorageKey(key: string): boolean {
  return (
    (HISTORY_STORAGE_KEYS as readonly string[]).includes(key) ||
    (OTHER_APP_KEYS as readonly string[]).includes(key) ||
    key.startsWith("progress_")
  );
}

/** Wipes all True Frame persisted state (fresh install). */
export async function clearAppStorage(): Promise<void> {
  const all = await AsyncStorage.getAllKeys();
  const toRemove = all.filter(isAppStorageKey);
  if (toRemove.length > 0) {
    await AsyncStorage.multiRemove(toRemove);
  }
}
