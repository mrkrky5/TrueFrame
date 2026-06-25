import { Text, StyleSheet, View } from "react-native";

import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";

export default function ReflectionFeedback({
  showLaterSaved,
  showSurprisedHint,
}: {
  showLaterSaved?: boolean;
  showSurprisedHint?: boolean;
}) {
  const { dictionary } = useLocale();
  const c = dictionary.common;

  if (!showLaterSaved && !showSurprisedHint) return null;

  return (
    <View style={styles.wrap}>
      {showLaterSaved ? (
        <Text style={styles.text}>{c.reflectionLaterSaved}</Text>
      ) : null}
      {showSurprisedHint ? (
        <Text style={[styles.text, showLaterSaved ? styles.second : null]}>
          {c.reflectionSurprisedHint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 10, gap: 4 },
  text: { fontSize: 12, lineHeight: 18, color: theme.accent, fontWeight: "600" },
  second: { color: theme.muted, fontWeight: "500" },
});
