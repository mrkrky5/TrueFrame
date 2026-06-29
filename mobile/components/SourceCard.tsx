import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AnimatedPressable from "@/components/motion/AnimatedPressable";
import { theme } from "@/constants/theme";
import { hapticLight } from "@/utils/haptics";
import { openExternalUrl } from "@/utils/openExternalUrl";
import type { Source } from "../../types/index";

/** Strips protocol + leading www. to a readable host (Hermes-safe, no URL polyfill). */
function domainOf(url: string): string {
  return String(url || "")
    .replace(/^[a-z]+:\/\//i, "")
    .split("/")[0]
    .replace(/^www\./i, "")
    .trim();
}

export default function SourceCard({ source }: { source: Source }) {
  const domain = domainOf(source.url);

  const onPress = () => {
    hapticLight();
    openExternalUrl(source.url);
  };

  return (
    <AnimatedPressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={source.title}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="document-text-outline" size={16} color={theme.accent} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {source.title}
        </Text>
        <View style={styles.metaRow}>
          {domain ? (
            <View style={styles.chip}>
              <Text style={styles.chipText} numberOfLines={1} maxFontSizeMultiplier={1.3}>
                {domain}
              </Text>
            </View>
          ) : null}
          {source.type ? (
            <Text style={styles.type} maxFontSizeMultiplier={1.3}>
              {source.type}
            </Text>
          ) : null}
        </View>
      </View>
      <Ionicons name="open-outline" size={16} color={theme.muted} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: theme.paper,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 8,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  body: { flex: 1, gap: 5 },
  title: { fontSize: 14, fontWeight: "600", color: theme.ink, lineHeight: 19 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  chip: {
    maxWidth: 200,
    backgroundColor: theme.white,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: theme.border,
  },
  chipText: { fontSize: 10, fontWeight: "700", color: theme.muted, letterSpacing: 0.2 },
  type: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: theme.accent,
  },
});
