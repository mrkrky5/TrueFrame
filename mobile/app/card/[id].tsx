import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import CardReader from "@/components/CardReader";
import CardReaderTopBar from "@/components/CardReaderTopBar";
import FadeSlideIn from "@/components/motion/FadeSlideIn";
import { flexScrollChild } from "@/constants/scrollable";
import { theme } from "@/constants/theme";
import { useContent, useCards } from "@/context/ContentContext";
import { useLocale } from "@/context/LocaleContext";
import { useNavigationTab } from "@/context/NavigationContext";
import { navigateReaderExit } from "@/utils/navigationExit";
import { getCardById, isCardBodyReady } from "@shared/content";
import type { HistoryCard } from "../../types/index";

export default function CardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { locale, dictionary } = useLocale();
  const { lastPrimaryTab, readerReturn } = useNavigationTab();
  const { ensureCatalog } = useContent();
  const allCards = useCards();
  const [card, setCard] = useState<HistoryCard | undefined>(
    id ? getCardById(locale, id) : undefined
  );
  const [loading, setLoading] = useState(Boolean(id && !isCardBodyReady(card)));
  const t = dictionary.error;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    void ensureCatalog(locale).then(() => {
      if (cancelled) return;
      const loaded = getCardById(locale, id);
      setCard(loaded);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id, locale, ensureCatalog]);

  if (loading) {
    return (
      <View style={styles.root}>
        <CardReaderTopBar />
        <View style={styles.center}>
          <ActivityIndicator color={theme.accent} />
        </View>
      </View>
    );
  }

  if (!card || !isCardBodyReady(card)) {
    return (
      <View style={styles.root}>
        <CardReaderTopBar />
        <View style={styles.center}>
          <Text style={styles.title}>{t.cardNotFoundTitle}</Text>
          <Text style={styles.desc}>{t.cardNotFoundDesc}</Text>
          <Pressable
            style={styles.btn}
            accessibilityRole="button"
            accessibilityLabel={t.goHome}
            onPress={() => navigateReaderExit(router, readerReturn, lastPrimaryTab)}
          >
            <Text style={styles.btnText}>{t.goHome}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <FadeSlideIn enterKey={card.id} style={flexScrollChild}>
      <CardReader card={card} allCards={allCards} />
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.ink,
    textAlign: "center",
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.muted,
    textAlign: "center",
    marginBottom: 24,
  },
  btn: {
    backgroundColor: theme.ink,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    minWidth: 180,
    alignItems: "center",
  },
  btnText: { color: theme.white, fontSize: 12, fontWeight: "700" },
});
