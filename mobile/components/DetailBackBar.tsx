import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { useDetailBack, type DetailBackMode } from "@/hooks/useDetailBack";

type Props = {
  fallbackHref: string;
  /** Fixed screen header (route detail) vs inline row inside scroll content. */
  variant?: "header" | "inline";
  exitMode?: DetailBackMode;
};

export default function DetailBackBar({
  fallbackHref,
  variant = "header",
  exitMode = "stack",
}: Props) {
  const insets = useSafeAreaInsets();
  const { dictionary } = useLocale();
  const onBack = useDetailBack(fallbackHref, exitMode);

  const button = (
    <Pressable
      style={styles.backBtn}
      onPress={onBack}
      accessibilityRole="button"
      accessibilityLabel={dictionary.common.back}
      hitSlop={8}
    >
      <Ionicons name="chevron-back" size={22} color={theme.ink} />
      <Text style={styles.backText}>{dictionary.common.back}</Text>
    </Pressable>
  );

  if (variant === "inline") {
    return <View style={styles.inlineWrap}>{button}</View>;
  }

  return (
    <View style={[styles.headerOuter, { paddingTop: insets.top + 8 }]}>
      <View style={styles.bar}>{button}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerOuter: {
    backgroundColor: theme.bg,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    zIndex: 10,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  inlineWrap: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 44,
    minWidth: 44,
    justifyContent: "flex-start",
    paddingRight: 4,
  },
  backText: { fontSize: 13, fontWeight: "700", color: theme.muted },
});
