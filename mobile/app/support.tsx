import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import LegalScreenLayout from "@/components/LegalScreenLayout";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { SITE_CONFIG } from "@/constants/site-config";

export default function SupportScreen() {
  const { dictionary } = useLocale();
  const t = dictionary.support;

  const faqs = [
    { q: t.faqAccountQ, a: t.faqAccountA },
    { q: t.faqOfflineQ, a: t.faqOfflineA },
    { q: t.faqDataQ, a: t.faqDataA },
  ];

  return (
    <LegalScreenLayout title={t.title} subtitle={t.subtitle} backHref="/settings">
      <View style={styles.emailCard}>
        <Text style={styles.emailTitle}>{t.emailTitle}</Text>
        <Text style={styles.emailDesc}>{t.emailDesc}</Text>
        <Pressable
          style={styles.emailBtn}
          onPress={() => Linking.openURL(`mailto:${SITE_CONFIG.feedbackEmail}`)}
        >
          <Text style={styles.emailBtnText}>{t.emailCta}</Text>
        </Pressable>
        <Text style={styles.emailAddress}>{SITE_CONFIG.feedbackEmail}</Text>
      </View>

      <Text style={styles.faqTitle}>{t.faqTitle}</Text>
      {faqs.map((item) => (
        <View key={item.q} style={styles.faqItem}>
          <Text style={styles.faqQ}>{item.q}</Text>
          <Text style={styles.faqA}>{item.a}</Text>
        </View>
      ))}

    </LegalScreenLayout>
  );
}

const styles = StyleSheet.create({
  emailCard: {
    backgroundColor: theme.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 28,
  },
  emailTitle: { fontSize: 17, fontWeight: "600", color: theme.ink, marginBottom: 8 },
  emailDesc: { fontSize: 14, lineHeight: 22, color: theme.muted, marginBottom: 16 },
  emailBtn: {
    backgroundColor: theme.ink,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  emailBtnText: { color: theme.white, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  emailAddress: { marginTop: 12, fontSize: 12, color: theme.muted, fontFamily: "monospace" },
  faqTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: theme.muted,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  faqItem: { borderBottomWidth: 1, borderBottomColor: theme.border, paddingBottom: 16, marginBottom: 16 },
  faqQ: { fontSize: 14, fontWeight: "700", color: theme.ink, marginBottom: 6 },
  faqA: { fontSize: 14, lineHeight: 22, color: theme.muted },
});
