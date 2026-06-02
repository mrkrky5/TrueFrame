import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { surfaces } from "@/constants/surfaces";
import { SITE_CONFIG } from "@/constants/site-config";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";

export default function MissingMediaRequest() {
  const { dictionary, locale } = useLocale();
  const t = dictionary.explore ?? {};

  const mailto = `mailto:${SITE_CONFIG.feedbackEmail}?subject=${encodeURIComponent(
    locale === "tr" ? "İçerik önerisi" : "Content suggestion"
  )}`;

  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name="chatbubble-ellipses-outline" size={22} color={theme.accent} />
      </View>
      <Text style={styles.title}>{t.missingMediaTitle}</Text>
      <Text style={styles.desc}>{t.missingMediaDesc}</Text>
      <Pressable
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        onPress={() => void Linking.openURL(mailto)}
        accessibilityRole="button"
      >
        <Text style={styles.btnText}>{t.missingMediaCta}</Text>
        <Ionicons name="arrow-forward" size={14} color={theme.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...surfaces.band,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: { fontSize: 15, fontWeight: "700", color: theme.ink, textAlign: "center", marginBottom: 6 },
  desc: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.muted,
    textAlign: "center",
    maxWidth: 280,
    marginBottom: 16,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.borderStrong,
  },
  btnPressed: { opacity: 0.88 },
  btnText: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2, color: theme.accent },
});
