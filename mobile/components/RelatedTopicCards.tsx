import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import HistoryCard from "@/components/HistoryCard";
import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { useNavigationTab } from "@/context/NavigationContext";
import { getSmartRelatedCards } from "@shared/relatedCards";
import type { HistoryCard as Card } from "../../types/index";

export default function RelatedTopicCards({
  card,
  allCards,
  beforeNavigate,
}: {
  card: Card;
  allCards: Card[];
  beforeNavigate?: () => void;
}) {
  const { readIds } = useHistory();
  const { dictionary } = useLocale();
  const { readerReturn, lastPrimaryTab } = useNavigationTab();
  const returnTo = readerReturn ?? { kind: "tab", tab: lastPrimaryTab };

  const related = useMemo(
    () => getSmartRelatedCards(card, allCards, readIds, 3),
    [card, allCards, readIds]
  );

  if (related.length === 0) return null;

  const hint = (dictionary.card.relatedTopicHint ?? "{{count}} more on this topic").replace(
    "{{count}}",
    String(related.length)
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>{dictionary.card.relatedTopicHeading ?? "Related topic"}</Text>
      <Text style={styles.hint}>{hint}</Text>
      {related.map((item) => (
        <HistoryCard
          key={item.id}
          card={item}
          isRead={readIds.includes(item.id)}
          returnTo={returnTo}
          navigationMode="replace"
          beforeNavigate={beforeNavigate}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", marginTop: 8, marginBottom: 4 },
  heading: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: theme.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.muted,
    marginBottom: 12,
  },
});
