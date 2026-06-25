import { useEffect, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useReducedMotion,
} from "react-native-reanimated";

import { motion } from "@/constants/motion";
import { theme } from "@/constants/theme";

type Props = {
  pct: number;
  trackStyle?: StyleProp<ViewStyle>;
  fillStyle?: StyleProp<ViewStyle>;
};

export default function ProgressBar({ pct, trackStyle, fillStyle }: Props) {
  const reduceMotion = useReducedMotion();
  const width = useSharedValue(0);
  const [trackW, setTrackW] = useState(0);

  useEffect(() => {
    const clamped = Math.min(100, Math.max(0, pct));
    const target = (clamped / 100) * trackW;
    if (trackW === 0) return;
    if (reduceMotion) {
      width.value = target;
    } else {
      width.value = withTiming(target, { duration: motion.normal, easing: motion.easingOut });
    }
  }, [pct, trackW, reduceMotion, width]);

  const fillAnim = useAnimatedStyle(() => ({ width: width.value }));

  return (
    <View
      style={[{ height: 3, backgroundColor: theme.paper, borderRadius: 999, overflow: "hidden" }, trackStyle]}
      onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}
    >
      <Animated.View
        style={[{ height: "100%", backgroundColor: theme.accent, borderRadius: 999 }, fillStyle, fillAnim]}
      />
    </View>
  );
}
