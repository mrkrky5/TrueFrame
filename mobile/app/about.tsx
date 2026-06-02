import { StyleSheet, Text } from "react-native";

import LegalScreenLayout from "@/components/LegalScreenLayout";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";

export default function AboutScreen() {
  const { dictionary } = useLocale();
  const s = dictionary.settings;

  return (
    <LegalScreenLayout title={s.about} subtitle={s.aboutTitle} backHref="/settings">
      <Section>{s.aboutDesc}</Section>
      <Heading>{s.contentSourcesTitle}</Heading>
      <Section>{s.contentSourcesBody}</Section>
      <Heading>{s.disclaimerTitle}</Heading>
      <Section>{s.disclaimerBody}</Section>
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
    marginBottom: 8,
  },
});
