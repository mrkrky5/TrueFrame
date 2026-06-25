import { Pressable, StyleSheet, Text, View } from "react-native";

import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { hapticLight } from "@/utils/haptics";
import { DAILY_GOAL_OPTIONS, type DailyGoalCards } from "@shared/readingGoal";

export default function DailyGoalPicker({
  value,
  onChange,
}: {
  value: DailyGoalCards;
  onChange: (goal: DailyGoalCards) => void;
}) {
  const { dictionary } = useLocale();
  const s = dictionary.settings;

  return (
    <View style={styles.row}>
      {DAILY_GOAL_OPTIONS.map((n) => {
        const active = value === n;
        const label = (s.dailyGoalOption ?? "{{count}} cards").replace("{{count}}", String(n));
        return (
          <Pressable
            key={n}
            style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.chipPressed]}
            onPress={() => {
              hapticLight();
              onChange(n);
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={label}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, marginBottom: 20 },
  chip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    ...surfaces.card,
    borderColor: theme.borderStrong,
  },
  chipActive: {
    borderColor: theme.accent,
    backgroundColor: theme.accentSoft,
  },
  chipPressed: { opacity: 0.88 },
  chipText: { fontSize: 14, fontWeight: "600", color: theme.muted, textAlign: "center" },
  chipTextActive: { color: theme.ink, fontWeight: "700" },
});
