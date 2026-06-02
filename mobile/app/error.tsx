import { type ErrorBoundaryProps } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const insets = useSafeAreaInsets();
  const { dictionary } = useLocale();
  const t = dictionary.error;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}>
      <Text style={styles.title}>{t.boundaryTitle}</Text>
      <Text style={styles.desc}>{t.boundaryDesc}</Text>
      {__DEV__ && error?.message ? (
        <Text style={styles.debug} numberOfLines={4}>
          {error.message}
        </Text>
      ) : null}
      <Pressable style={styles.primaryBtn} onPress={retry}>
        <Text style={styles.primaryBtnText}>{t.retry}</Text>
      </Pressable>
    </View>
  );
}

/** Satisfies Expo Router route module requirement; UI is handled by ErrorBoundary. */
export default function ErrorRoute() {
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: theme.bg,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.ink,
    textAlign: "center",
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.muted,
    textAlign: "center",
    marginBottom: 20,
  },
  debug: {
    fontSize: 11,
    color: theme.muted,
    marginBottom: 16,
    textAlign: "center",
  },
  primaryBtn: {
    backgroundColor: theme.ink,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    alignItems: "center",
  },
  primaryBtnText: { color: theme.white, fontSize: 12, fontWeight: "700" },
});
