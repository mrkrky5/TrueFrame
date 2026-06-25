import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SaveHeaderButton from "@/components/SaveHeaderButton";
import ShareHeaderButton from "@/components/ShareHeaderButton";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { useReaderBack } from "@/hooks/useReaderBack";

export default function CardReaderTopBar({
  cardId,
  cardTitle,
  center,
}: {
  cardId?: string;
  cardTitle?: string;
  center?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { dictionary } = useLocale();
  const onBack = useReaderBack();

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

        {center ? <View style={styles.center}>{center}</View> : <View style={styles.centerSpacer} />}

        <View style={styles.actions}>
          {cardId && cardTitle ? <ShareHeaderButton cardId={cardId} title={cardTitle} /> : null}
          {cardId ? <SaveHeaderButton cardId={cardId} /> : <View style={styles.saveSpacer} />}
        </View>
      </View>
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
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
    minHeight: 44,
    paddingRight: 2,
  },
  backText: { fontSize: 13, fontWeight: "700", color: theme.muted },
  center: { flex: 1, minWidth: 0, justifyContent: "center" },
  centerSpacer: { flex: 1 },
  actions: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 0 },
  saveSpacer: { width: 44, height: 44 },
});
