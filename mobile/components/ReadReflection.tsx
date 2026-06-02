import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import { hapticSelection } from "@/utils/haptics";
import { useLocale } from "@/context/LocaleContext";

const REFLECTIONS = [
  { id: "learned", icon: "bulb-outline" as const },
  { id: "surprised", icon: "flash-outline" as const },
  { id: "later", icon: "bookmark-outline" as const },
];

export default function ReadReflection({
  cardId,
  selectedReflections,
  onToggle,
}: {
  cardId: string;
  selectedReflections: string[];
  onToggle: (reflection: string) => void;
}) {
  const { dictionary } = useLocale();
  const labels = dictionary.common.reflectionLabels;

  return (
    <View style={styles.wrap}>
      {REFLECTIONS.map((ref) => {
        const isSelected = selectedReflections.includes(ref.id);
        return (
          <Pressable
            key={ref.id}
            style={[styles.chip, isSelected && styles.chipActive]}
            onPress={() => {
              hapticSelection();
              onToggle(ref.id);
            }}
          >
            <Ionicons
              name={isSelected ? "checkmark" : ref.icon}
              size={14}
              color={isSelected ? theme.white : theme.muted}
            />
            <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
              {labels[ref.id as keyof typeof labels]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: theme.paper,
    borderWidth: 1,
    borderColor: theme.border,
  },
  chipActive: { backgroundColor: theme.ink, borderColor: theme.ink },
  chipText: { fontSize: 10, fontWeight: "800", color: theme.muted, letterSpacing: 0.5, textTransform: "uppercase" },
  chipTextActive: { color: theme.white },
});
