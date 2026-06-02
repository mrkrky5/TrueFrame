import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LanguagePicker from "@/components/LanguagePicker";
import { type } from "@/constants/typography";
import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { hapticLight } from "@/utils/haptics";

function OnboardingContent({
  paddingTop,
  paddingBottom,
  onFinish,
}: {
  paddingTop: number;
  paddingBottom: number;
  onFinish: () => void;
}) {
  const { dictionary } = useLocale();
  const o = dictionary.common.onboarding;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop, paddingBottom }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>✦</Text>
      </View>
      <Text style={styles.title}>{o.welcome}</Text>
      <Text style={styles.subtitle}>{o.subtitle}</Text>

      <Text style={styles.langTitle}>{o.languageTitle}</Text>
      <Text style={styles.langNote}>{o.languageNote}</Text>
      <LanguagePicker />

      <Feature title={o.features.media.title} desc={o.features.media.desc} />
      <Feature title={o.features.content.title} desc={o.features.content.desc} />
      <Feature title={o.features.spoiler.title} desc={o.features.spoiler.desc} />

      <Pressable
        style={styles.cta}
        onPress={onFinish}
        accessibilityRole="button"
        accessibilityLabel={o.cta}
      >
        <Text style={styles.ctaText}>{o.cta}</Text>
      </Pressable>
    </ScrollView>
  );
}

/** Web preview: Modal renders at document body and ignores the 430px app frame. */
export default function OnboardingOverlay() {
  const insets = useSafeAreaInsets();
  const { onboardingDone, completeOnboarding, ready } = useHistory();

  if (!ready || onboardingDone) return null;

  const paddingTop = insets.top + 32;
  const paddingBottom = insets.bottom + 32;

  const finish = async () => {
    hapticLight();
    await completeOnboarding();
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.webOverlay}>
        <OnboardingContent
          paddingTop={paddingTop}
          paddingBottom={paddingBottom}
          onFinish={finish}
        />
      </View>
    );
  }

  return (
    <Modal visible animationType="fade" transparent={false}>
      <OnboardingContent
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        onFinish={finish}
      />
    </Modal>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <View style={styles.feature}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 2000,
    backgroundColor: theme.bg,
  },
  screen: { flex: 1, backgroundColor: theme.bg },
  content: { padding: 28 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: theme.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  icon: { fontSize: 28, color: theme.accent },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    color: theme.ink,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: theme.muted,
    marginBottom: 20,
  },
  langTitle: { fontSize: 14, fontWeight: "700", color: theme.ink, marginBottom: 4 },
  langNote: { fontSize: 12, lineHeight: 18, color: theme.muted, marginBottom: 12 },
  langRow: { gap: 8, marginBottom: 20 },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.border,
  },
  langOptionSelected: { borderColor: theme.accent, backgroundColor: theme.accentSoft },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: theme.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.accent },
  langLabel: { fontSize: 15, fontWeight: "600", color: theme.ink },
  langLabelSelected: { color: theme.accent },
  feature: {
    backgroundColor: theme.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  featureTitle: { fontSize: 15, fontWeight: "700", color: theme.ink, marginBottom: 6 },
  featureDesc: { fontSize: 13, lineHeight: 20, color: theme.muted },
  cta: {
    marginTop: 24,
    backgroundColor: theme.ink,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  ctaText: {
    color: theme.white,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
