import { StyleSheet, Text } from "react-native";

import LegalScreenLayout from "@/components/LegalScreenLayout";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";

export default function TermsScreen() {
  const { dictionary } = useLocale();
  const t = dictionary.legal;

  return (
    <LegalScreenLayout title={t.terms} backHref="/settings">
      <Heading>{t.termsContentTitle}</Heading>
      <Section>{t.termsContentBody}</Section>
      <Heading>{t.termsUsageTitle}</Heading>
      <Section>{t.termsUsageBody}</Section>
      <Heading>{t.termsDisclaimerTitle}</Heading>
      <Section>{t.termsDisclaimerBody}</Section>
    </LegalScreenLayout>
  );
}

function Heading({ children }: { children: string }) {
  return <Text style={styles.heading}>{children}</Text>;
}

function Section({ children }: { children: string }) {
  return <Text style={styles.body}>{children}</Text>;
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
});
