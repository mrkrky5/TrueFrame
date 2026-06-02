import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import CardReader from "@/components/CardReader";
import CardReaderTopBar from "@/components/CardReaderTopBar";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { navigateReaderExit } from "@/utils/navigationExit";
import { useNavigationTab } from "@/context/NavigationContext";
import { getCardById, getCards } from "@shared/content";

export default function CardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { locale, dictionary } = useLocale();
  const { lastPrimaryTab, readerReturn } = useNavigationTab();
  const allCards = getCards(locale);
  const card = id ? getCardById(locale, id) : undefined;
  const t = dictionary.error;

  if (!card) {
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

  return <CardReader card={card} allCards={allCards} />;
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
