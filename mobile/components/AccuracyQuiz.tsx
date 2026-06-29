import { Pressable, StyleSheet, Text, View } from "react-native";

import AccuracyResult from "@/components/AccuracyResult";
import { theme } from "@/constants/theme";
import { useLearning } from "@/context/LearningContext";
import { useLocale } from "@/context/LocaleContext";
import { hapticSelection } from "@/utils/haptics";
import type { AccuracyType, HistoryCard } from "../../types/index";

/**
 * Guess-the-accuracy mini quiz. Hides the verdict until the player guesses,
 * then reveals correctness feedback, the real verdict, and XP earned.
 */
export default function AccuracyQuiz({
  card,
  explanation,
}: {
  card: HistoryCard;
  explanation?: string;
}) {
  const { dictionary } = useLocale();
  const c = dictionary.common;
  const { getGuess, setGuess } = useLearning();
  const guess = getGuess(card.id);
  const actual = card.accuracyType;

  if (!actual) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{c.accuracyGuessTitle}</Text>
      {!guess ? (
        <>
          <Text style={styles.hint}>{c.accuracyGuessSubtitle}</Text>
          <View style={styles.grid}>
            {(Object.keys(c.accuracyOptions) as AccuracyType[]).map((val) => (
              <Pressable
                key={val}
                style={styles.opt}
                onPress={() => {
                  hapticSelection();
                  setGuess(card.id, val);
                }}
                accessibilityRole="button"
                accessibilityLabel={c.accuracyOptions[val]}
              >
                <Text style={styles.optText}>{c.accuracyOptions[val]}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <AccuracyResult guess={guess} actual={actual} explanation={explanation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },
  label: { fontSize: 10, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase", color: theme.muted, marginBottom: 8 },
  hint: { fontSize: 13, lineHeight: 20, color: theme.muted, marginBottom: 14 },
  grid: { gap: 8 },
  opt: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.paper,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  optText: { fontSize: 13, fontWeight: "700", color: theme.ink },
});
