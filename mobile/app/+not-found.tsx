import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";

export default function NotFoundScreen() {
  const insets = useSafeAreaInsets();
  const { dictionary } = useLocale();
  const t = dictionary.error;

  return (
    <>
      <Stack.Screen options={{ title: t.notFoundTitle, headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}>
        <Text style={styles.title}>{t.notFoundTitle}</Text>
        <Text style={styles.desc}>{t.notFoundDesc}</Text>
        <Link href="/" asChild>
          <Pressable style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>{t.goHome}</Text>
          </Pressable>
        </Link>
        <Link href="/explore" asChild>
          <Pressable style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>{t.goExplore}</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
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
    marginBottom: 28,
  },
  primaryBtn: {
    backgroundColor: theme.ink,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  primaryBtnText: { color: theme.white, fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  secondaryBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.accentSoft,
  },
  secondaryBtnText: { color: theme.accent, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
});
