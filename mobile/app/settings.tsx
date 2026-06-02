import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Platform, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Constants from "expo-constants";

import FeedbackCard from "@/components/FeedbackCard";
import LanguagePicker from "@/components/LanguagePicker";
import LegalScreenLayout from "@/components/LegalScreenLayout";
import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";

export default function SettingsScreen() {
  const { dictionary } = useLocale();
  const { dailyReminderEnabled, setDailyReminderEnabled } = useHistory();
  const s = dictionary.settings;
  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <LegalScreenLayout title={s.title}>
      <Text style={styles.section}>{s.languageLabel}</Text>
      <Text style={styles.hint}>{s.languageHint}</Text>

      <LanguagePicker />

      {Platform.OS === "ios" ? (
        <>
          <Text style={styles.section}>{s.dailyReminderTitle}</Text>
          <Text style={styles.hint}>{s.dailyReminderHint}</Text>
          <View style={styles.reminderRow}>
            <Text style={styles.reminderLabel}>
              {dailyReminderEnabled ? s.dailyReminderOn : s.dailyReminderOff}
            </Text>
            <Switch
              value={dailyReminderEnabled}
              onValueChange={(v) => void setDailyReminderEnabled(v)}
              trackColor={{ false: theme.border, true: theme.accent }}
              thumbColor={theme.white}
            />
          </View>
        </>
      ) : null}

      <View style={styles.menu}>
        <LinkRow href="/about" icon="information-circle-outline" label={s.about} />
        <LinkRow href="/support" icon="help-circle-outline" label={dictionary.support.title} />
        <LinkRow href="/privacy" icon="shield-outline" label={dictionary.legal.privacy} />
        <LinkRow href="/terms" icon="document-text-outline" label={dictionary.legal.terms} />
      </View>

      <Text style={styles.section}>{s.versionLabel}</Text>
      <Text style={styles.version}>{version}</Text>

      <FeedbackCard showLegalFooter={false} />
    </LegalScreenLayout>
  );
}

function LinkRow({
  href,
  icon,
  label,
}: {
  href: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <Link href={href as never} asChild>
      <Pressable
        style={({ pressed }) => [styles.rowHit, pressed && styles.rowPressed]}
        accessibilityRole="button"
      >
        <View style={styles.row}>
          <View style={styles.rowIcon}>
            <Ionicons name={icon} size={20} color={theme.accent} />
          </View>
          <Text style={styles.rowLabel}>{label}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.muted} />
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: theme.muted,
    marginTop: 8,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  hint: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.muted,
    marginBottom: 12,
  },
  version: { fontSize: 15, fontWeight: "600", color: theme.ink, marginBottom: 8 },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...surfaces.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderColor: theme.borderStrong,
    minHeight: 52,
  },
  reminderLabel: { fontSize: 15, fontWeight: "600", color: theme.ink },
  menu: { gap: 10, marginBottom: 8 },
  rowHit: {
    width: "100%",
    alignSelf: "stretch",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    ...surfaces.card,
    borderRadius: 16,
    padding: 16,
    borderColor: theme.borderStrong,
    minHeight: 52,
  },
  rowPressed: { opacity: 0.88 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: theme.ink },
});
