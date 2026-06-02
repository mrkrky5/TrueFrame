import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CardRow from "@/components/CardRow";
import DetailBackBar from "@/components/DetailBackBar";
import { screenBottomInset } from "@/constants/layout";
import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { useNavigationTab } from "@/context/NavigationContext";
import { getCards, getRoutes } from "@shared/content";
import { sortCardsByReadState } from "@shared/cardSort";
import { getRouteById } from "@shared/dossier";
import { getNextUnreadInRoute } from "@shared/homeProgress";
import { usePrimaryTabFocus } from "@/hooks/usePrimaryTabFocus";
import { useOpenCard } from "@/hooks/useOpenCard";

export default function RouteDetailScreen() {
  usePrimaryTabFocus("routes");
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { locale, dictionary } = useLocale();
  const { readIds } = useHistory();
  const openCard = useOpenCard();
  const routes = getRoutes(locale);
  const cards = getCards(locale);
  const route = id ? getRouteById(routes, id) : undefined;
  const routeReturn = route ? { kind: "route" as const, routeId: route.id } : null;

  const routeCards = useMemo(
    () => (route ? cards.filter((c) => route.cardIds.includes(c.id)) : []),
    [route, cards]
  );

  const progress = useMemo(() => {
    const completed = routeCards.filter((c) => readIds.includes(c.id)).length;
    return {
      completed,
      total: routeCards.length,
      pct: routeCards.length ? Math.round((completed / routeCards.length) * 100) : 0,
    };
  }, [routeCards, readIds]);

  const nextCard = route ? getNextUnreadInRoute(route, cards, readIds) : undefined;
  const sortedRouteCards = useMemo(
    () => sortCardsByReadState(routeCards, readIds),
    [routeCards, readIds]
  );
  const routeIncomplete = progress.completed < progress.total;
  const bottomPad = screenBottomInset(insets.bottom, { includeTabBar: false });

  if (!route) {
    return (
      <View style={styles.root}>
        <DetailBackBar fallbackHref="/routes" exitMode="replace" />
        <View style={styles.center}>
          <Text style={styles.muted}>{dictionary.common.error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <DetailBackBar fallbackHref="/routes" exitMode="replace" />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.badge}>{dictionary.routes?.learningJourneys ?? "TARİHSEL YOLCULUK"}</Text>
        <Text style={styles.title}>{route.title}</Text>
        <Text style={styles.desc}>{route.description}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>{dictionary.routes?.duration ?? "SÜRE"}</Text>
            <Text style={styles.statValue}>
              {routeCards.reduce((a, c) => a + c.readingTimeMinutes, 0)} {dictionary.common.minutes}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>{dictionary.routes?.progress ?? "İLERLEME"}</Text>
            <Text style={styles.statValue}>%{progress.pct}</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress.pct}%` }]} />
        </View>

        {nextCard && routeIncomplete && routeReturn ? (
            <Pressable
              style={styles.cta}
              onPress={() => openCard(nextCard.id, routeReturn)}
            >
              <Text style={styles.ctaLabel}>
                {(dictionary.routes?.nextCardLabel ?? "Next: {{title}}").replace(
                  "{{title}}",
                  nextCard.title
                )}
              </Text>
              <Text style={styles.ctaSub}>
                {progress.completed === 0
                  ? dictionary.routes?.start ?? "BAŞLA"
                  : `${progress.completed}/${progress.total}`}
              </Text>
            </Pressable>
        ) : null}

        <Text style={styles.section}>{dictionary.routes?.routeCards ?? "Rotadaki Kartlar"}</Text>
        {sortedRouteCards.map((card) => (
          <CardRow
            key={card.id}
            card={card}
            locale={locale}
            isRead={readIds.includes(card.id)}
            returnTo={routeReturn ?? undefined}
            badge={readIds.includes(card.id) ? dictionary.common.readStatus : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  screen: { flex: 1 },
  content: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { color: theme.muted },
  badge: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    color: theme.accent,
    marginBottom: 12,
  },
  title: { fontSize: 30, fontWeight: "600", color: theme.ink, lineHeight: 36, marginBottom: 10 },
  desc: { fontSize: 14, lineHeight: 22, color: theme.muted, marginBottom: 20 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  stat: {
    flex: 1,
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  statLabel: { fontSize: 9, fontWeight: "800", color: theme.muted, letterSpacing: 1.5, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "600", color: theme.ink },
  progressTrack: {
    height: 6,
    backgroundColor: theme.paper,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill: { height: "100%", backgroundColor: theme.accent },
  cta: {
    backgroundColor: theme.ink,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 28,
  },
  ctaLabel: { color: theme.white, fontSize: 14, fontWeight: "600", lineHeight: 20, marginBottom: 6 },
  ctaSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  section: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: theme.muted,
    marginBottom: 12,
  },
});
