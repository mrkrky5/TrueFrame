import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { getDailyCard } from "@shared/daily";
import type { HistoryCard } from "../../types/index";

const DAILY_NOTIFICATION_ID = "true-frame-daily-reality-v2";
const LEGACY_DAILY_NOTIFICATION_IDS = ["true-frame-daily-reality"];
const NOTIFICATION_SCHEDULE_VERSION_KEY = "true-frame-notification-schedule-version";
/** Bump when notification identity or icon pipeline changes. */
const NOTIFICATION_SCHEDULE_VERSION = "2";

async function resetNotificationScheduleIfNeeded(
  Notifications: typeof import("expo-notifications")
): Promise<void> {
  const stored = await AsyncStorage.getItem(NOTIFICATION_SCHEDULE_VERSION_KEY);
  if (stored === NOTIFICATION_SCHEDULE_VERSION) return;

  for (const id of LEGACY_DAILY_NOTIFICATION_IDS) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.dismissAllNotificationsAsync();
  await AsyncStorage.setItem(NOTIFICATION_SCHEDULE_VERSION_KEY, NOTIFICATION_SCHEDULE_VERSION);
}

export async function ensureDailyReminderScheduled(
  cards: HistoryCard[],
  dictionary: {
    notifications: { dailyTitle: string; dailyBody: string };
  },
  enabled: boolean
): Promise<void> {
  if (Platform.OS !== "ios" || !enabled) {
    await cancelDailyReminder();
    return;
  }

  const Notifications = await import("expo-notifications");
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== "granted") return;

  await resetNotificationScheduleIfNeeded(Notifications);

  const daily = getDailyCard(cards);
  const body = (dictionary.notifications.dailyBody ?? "{{title}}").replace(
    "{{title}}",
    daily.title
  );

  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_NOTIFICATION_ID,
    content: {
      title: dictionary.notifications.dailyTitle,
      body,
      data: { cardId: daily.id, url: `/card/${daily.id}` },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
}

export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS !== "ios") return;
  const Notifications = await import("expo-notifications");
  for (const id of [...LEGACY_DAILY_NOTIFICATION_IDS, DAILY_NOTIFICATION_ID]) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
}

export function configureNotificationHandler(): void {
  if (Platform.OS !== "ios") return;
  void import("expo-notifications").then((Notifications) => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  });
}
