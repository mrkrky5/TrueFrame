import { Platform } from "react-native";

import { getDailyCard } from "@shared/daily";
import type { HistoryCard } from "../../types/index";

const DAILY_NOTIFICATION_ID = "true-frame-daily-reality";

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
  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);
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
