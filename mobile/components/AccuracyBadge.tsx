import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { formatAccuracyLabel } from "@shared/contentBlocks";
import type { AccuracyType } from "../../types/index";

type Tone = { fg: string; bg: string; icon: keyof typeof Ionicons.glyphMap };

const TONES: Record<AccuracyType, Tone> = {
  real: { fg: "#15803d", bg: "rgba(34,197,94,0.12)", icon: "shield-checkmark" },
  "partly-real": { fg: "#0e7490", bg: "rgba(14,116,144,0.12)", icon: "git-compare" },
  "inspired-by-reality": { fg: "#b45309", bg: "rgba(180,83,9,0.12)", icon: "bulb" },
  fictionalized: { fg: "#c2410c", bg: "rgba(234,88,12,0.12)", icon: "color-wand" },
  fiction: { fg: "#b91c1c", bg: "rgba(220,38,38,0.12)", icon: "sparkles" },
};

const FALLBACK: Tone = { fg: theme.muted, bg: theme.paper, icon: "help-circle" };

export default function AccuracyBadge({
  accuracy,
  size = "md",
}: {
  accuracy?: AccuracyType;
  size?: "sm" | "md";
}) {
  const { dictionary } = useLocale();
  if (!accuracy) return null;

  const tone = TONES[accuracy] ?? FALLBACK;
  const label = formatAccuracyLabel(accuracy, dictionary);
  const small = size === "sm";
  const iconSize = small ? 12 : 14;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: tone.bg },
        small && styles.badgeSm,
      ]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Ionicons name={tone.icon} size={iconSize} color={tone.fg} />
      <Text
        style={[styles.label, { color: tone.fg }, small && styles.labelSm]}
        numberOfLines={1}
        maxFontSizeMultiplier={1.4}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  badgeSm: { paddingHorizontal: 10, paddingVertical: 5, gap: 5 },
  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  labelSm: { fontSize: 10 },
});
