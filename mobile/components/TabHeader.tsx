import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import { type } from "@/constants/typography";

/**
 * Shared tab-screen header. The eyebrow row always reserves the same vertical
 * space (even when empty) so the primary title sits at an identical Y position
 * across every tab — keeping headers aligned as you switch tabs.
 */
export default function TabHeader({
  eyebrow,
  title,
  subtitle,
  right,
  brand = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  brand?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={styles.eyebrow} numberOfLines={1} maxFontSizeMultiplier={1.4}>
          {eyebrow && eyebrow.length > 0 ? eyebrow : " "}
        </Text>
        <Text style={brand ? styles.brandTitle : styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  textCol: { flex: 1 },
  eyebrow: {
    height: 16,
    lineHeight: 16,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: theme.muted,
    marginBottom: 8,
  },
  title: { ...type.screenTitle },
  brandTitle: { ...type.brandTitle },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.muted,
    marginTop: 6,
  },
  right: { marginTop: 2 },
});
