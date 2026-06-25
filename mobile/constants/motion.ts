import { Easing } from "react-native-reanimated";

export const motion = {
  fast: 150,
  normal: 280,
  sheet: 320,
  stagger: 30,
  easingOut: Easing.out(Easing.cubic),
  spring: { damping: 18, stiffness: 200 },
} as const;
