import { useEffect, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  useReducedMotion,
} from "react-native-reanimated";

type Props = {
  children: ReactNode;
  trigger: boolean | number;
  style?: StyleProp<ViewStyle>;
};

export default function ScalePulse({ children, trigger, style }: Props) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!trigger || reduceMotion) return;
    scale.value = withSequence(
      withTiming(1.05, { duration: 120 }),
      withTiming(1, { duration: 180 })
    );
  }, [trigger, reduceMotion, scale]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}
