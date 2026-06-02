import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SaveHeaderButton from "@/components/SaveHeaderButton";
import ShareHeaderButton from "@/components/ShareHeaderButton";
import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { useReaderBack } from "@/hooks/useReaderBack";

export default function CardReaderTopBar({
  cardId,
  cardTitle,
  center,
  readerStep = 0,
}: {
  cardId?: string;
  cardTitle?: string;
  center?: React.ReactNode;
  /** Hide save banner after the first reader screen. */
  readerStep?: number;
}) {
  const insets = useSafeAreaInsets();
  const { dictionary } = useLocale();
  const onBack = useReaderBack();
  const { saveHintSeen, dismissSaveHint, isSaved } = useHistory();
  const showSaveHint = Boolean(
    cardId && !saveHintSeen && !isSaved(cardId) && readerStep < 1
  );

  return (
    <View style={[styles.outer, { paddingTop: insets.top + 8 }]}>
      <View style={styles.bar}>
        <Pressable
          style={styles.backBtn}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={dictionary.common.back}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={theme.ink} />
          <Text style={styles.backText}>{dictionary.common.back}</Text>
        </Pressable>

        <View style={styles.center}>{center}</View>

        <View style={styles.actions}>
          {cardId && cardTitle ? <ShareHeaderButton cardId={cardId} title={cardTitle} /> : null}
          {cardId ? <SaveHeaderButton cardId={cardId} /> : <View style={styles.saveSpacer} />}
        </View>
      </View>
      {showSaveHint ? (
        <Pressable style={styles.hintRow} onPress={dismissSaveHint}>
          <Ionicons name="bookmark-outline" size={14} color={theme.accent} />
          <Text style={styles.hintText}>{dictionary.common.saveHint}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: theme.bg,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    zIndex: 10,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 44,
    minWidth: 44,
    justifyContent: "center",
    paddingRight: 4,
  },
  backText: { fontSize: 13, fontWeight: "700", color: theme.muted },
  center: { flex: 1, minHeight: 44, justifyContent: "center" },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  saveSpacer: { width: 44, height: 44 },
  hintRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.accentSoft,
    borderRadius: 12,
  },
  hintText: { flex: 1, fontSize: 12, lineHeight: 18, color: theme.ink },
});
