import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import MediaDossierView from "@/components/MediaDossierView";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { usePrimaryTabFocus } from "@/hooks/usePrimaryTabFocus";
import { getCards } from "@shared/content";
import { getDossierBySlug } from "@shared/dossier";

export default function MediaScreen() {
  usePrimaryTabFocus("explore");
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { locale, dictionary } = useLocale();
  const allCards = getCards(locale);
  const dossier = slug ? getDossierBySlug(allCards, slug) : undefined;

  if (!dossier) {
    const fallback = slug === "shgun" ? getDossierBySlug(allCards, "shogun") : undefined;
    if (!fallback) {
      return (
        <View style={styles.center}>
          <Text style={styles.muted}>{dictionary.common.error}</Text>
        </View>
      );
    }
    return <MediaDossierView dossier={fallback} allCards={allCards} />;
  }

  return <MediaDossierView dossier={dossier} allCards={allCards} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.bg },
  muted: { color: theme.muted },
});
