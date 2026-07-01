import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import AnimatedPressable from "@/components/motion/AnimatedPressable";
import ProgressBar from "@/components/motion/ProgressBar";
import { surfaces, cardShadow } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { type } from "@/constants/typography";
import { useLocale } from "@/context/LocaleContext";
import { useNavigationTab, type ReaderReturn } from "@/context/NavigationContext";
import { navigateToCard, pushToCard } from "@/utils/navigationExit";
import { flattenStyle } from "@/utils/flattenStyle";
import { formatMediaType } from "@shared/contentBlocks";
import type { HistoryCard } from "../../types/index";

export default function CardRow({
  card,
  locale,
  subtitle,
  badge,
  progressPct,
  isRead,
  beforeNavigate,
  returnTo,
  navigationMode = "push",
}: {
  card: HistoryCard;
  locale: string;
  subtitle?: string;
  badge?: string;
  progressPct?: number;
  isRead?: boolean;
  beforeNavigate?: () => void;
  returnTo?: ReaderReturn;
  navigationMode?: "push" | "replace";
}) {
  const { dictionary } = useLocale();
  const router = useRouter();
  const { setReaderReturn } = useNavigationTab();
  const mediaLabel = formatMediaType(card.mediaType, dictionary);
  const minutesLabel = dictionary.common.minutesShort ?? dictionary.common.minutes;

  const openCard = () => {
    if (returnTo) {
      beforeNavigate?.();
      navigateToCard(router, card.id, setReaderReturn, returnTo, navigationMode);
      return;
    }
    beforeNavigate?.();
    pushToCard(router, card.id);
  };

  return (
    <AnimatedPressable style={flattenStyle([styles.row, isRead ? styles.rowRead : null])} onPress={openCard}>
      <View style={styles.meta}>
        <Text style={styles.media}>{card.mediaTitle}</Text>
        {badge ? (
          <Text style={styles.badge}>{badge}</Text>
        ) : isRead ? (
          <Text style={styles.badge}>{dictionary.common.readStatus}</Text>
        ) : null}
      </View>
      <Text style={[styles.title, isRead ? styles.titleRead : null]} numberOfLines={2}>
        {card.title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      ) : (
        <Text style={styles.subtitle} numberOfLines={2}>
          {card.subtitle || card.whatWeSee}
        </Text>
      )}
      {progressPct !== undefined ? (
        <ProgressBar pct={progressPct} trackStyle={styles.progressTrack} />
      ) : null}
      <Text style={styles.time}>
        {card.readingTimeMinutes} {minutesLabel} · {mediaLabel}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    ...surfaces.card,
    ...cardShadow,
    padding: 18,
    marginBottom: 12,
  },
  rowRead: {
    opacity: 0.58,
    backgroundColor: theme.paper,
    borderColor: theme.border,
  },
  meta: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  media: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: theme.accent,
    flex: 1,
  },
  badge: {
    fontSize: 9,
    fontWeight: "800",
    color: theme.muted,
    letterSpacing: 1,
  },
  title: {
    ...type.cardTitle,
    marginBottom: 6,
  },
  titleRead: { color: theme.muted },
  subtitle: { fontSize: 13, lineHeight: 20, color: theme.muted, marginBottom: 10 },
  progressTrack: { marginBottom: 8 },
  time: { fontSize: 10, fontWeight: "700", color: theme.muted, letterSpacing: 0.5 },
});
