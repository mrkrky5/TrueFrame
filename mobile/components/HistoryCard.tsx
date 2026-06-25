import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import AnimatedPressable from "@/components/motion/AnimatedPressable";

import { mediaTypeIconName } from "@/utils/mediaTypeIcon";
import { type } from "@/constants/typography";
import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { useNavigationTab, type ReaderReturn } from "@/context/NavigationContext";
import { navigateToCard } from "@/utils/navigationExit";
import { flattenStyle } from "@/utils/flattenStyle";
import { formatMediaType } from "@shared/contentBlocks";
import type { HistoryCard } from "../../types/index";

export default function HistoryCard({
  card,
  isRead,
  showPreview,
  beforeNavigate,
  returnTo,
  navigationMode = "push",
}: {
  card: HistoryCard;
  isRead?: boolean;
  showPreview?: boolean;
  beforeNavigate?: () => void;
  returnTo?: ReaderReturn;
  navigationMode?: "push" | "replace";
}) {
  const { dictionary } = useLocale();
  const router = useRouter();
  const { setReaderReturn } = useNavigationTab();
  const previewLine = card.quickRealityCheck || card.subtitle || card.whatWeSee;
  const spoilerLabel =
    card.spoilerLevel === "major"
      ? dictionary.card.spoilerShortMajor
      : card.spoilerLevel === "minor"
        ? dictionary.card.spoilerShortMinor
        : null;

  const openCard = () => {
    if (returnTo) {
      beforeNavigate?.();
      navigateToCard(router, card.id, setReaderReturn, returnTo, navigationMode);
      return;
    }
    beforeNavigate?.();
    router.push(`/card/${card.id}` as never);
  };

  return (
    <AnimatedPressable
      style={flattenStyle([styles.wrap, isRead ? styles.wrapRead : null])}
      onPress={openCard}
      accessibilityRole="button"
      accessibilityLabel={card.title}
      accessibilityHint={
        isRead
          ? dictionary.common.readStatus
          : spoilerLabel
            ? spoilerLabel
            : undefined
      }
    >
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.mediaRow}>
            <Ionicons name={mediaTypeIconName(card.mediaType)} size={14} color={theme.accent} />
            <Text style={styles.media} numberOfLines={1}>
              {formatMediaType(card.mediaType, dictionary)} • {card.mediaTitle}
            </Text>
          </View>
          <View style={styles.badges}>
            {isRead ? (
              <View style={styles.readBadge}>
                <Text style={styles.readBadgeText}>{dictionary.common.readStatus}</Text>
              </View>
            ) : null}
            {spoilerLabel ? (
              <View
                style={[
                  styles.spoilerBadge,
                  card.spoilerLevel === "major" ? styles.spoilerBadgeMajor : styles.spoilerBadgeMinor,
                ]}
              >
                <Text style={styles.spoilerBadgeText} numberOfLines={1}>
                  {spoilerLabel}
                </Text>
              </View>
            ) : null}
            {card.isFlagship ? (
              <View style={styles.flagshipBadge}>
                <Text style={styles.flagshipText}>{dictionary.common.flagship}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <Text style={[styles.title, isRead ? styles.titleRead : null]}>{card.title}</Text>
        {showPreview && previewLine ? (
          <Text style={[styles.previewLine, isRead ? styles.subtitleRead : null]} numberOfLines={2}>
            {previewLine}
          </Text>
        ) : (
          <Text style={[styles.subtitle, isRead ? styles.subtitleRead : null]} numberOfLines={2}>
            {card.subtitle}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.tags}>
            {card.themes?.slice(0, 2).map((t) => (
              <Text key={t} style={styles.tag} numberOfLines={1}>
                {t}
              </Text>
            ))}
          </View>
          <Text style={styles.time}>
            {card.readingTimeMinutes} {dictionary.common.minutes}
            {card.isFlagship ? ` · ${dictionary.common.flagshipBadgeShort}` : ""}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...surfaces.card,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,
  },
  wrapRead: {
    opacity: 0.58,
    backgroundColor: theme.paper,
  },
  body: { padding: 18 },
  topRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, gap: 8 },
  mediaRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6, minWidth: 0 },
  media: {
    flex: 1,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.accent,
  },
  badges: { flexDirection: "row", alignItems: "center", gap: 6 },
  readBadge: {
    backgroundColor: theme.paper,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  readBadgeText: { fontSize: 8, fontWeight: "800", letterSpacing: 0.8, color: theme.muted },
  spoilerBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  spoilerBadgeMajor: { borderColor: theme.spoilerMajor, backgroundColor: "rgba(239,68,68,0.08)" },
  spoilerBadgeMinor: { borderColor: theme.spoilerMinor, backgroundColor: theme.spoilerMinorSoft },
  spoilerBadgeText: { fontSize: 8, fontWeight: "800", letterSpacing: 0.3, color: theme.ink },
  flagshipBadge: {
    backgroundColor: theme.accentSoft,
    borderWidth: 1,
    borderColor: theme.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  flagshipText: { color: theme.accent, fontSize: 8, fontWeight: "800", letterSpacing: 1 },
  title: { ...type.cardTitle, marginBottom: 6 },
  titleRead: { color: theme.muted },
  previewLine: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.ink,
    marginBottom: 14,
    fontWeight: "500",
  },
  subtitle: { fontSize: 14, lineHeight: 21, color: theme.muted, marginBottom: 14 },
  subtitleRead: { color: theme.muted, opacity: 0.85 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: 12,
  },
  tags: { flex: 1, flexDirection: "row", gap: 6, marginRight: 8 },
  tag: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    color: theme.muted,
    backgroundColor: theme.paper,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 100,
  },
  time: { fontSize: 10, fontWeight: "800", color: theme.ink, letterSpacing: 0.5 },
});
