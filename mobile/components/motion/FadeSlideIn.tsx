import { useEffect, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  useReducedMotion,
} from "react-native-reanimated";

import { motion } from "@/constants/motion";

type Props = {
  children: ReactNode;
  delay?: number;
  enterKey?: string | number;
  style?: StyleProp<ViewStyle>;
};

export default function FadeSlideIn({ children, delay = 0, enterKey, style }: Props) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 8);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }
    opacity.value = 0;
    translateY.value = 8;
    opacity.value = withDelay(delay, withTiming(1, { duration: motion.normal }));
    translateY.value = withDelay(delay, withTiming(0, { duration: motion.normal, easing: motion.easingOut }));
  }, [enterKey, delay, reduceMotion, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}
