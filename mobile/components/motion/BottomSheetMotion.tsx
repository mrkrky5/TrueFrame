import { useEffect, type ReactNode } from "react";
import { Platform, Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useReducedMotion,
} from "react-native-reanimated";

import { motion } from "@/constants/motion";
import { theme } from "@/constants/theme";

const DISMISS_DRAG = 100;
const DISMISS_VELOCITY = 600;

type Props = {
  visible: boolean;
  onClose: () => void;
  paddingBottom: number;
  sheetStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export default function BottomSheetMotion({
  visible,
  onClose,
  paddingBottom,
  sheetStyle,
  children,
}: Props) {
  const reduceMotion = useReducedMotion();
  const backdropOpacity = useSharedValue(0);
  const sheetY = useSharedValue(320);
  const dragY = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      backdropOpacity.value = 0;
      sheetY.value = 320;
      dragY.value = 0;
      return;
    }
    const duration = reduceMotion ? 0 : motion.sheet;
    backdropOpacity.value = withTiming(1, { duration });
    sheetY.value = withTiming(0, { duration, easing: motion.easingOut });
    dragY.value = 0;
  }, [visible, reduceMotion, backdropOpacity, sheetY, dragY]);

  const closeSheet = () => {
    onClose();
  };

  const pan = Gesture.Pan()
    .activeOffsetY(8)
    .failOffsetX([-24, 24])
    .onUpdate((e) => {
      dragY.value = Math.max(0, e.translationY);
      const progress = Math.min(1, dragY.value / 240);
      backdropOpacity.value = 1 - progress * 0.5;
    })
    .onEnd((e) => {
      if (dragY.value > DISMISS_DRAG || e.velocityY > DISMISS_VELOCITY) {
        const duration = reduceMotion ? 0 : motion.fast;
        dragY.value = withTiming(320, { duration });
        backdropOpacity.value = withTiming(0, { duration }, (finished) => {
          if (finished) runOnJS(closeSheet)();
        });
        return;
      }
      dragY.value = withTiming(0, { duration: motion.fast });
      backdropOpacity.value = withTiming(1, { duration: motion.fast });
    });

  const backdropAnim = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const sheetAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value + dragY.value }],
  }));

  const body = (
    <Animated.View style={[styles.backdrop, backdropAnim]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" />
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.sheet, sheetStyle, { paddingBottom }, sheetAnim]}>
          <Pressable style={styles.sheetInner} onPress={(e) => e.stopPropagation()}>
            {children}
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );

  if (Platform.OS === "web") return body;

  return <GestureHandlerRootView style={styles.gestureRoot}>{body}</GestureHandlerRootView>;
}

const styles = StyleSheet.create({
  gestureRoot: { flex: 1 },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    backgroundColor: theme.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  sheetInner: { width: "100%" },
});
