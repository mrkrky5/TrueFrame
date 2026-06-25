import type { ComponentProps, ReactNode } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useReducedMotion,
} from "react-native-reanimated";

import { motion } from "@/constants/motion";

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

/** Minimum finger movement before press activates — lets vertical scroll win on lists. */
const PRESS_SLOP = 6;

type Props = Omit<ComponentProps<typeof Pressable>, "children"> & {
  children: ReactNode;
};

export default function AnimatedPressable({ children, style, onPressIn, onPressOut, ...rest }: Props) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const pressIn = (e: Parameters<NonNullable<typeof onPressIn>>[0]) => {
    if (!reduceMotion) {
      scale.value = withTiming(0.98, { duration: motion.fast });
      opacity.value = withTiming(0.92, { duration: motion.fast });
    }
    onPressIn?.(e);
  };

  const pressOut = (e: Parameters<NonNullable<typeof onPressOut>>[0]) => {
    if (!reduceMotion) {
      scale.value = withTiming(1, { duration: motion.fast });
      opacity.value = withTiming(1, { duration: motion.fast });
    }
    onPressOut?.(e);
  };

  return (
    <AnimatedPressableBase
      style={[style, animatedStyle]}
      onPressIn={pressIn}
      onPressOut={pressOut}
      pressRetentionOffset={PRESS_SLOP}
      {...rest}
    >
      {children}
    </AnimatedPressableBase>
  );
}
