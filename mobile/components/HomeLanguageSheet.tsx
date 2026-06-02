import { useEffect } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button">
      <Pressable
        style={[styles.sheet, { paddingBottom }]}
        onPress={(e) => e.stopPropagation()}
      >
        <View style={styles.handle} />
        <Text style={styles.title}>{s.languageLabel}</Text>
        <Text style={styles.hint}>{s.languageHint}</Text>
        <LanguagePicker onPicked={onClose} />
      </Pressable>
    </Pressable>
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

  useEffect(() => {
    if (!visible) return;
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
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.white,
    marginBottom: 10,
  },
  optionActive: { borderColor: theme.ink, backgroundColor: theme.accentSoft },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: "700", color: theme.ink },
  optionSub: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2, color: theme.muted, marginTop: 2 },
});
