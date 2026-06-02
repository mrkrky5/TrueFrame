import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";

export default function LegalFooter() {
  const { dictionary } = useLocale();

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{dictionary.support.legalLinks}</Text>
      <View style={styles.links}>
        <Link href={"/privacy" as never} asChild>
          <Pressable hitSlop={8}>
            <Text style={styles.link}>{dictionary.legal.privacy}</Text>
          </Pressable>
        </Link>
        <Text style={styles.dot}>·</Text>
        <Link href={"/terms" as never} asChild>
          <Pressable hitSlop={8}>
            <Text style={styles.link}>{dictionary.legal.terms}</Text>
          </Pressable>
        </Link>
        <Text style={styles.dot}>·</Text>
        <Link href={"/support" as never} asChild>
          <Pressable hitSlop={8}>
            <Text style={styles.link}>{dictionary.support.title}</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: theme.border },
  label: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: theme.muted,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  links: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  link: { fontSize: 12, fontWeight: "700", color: theme.accent },
  dot: { color: theme.border, fontSize: 12 },
});
