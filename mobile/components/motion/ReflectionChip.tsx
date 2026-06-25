import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { motion } from "@/constants/motion";
import { theme } from "@/constants/theme";
import AnimatedPressable from "@/components/motion/AnimatedPressable";

type Props = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function ReflectionChip({ id, icon, label, selected, onPress }: Props) {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: motion.fast });
  }, [selected, progress]);

  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [theme.paper, theme.ink]),
    borderColor: interpolateColor(progress.value, [0, 1], [theme.border, theme.ink]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [theme.muted, theme.white]),
  }));

  return (
    <AnimatedPressable
      key={id}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
    >
      <Animated.View style={[styles.chip, chipStyle]}>
        <Ionicons name={selected ? "checkmark" : icon} size={14} color={selected ? theme.white : theme.muted} />
        <Animated.Text style={[styles.chipText, textStyle]}>{label}</Animated.Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, textTransform: "uppercase" },
});
