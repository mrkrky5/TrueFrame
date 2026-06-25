import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

import ReflectionChip from "@/components/motion/ReflectionChip";
import { theme } from "@/constants/theme";
import { hapticSelection } from "@/utils/haptics";
import { useLocale } from "@/context/LocaleContext";

const REFLECTIONS = [
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
          <ReflectionChip
            key={ref.id}
            id={ref.id}
            icon={ref.icon}
            label={labels[ref.id as keyof typeof labels]}
            selected={isSelected}
            onPress={() => {
              hapticSelection();
              onToggle(ref.id);
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
