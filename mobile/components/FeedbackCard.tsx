import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import LegalFooter from "@/components/LegalFooter";
import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { SITE_CONFIG } from "@/constants/site-config";

export default function FeedbackCard({ showLegalFooter = true }: { showLegalFooter?: boolean }) {
  const { dictionary } = useLocale();
  const t = dictionary.feedback;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.desc}>{t.desc}</Text>
      <Pressable
        style={styles.btn}
        onPress={() => Linking.openURL(`mailto:${SITE_CONFIG.feedbackEmail}`)}
      >
        <Text style={styles.btnText}>{t.cta}</Text>
      </Pressable>
      {showLegalFooter ? <LegalFooter /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 32,
    ...surfaces.card,
    borderRadius: 24,
    padding: 24,
  },
  title: { fontSize: 18, fontWeight: "600", color: theme.ink, marginBottom: 8 },
  desc: { fontSize: 14, lineHeight: 22, color: theme.muted, marginBottom: 20 },
  btn: {
    backgroundColor: theme.ink,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  btnText: { color: theme.white, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
});
