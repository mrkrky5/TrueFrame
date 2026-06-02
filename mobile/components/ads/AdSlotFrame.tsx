import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";

/** Visual wrapper so ads are clearly separated from editorial content. */
export default function AdSlotFrame({ children }: { children: React.ReactNode }) {
  const { dictionary } = useLocale();
  const label = dictionary.common.adLabel ?? "Ad";

  return (
    <View style={styles.wrap} accessibilityRole="none" importantForAccessibility="no-hide-descendants">
      <Text style={styles.label}>{label}</Text>
      <View style={styles.slot}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 12 },
  label: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    color: theme.muted,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  slot: {
    alignItems: "center",
    minHeight: 0,
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.paper,
  },
});
