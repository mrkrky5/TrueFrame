import { StyleSheet, Text } from "react-native";

import LegalScreenLayout from "@/components/LegalScreenLayout";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";

export default function PrivacyScreen() {
  const { dictionary } = useLocale();
  const t = dictionary.legal;

  return (
    <LegalScreenLayout title={t.privacy} backHref="/settings">
      <Section emphasis>{t.localStorageInfo}</Section>
      <Section>{t.privacyIntro}</Section>
      <Heading>{t.privacyStorageTitle}</Heading>
      <Section>{t.privacyStorageBody}</Section>
      <Heading>{t.privacyContactTitle}</Heading>
      <Section>{t.privacyContactBody}</Section>
      <Heading>{t.privacyLinksTitle}</Heading>
      <Section>{t.privacyLinksBody}</Section>
    </LegalScreenLayout>
  );
}

function Heading({ children }: { children: string }) {
  return <Text style={styles.heading}>{children}</Text>;
}

function Section({ children, emphasis }: { children: string; emphasis?: boolean }) {
  return <Text style={[styles.body, emphasis && styles.emphasis]}>{children}</Text>;
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: theme.ink,
    marginTop: 20,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.muted,
    marginBottom: 4,
  },
  emphasis: {
    color: theme.ink,
    fontWeight: "600",
    fontStyle: "italic",
    marginBottom: 16,
  },
});
