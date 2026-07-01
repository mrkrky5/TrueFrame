import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";

import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { useNavigationTab } from "@/context/NavigationContext";
import { getCards } from "@shared/content";
import { navigateToCard } from "@/utils/navigationExit";
import {
  cancelDailyReminder,
  configureNotificationHandler,
  ensureDailyReminderScheduled,
} from "@/utils/dailyNotifications";

configureNotificationHandler();

export default function DailyNotificationBootstrap() {
  const router = useRouter();
  const { setReaderReturn } = useNavigationTab();
  const { locale, dictionary } = useLocale();
  const { ready, onboardingDone, dailyReminderEnabled } = useHistory();
  const syncedRef = useRef(false);
  const handledNotificationRef = useRef<string | null>(null);

  useEffect(() => {
    if (!ready || !onboardingDone || Platform.OS !== "ios") return;

    const cards = getCards(locale);
    void ensureDailyReminderScheduled(cards, dictionary, dailyReminderEnabled).then(() => {
      syncedRef.current = true;
    });

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void ensureDailyReminderScheduled(cards, dictionary, dailyReminderEnabled);
      }
    });

    return () => sub.remove();
  }, [ready, onboardingDone, dailyReminderEnabled, locale, dictionary]);

  useEffect(() => {
    if (!dailyReminderEnabled) {
      void cancelDailyReminder();
    }
  }, [dailyReminderEnabled]);

  useEffect(() => {
    if (Platform.OS !== "ios") return;

    let cancelled = false;
    let sub: { remove: () => void } | undefined;

    void import("expo-notifications").then((Notifications) => {
      if (cancelled) return;

      const openFromResponse = (
        response: import("expo-notifications").NotificationResponse | null
      ) => {
        const requestId = response?.notification.request.identifier;
        if (requestId && handledNotificationRef.current === requestId) return;
        if (requestId) handledNotificationRef.current = requestId;

        const cardId = response?.notification.request.content.data?.cardId as string | undefined;
        if (cardId) {
          navigateToCard(router, cardId, setReaderReturn, { kind: "tab", tab: "index" });
          return;
        }
        const url = response?.notification.request.content.data?.url as string | undefined;
        if (url) router.push(url as never);
      };

      void Notifications.getLastNotificationResponseAsync().then((last) => {
        if (last) openFromResponse(last);
      });

      sub = Notifications.addNotificationResponseReceivedListener(openFromResponse);
    });

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [router, setReaderReturn]);

  return null;
}
