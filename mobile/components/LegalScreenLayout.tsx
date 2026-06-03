import { ScrollView, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DetailBackBar from "@/components/DetailBackBar";
import { theme } from "@/constants/theme";

export default function LegalScreenLayout({
  title,
  subtitle,
  backHref = "/",
  children,
}: {
  title: string;
  subtitle?: string;
  /** Geri hedefi — ayarlar için `/`, alt sayfalar için `/settings`. */
  backHref?: string;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12, paddingBottom: insets.bottom + 32 },
      ]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <DetailBackBar fallbackHref={backHref} variant="inline" exitMode="stack" />

      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  content: { paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: "600", color: theme.ink, marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 22, color: theme.muted, marginBottom: 24 },
});
