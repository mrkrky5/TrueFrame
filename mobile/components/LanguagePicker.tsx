import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { hapticLight } from "@/utils/haptics";
import type { Locale } from "@shared/i18n";

const OPTIONS: { code: Locale; titleKey: "languageTr" | "languageEn"; subtitle: string }[] = [
  { code: "tr", titleKey: "languageTr", subtitle: "TR" },
  { code: "en", titleKey: "languageEn", subtitle: "EN" },
];

export default function LanguagePicker({ onPicked }: { onPicked?: () => void }) {
  const { locale, setLocale, dictionary } = useLocale();
  const s = dictionary.settings;

  return (
    <View style={styles.list}>
      {OPTIONS.map((opt) => {
        const active = locale === opt.code;
        const title = s[opt.titleKey] ?? (opt.code === "tr" ? "Türkçe" : "English");
        return (
          <Pressable
            key={opt.code}
            style={({ pressed }) => [
              styles.option,
              active && styles.optionActive,
              pressed && styles.optionPressed,
            ]}
            onPress={() => {
              hapticLight();
              setLocale(opt.code);
              onPicked?.();
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            <View style={styles.optionText}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{opt.subtitle}</Text>
            </View>
            <View style={[styles.radio, active && styles.radioActive]}>
              {active ? <View style={styles.radioDot} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, marginBottom: 20 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    width: "100%",
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    ...surfaces.card,
    borderColor: theme.borderStrong,
  },
  optionActive: {
    borderColor: theme.accent,
    backgroundColor: theme.accentSoft,
    borderLeftWidth: 3,
    borderLeftColor: theme.accent,
    paddingLeft: 15,
  },
  optionPressed: { opacity: 0.88 },
  optionText: { flex: 1, marginRight: 12 },
  title: { fontSize: 16, fontWeight: "700", color: theme.ink },
  subtitle: { fontSize: 11, fontWeight: "800", letterSpacing: 1.5, color: theme.muted, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface,
  },
  radioActive: { borderColor: theme.accent, backgroundColor: theme.surface },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.accent },
});
