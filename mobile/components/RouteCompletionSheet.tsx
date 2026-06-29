import { useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Platform, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AfterReadAdSlot from "@/components/ads/AfterReadAdSlot";
import AnimatedPressable from "@/components/motion/AnimatedPressable";
import BottomSheetMotion from "@/components/motion/BottomSheetMotion";
import ScalePulse from "@/components/motion/ScalePulse";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { useNavigationTab } from "@/context/NavigationContext";
import type { RouteCompletion } from "@shared/routeCompletion";

function SheetBody({
  completion,
  onClose,
  paddingBottom,
}: {
  completion: RouteCompletion;
  onClose: () => void;
  paddingBottom: number;
}) {
  const router = useRouter();
  const { dictionary } = useLocale();
  const c = dictionary.common;

  const title = (c.routeCompleteTitle ?? "Route complete").replace("{{title}}", completion.routeTitle);
  const body = (c.routeCompleteBody ?? "{{count}} cards")
    .replace("{{count}}", String(completion.cardCount));

  const goRoute = () => {
    onClose();
    router.replace(`/routes/${completion.routeId}` as never);
  };

  const goNextRoute = () => {
    if (!completion.nextRouteId) return;
    onClose();
    router.replace(`/routes/${completion.nextRouteId}` as never);
  };

  const goExplore = () => {
    onClose();
    router.replace("/explore" as never);
  };

  return (
    <BottomSheetMotion visible paddingBottom={paddingBottom} onClose={onClose} sheetStyle={styles.sheetAlign}>
      <View style={styles.handle} />
      <ScalePulse trigger>
        <View style={styles.iconWrap}>
          <Ionicons name="map" size={28} color={theme.accent} />
        </View>
      </ScalePulse>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <AnimatedPressable style={styles.primaryBtn} onPress={goRoute} accessibilityRole="button">
        <Text style={styles.primaryText}>{c.routeCompleteCta ?? c.readerExitToRoute}</Text>
      </AnimatedPressable>
      {completion.nextRouteId && completion.nextRouteTitle ? (
        <AnimatedPressable style={styles.nextRouteBtn} onPress={goNextRoute} accessibilityRole="button">
          <Text style={styles.nextRouteText}>
            {(c.routeCompleteNext ?? "Next route: {{title}}").replace(
              "{{title}}",
              completion.nextRouteTitle
            )}
          </Text>
        </AnimatedPressable>
      ) : null}
      <AnimatedPressable style={styles.secondaryBtn} onPress={goExplore} accessibilityRole="button">
        <Text style={styles.secondaryText}>{c.routeCompleteExplore ?? c.exploreLibrary}</Text>
      </AnimatedPressable>
      <AfterReadAdSlot />
    </BottomSheetMotion>
  );
}

export default function RouteCompletionSheet({
  visible,
  completion,
  onClose,
}: {
  visible: boolean;
  completion: RouteCompletion | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { setTabBarSuppressed } = useNavigationTab();
  const paddingBottom = Math.max(insets.bottom, 16) + 16;

  useLayoutEffect(() => {
    if (!visible || Platform.OS === "web") return;
    setTabBarSuppressed(true);
    return () => setTabBarSuppressed(false);
  }, [visible, setTabBarSuppressed]);

  if (!visible || !completion) return null;

  if (Platform.OS === "web") {
    return (
      <View style={styles.webOverlay}>
        <SheetBody completion={completion} onClose={onClose} paddingBottom={paddingBottom} />
      </View>
    );
  }

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <SheetBody completion={completion} onClose={onClose} paddingBottom={paddingBottom} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  webOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
    pointerEvents: "box-none",
  },
  sheetAlign: { alignItems: "center" },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.border,
    marginBottom: 20,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.ink,
    textAlign: "center",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.muted,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryBtn: {
    alignSelf: "stretch",
    backgroundColor: theme.ink,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryText: { color: theme.white, fontSize: 14, fontWeight: "700" },
  nextRouteBtn: {
    alignSelf: "stretch",
    backgroundColor: theme.accentSoft,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.accent,
  },
  nextRouteText: { color: theme.ink, fontSize: 13, fontWeight: "700" },
  secondaryBtn: {
    alignSelf: "stretch",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 8,
  },
  secondaryText: { color: theme.ink, fontSize: 13, fontWeight: "600" },
});
