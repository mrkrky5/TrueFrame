import { Link } from "expo-router";
import { useMemo, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tabBarBottomInset } from "@/constants/layout";
import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { getCards, getRoutes } from "@shared/content";
import { usePrimaryTabFocus } from "@/hooks/usePrimaryTabFocus";
import { useTabScrollToTop } from "@/hooks/useTabScrollToTop";

export default function RoutesScreen() {
  usePrimaryTabFocus("routes");
  const scrollRef = useRef<ScrollView>(null);
  useTabScrollToTop("routes", scrollRef);
  const insets = useSafeAreaInsets();
  const { locale, dictionary } = useLocale();
  const { readIds, ready } = useHistory();
  const routes = getRoutes(locale);
  const cards = getCards(locale);

  const routeStats = useMemo(() => {
    return routes.map((route) => {
      const routeCards = cards.filter((c) => route.cardIds.includes(c.id));
      const completed = routeCards.filter((c) => readIds.includes(c.id)).length;
      const progress = routeCards.length ? (completed / routeCards.length) * 100 : 0;
      return { ...route, progress, completed, total: routeCards.length };
    });
  }, [routes, cards, readIds]);

  const active = routeStats.filter((r) => r.progress > 0 && r.progress < 100);
  const rest = routeStats.filter((r) => !active.find((a) => a.id === r.id));

  const bottomPad = tabBarBottomInset(insets.bottom) + 16;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8, flex: 1 }]}>
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
      contentInsetAdjustmentBehavior="never"
    >
      <Text style={styles.badge}>{dictionary.routes?.learningJourneys ?? "TARİHSEL YOLCULUK"}</Text>
      <Text style={styles.title}>{dictionary.nav.routes}</Text>
      <Text style={styles.subtitle}>{dictionary.routes?.subtitle}</Text>
      <Text style={styles.explainer}>{dictionary.routes?.explainer}</Text>

      {ready && active.length > 0 ? (
        <>
          <Text style={styles.section}>{dictionary.routes?.continueJourney ?? "Devam Eden"}</Text>
          {active.map((route) => (
            <Link key={route.id} href={`/routes/${route.id}` as never} asChild>
              <Pressable style={styles.activeCard}>
                <Text style={styles.activePct}>%{Math.round(route.progress)}</Text>
                <Text style={styles.activeTitle}>{route.title}</Text>
                <Text style={styles.activeMeta}>
                  {route.completed}/{route.total} · {dictionary.routes?.continue ?? "DEVAM ET"} →
                </Text>
              </Pressable>
            </Link>
          ))}
        </>
      ) : null}

      <Text style={styles.section}>{dictionary.routes?.allRoutes ?? "Tüm Rotalar"}</Text>
      {rest.map((route) => (
        <Link key={route.id} href={`/routes/${route.id}` as never} asChild>
          <Pressable style={styles.routeCard}>
            <Text style={styles.routeTitle}>{route.title}</Text>
            <Text style={styles.routeDesc} numberOfLines={2}>
              {route.description}
            </Text>
            <Text style={styles.routeMeta}>
              {route.total} {dictionary.common.cardsCountLabel}
            </Text>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  badge: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    color: theme.accent,
    marginBottom: 10,
  },
  title: { fontSize: 32, fontWeight: "600", color: theme.ink, marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 22, color: theme.muted, marginBottom: 10, maxWidth: 320 },
  explainer: { fontSize: 13, lineHeight: 20, color: theme.muted, marginBottom: 22, maxWidth: 340 },
  section: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: theme.muted,
    marginBottom: 12,
    marginTop: 8,
  },
  activeCard: {
    backgroundColor: theme.cardDark,
    borderRadius: 22,
    padding: 20,
    marginBottom: 12,
  },
  activePct: { color: theme.accent, fontSize: 11, fontWeight: "800", marginBottom: 8 },
  activeTitle: { color: theme.white, fontSize: 20, fontWeight: "600", marginBottom: 8 },
  activeMeta: { color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: "700" },
  routeCard: {
    ...surfaces.card,
    ...surfaces.cardAccent,
    padding: 18,
    marginBottom: 12,
    borderRadius: 20,
  },
  routeTitle: { fontSize: 18, fontWeight: "600", color: theme.ink, marginBottom: 6 },
  routeDesc: { fontSize: 13, lineHeight: 20, color: theme.muted, marginBottom: 8 },
  routeMeta: { fontSize: 10, fontWeight: "700", color: theme.accent },
});
