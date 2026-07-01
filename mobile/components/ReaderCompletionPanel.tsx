import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import AnimatedPressable from "@/components/motion/AnimatedPressable";
import ScalePulse from "@/components/motion/ScalePulse";
import { theme } from "@/constants/theme";
import { useNavigationTab, type PrimaryTab } from "@/context/NavigationContext";
import { useLocale } from "@/context/LocaleContext";
import AfterReadAdSlot from "@/components/ads/AfterReadAdSlot";
import { useReaderBack } from "@/hooks/useReaderBack";

type Variant = "complete" | "markRead";

function primaryLabel(
  dictionary: Record<string, any>,
  tab: PrimaryTab,
  fromRoute: boolean
): string {
  const c = dictionary.common;
  if (fromRoute) return c.readerExitToRoute ?? c.readerExitToRoutes;
  switch (tab) {
    case "explore":
      return c.readerExitToExplore ?? c.goBackAndContinue;
    case "saved":
      return c.readerExitToSaved ?? c.goBackAndContinue;
    case "routes":
      return c.readerExitToRoutes ?? c.goBackAndContinue;
    case "settings":
      return c.readerExitToSettings ?? c.goBackAndContinue;
    case "index":
    default:
      return c.readerExitToHome ?? c.returnHome;
  }
}

function secondaryLabel(dictionary: Record<string, any>, primaryTab: PrimaryTab): string {
  const c = dictionary.common;
  if (primaryTab === "index") return c.readerSecondaryExplore ?? c.exploreLibrary;
  return c.readerSecondaryHome ?? c.returnHome;
}

function secondaryHref(primaryTab: PrimaryTab): string {
  if (primaryTab === "index") return "/explore";
  return "/";
}

/**
 * Unified end-of-read actions: one primary + one secondary, context-aware.
 */
export default function ReaderCompletionPanel({
  variant,
  onMarkRead,
}: {
  variant: Variant;
  onMarkRead?: () => void;
}) {
  const router = useRouter();
  const onBack = useReaderBack();
  const { lastPrimaryTab, readerReturn } = useNavigationTab();
  const { dictionary } = useLocale();
  const c = dictionary.common;

  const fromRoute = readerReturn?.kind === "route";
  const primaryTab: PrimaryTab =
    readerReturn?.kind === "tab" ? readerReturn.tab : lastPrimaryTab;

  const goPrimary = () => {
    if (readerReturn?.kind === "route") {
      router.replace(`/routes/${readerReturn.routeId}` as never);
      return;
    }
    if (readerReturn?.kind === "dossier") {
      router.replace(`/explore/media/${readerReturn.slug}` as never);
      return;
    }
    onBack();
  };

  const goSecondary = () => {
    router.replace(secondaryHref(primaryTab) as never);
  };

  if (variant === "markRead") {
    return (
      <View style={styles.wrap}>
        <Text style={styles.heading}>{c.readerWhatsNext}</Text>
        <Text style={styles.hint}>{c.readerMarkCompleteHint}</Text>
        <AnimatedPressable
          style={styles.primaryBtn}
          onPress={onMarkRead}
          accessibilityRole="button"
          accessibilityLabel={c.markAsRead}
        >
          <ScalePulse trigger={1}>
            <Ionicons name="checkmark-circle-outline" size={18} color={theme.white} />
          </ScalePulse>
          <Text style={styles.primaryText}>{c.markAsRead}</Text>
        </AnimatedPressable>
        <AnimatedPressable
          style={styles.secondaryBtn}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={c.back}
        >
          <Ionicons name="chevron-back" size={16} color={theme.ink} />
          <Text style={styles.secondaryText}>{c.back}</Text>
        </AnimatedPressable>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>{c.readerWhatsNext}</Text>
      <AnimatedPressable
        style={styles.primaryBtn}
        onPress={goPrimary}
        accessibilityRole="button"
        accessibilityLabel={primaryLabel(dictionary, primaryTab, fromRoute)}
      >
        <Ionicons name="arrow-forward" size={16} color={theme.white} />
        <Text style={styles.primaryText}>{primaryLabel(dictionary, primaryTab, fromRoute)}</Text>
      </AnimatedPressable>
      <AnimatedPressable
        style={styles.secondaryBtn}
        onPress={goSecondary}
        accessibilityRole="button"
        accessibilityLabel={secondaryLabel(dictionary, primaryTab)}
      >
        <Text style={styles.secondaryText}>{secondaryLabel(dictionary, primaryTab)}</Text>
      </AnimatedPressable>
      <AfterReadAdSlot />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", gap: 10, marginTop: 8 },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.ink,
    textAlign: "center",
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.muted,
    textAlign: "center",
    marginBottom: 8,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.ink,
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryText: { color: theme.white, fontSize: 12, fontWeight: "700" },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.white,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  secondaryText: { color: theme.ink, fontSize: 12, fontWeight: "600" },
});
