import { useEffect } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { motion } from "@/constants/motion";
import { theme } from "@/constants/theme";
import AnimatedPressable from "@/components/motion/AnimatedPressable";

type Variant = "paper" | "accent" | "solid";

const PALETTES: Record<
  Variant,
  { bgOff: string; bgOn: string; borderOff: string; borderOn: string; textOff: string; textOn: string }
> = {
  paper: {
    bgOff: theme.paper,
    bgOn: theme.ink,
    borderOff: theme.border,
    borderOn: theme.ink,
    textOff: theme.muted,
    textOn: theme.white,
  },
  accent: {
    bgOff: theme.white,
    bgOn: theme.accentSoft,
    borderOff: theme.border,
    borderOn: theme.accent,
    textOff: theme.muted,
    textOn: theme.accent,
  },
  solid: {
    bgOff: theme.white,
    bgOn: theme.ink,
    borderOff: theme.border,
    borderOn: theme.ink,
    textOff: theme.muted,
    textOn: theme.white,
  },
};

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: "radio" | "switch" | "button";
  accessibilityState?: { selected?: boolean; checked?: boolean };
};

export default function FilterChip({
  label,
  active,
  onPress,
  variant = "paper",
  style,
  textStyle,
  accessibilityLabel,
  accessibilityRole = "button",
  accessibilityState,
}: Props) {
  const palette = PALETTES[variant];
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: motion.fast });
  }, [active, progress]);

  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [palette.bgOff, palette.bgOn]),
    borderColor: interpolateColor(progress.value, [0, 1], [palette.borderOff, palette.borderOn]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [palette.textOff, palette.textOn]),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Animated.View style={[styles.chip, style, chipStyle]}>
        <Animated.Text style={[styles.text, textStyle, labelStyle]} numberOfLines={1}>
          {label}
        </Animated.Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  text: { fontSize: 11, fontWeight: "700" },
});
