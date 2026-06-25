import { useLayoutEffect } from "react";
import { Modal, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheetMotion from "@/components/motion/BottomSheetMotion";
import { theme } from "@/constants/theme";
import { useNavigationTab } from "@/context/NavigationContext";
import LanguagePicker from "@/components/LanguagePicker";
import { useLocale } from "@/context/LocaleContext";

function SheetContent({
  onClose,
  paddingBottom,
}: {
  onClose: () => void;
  paddingBottom: number;
}) {
  const { dictionary } = useLocale();
  const s = dictionary.settings;

  return (
    <BottomSheetMotion visible paddingBottom={paddingBottom} onClose={onClose}>
      <View style={styles.handle} />
      <Text style={styles.title}>{s.languageLabel}</Text>
      <Text style={styles.hint}>{s.languageHint}</Text>
      <LanguagePicker onPicked={onClose} />
    </BottomSheetMotion>
  );
}

/** Web preview: Modal escapes the 430px app frame — use in-screen overlay instead. */
export default function HomeLanguageSheet({
  visible,
  onClose,
}: {
  visible: boolean;
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

  if (!visible) return null;

  if (Platform.OS === "web") {
    return (
      <View style={styles.webOverlay}>
        <SheetContent onClose={onClose} paddingBottom={paddingBottom} />
      </View>
    );
  }

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <SheetContent onClose={onClose} paddingBottom={paddingBottom} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  webOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
    pointerEvents: "box-none",
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.border,
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: "600", color: theme.ink, marginBottom: 6 },
  hint: { fontSize: 13, lineHeight: 20, color: theme.muted, marginBottom: 16 },
});
