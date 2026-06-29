import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AccuracyBadge from "@/components/AccuracyBadge";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { scoreGuess, xpForVerdict, type GuessVerdict } from "@shared/accuracyScore";
import type { AccuracyType } from "../../types/index";

const TONES: Record<GuessVerdict, { color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  correct: { color: "#15803d", icon: "checkmark-circle" },
  close: { color: theme.accent, icon: "swap-horizontal" },
  wrong: { color: theme.spoilerMajor, icon: "close-circle" },
};

export default function AccuracyResult({
  guess,
  actual,
  explanation,
}: {
  guess: AccuracyType;
  actual: AccuracyType;
  explanation?: string;
}) {
  const { dictionary } = useLocale();
  const c = dictionary.common;
  const verdict = scoreGuess(guess, actual);
  const tone = TONES[verdict];
  const label =
    verdict === "correct" ? c.guessCorrect : verdict === "close" ? c.guessClose : c.guessWrong;
  const xp = xpForVerdict(verdict);
  const xpLabel = (c.xpEarned ?? "+{{xp}} XP").replace("{{xp}}", String(xp));

  return (
    <View style={styles.wrap}>
      <View style={[styles.feedbackRow, { borderColor: tone.color, backgroundColor: `${tone.color}14` }]}>
        <Ionicons name={tone.icon} size={20} color={tone.color} />
        <Text style={[styles.feedback, { color: tone.color }]} maxFontSizeMultiplier={1.4}>
          {label}
        </Text>
        <View style={[styles.xpChip, { backgroundColor: tone.color }]}>
          <Text style={styles.xpText} maxFontSizeMultiplier={1.3}>
            {xpLabel}
          </Text>
        </View>
      </View>

      <View style={styles.guessLine}>
        <Text style={styles.miniLabel}>{c.guessYour}</Text>
        <Text style={styles.guessVal}>{c.accuracyOptions[guess] ?? guess}</Text>
      </View>

      <Text style={styles.miniLabel}>{c.actualRating}</Text>
      <View style={styles.badgeRow}>
        <AccuracyBadge accuracy={actual} />
      </View>

      {explanation ? <Text style={styles.explanation}>{explanation}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  feedback: { flex: 1, fontSize: 14, fontWeight: "800" },
  xpChip: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  xpText: { color: theme.white, fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  guessLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  miniLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2, color: theme.muted, textTransform: "uppercase" },
  guessVal: { fontSize: 13, fontWeight: "700", color: theme.ink },
  badgeRow: { flexDirection: "row" },
  explanation: { fontSize: 15, lineHeight: 24, color: theme.muted },
});
