import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DetailBackBar from "@/components/DetailBackBar";
import DossierShareButton from "@/components/DossierShareButton";
import HistoryCardItem from "@/components/HistoryCard";
import { screenBottomInset } from "@/constants/layout";
import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { useNavigationTab } from "@/context/NavigationContext";
import { navigateToCard } from "@/utils/navigationExit";
import { formatExploreDossierMeta } from "@/utils/formatDossierMeta";
import { sortCardsByReadState } from "@shared/cardSort";
import { getRoutes } from "@shared/content";
import { formatMediaType } from "@shared/contentBlocks";
import type { MediaDossier } from "@shared/dossier";
import { getStrongDossiers } from "@shared/dossier";
import { findBestRouteForDossier } from "@shared/routeMatch";
import type { HistoryCard as HistoryCardType } from "../../types/index";

export default function MediaDossierView({
  dossier,
  allCards,
}: {
  dossier: MediaDossier;
  allCards: HistoryCardType[];
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { dictionary, locale } = useLocale();
  const { readIds } = useHistory();
  const { setReaderReturn } = useNavigationTab();
  const dossierReturn = { kind: "dossier" as const, slug: dossier.slug };
  const routes = getRoutes(locale);

  const matchedRoute = useMemo(
    () => findBestRouteForDossier(dossier, routes),
    [dossier, routes]
  );

  const progress = useMemo(() => {
    const completed = dossier.cardIds.filter((id) => readIds.includes(id)).length;
    const total = dossier.cardIds.length;
    return { completed, total, percentage: total ? Math.round((completed / total) * 100) : 0 };
  }, [dossier, readIds]);

  const recommended = useMemo(() => {
    const unreadFlagship = dossier.cards.filter((c) => c.isFlagship && !readIds.includes(c.id));
    if (unreadFlagship.length) return unreadFlagship[0];
    const unread = dossier.cards.filter((c) => !readIds.includes(c.id));
    if (unread.length) return unread[0];
    return dossier.cards.find((c) => c.isFlagship) || dossier.cards[0];
  }, [dossier, readIds]);

  const related = useMemo(
    () =>
      getStrongDossiers(allCards)
        .filter(
          (d) =>
            d.slug !== dossier.slug &&
            (d.mediaType === dossier.mediaType ||
              d.topTags.some((t) => dossier.topTags.includes(t)))
        )
        .slice(0, 3),
    [allCards, dossier]
  );

  const flagshipCards = useMemo(
    () => sortCardsByReadState(dossier.cards.filter((c) => c.isFlagship), readIds),
    [dossier.cards, readIds]
  );
  const standardCards = useMemo(
    () => sortCardsByReadState(dossier.cards.filter((c) => !c.isFlagship), readIds),
    [dossier.cards, readIds]
  );

  const tags = dossier.topTags.slice(0, 3).join(localeTagSep(dictionary));

  const bottomPad = screenBottomInset(insets.bottom);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: 12, paddingBottom: bottomPad }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <DetailBackBar fallbackHref="/explore" variant="inline" exitMode="replace" />

      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {formatMediaType(dossier.mediaType, dictionary)} · {dictionary.common.dossierHeader}
          </Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{dossier.title}</Text>
          <DossierShareButton slug={dossier.slug} title={dossier.title} />
        </View>
        <Text style={styles.desc}>
          {formatExploreDossierMeta(dossier, dictionary, locale)}
          {tags ? ` · ${tags}` : ""}
        </Text>

        <View style={styles.progressCard}>
          <View style={styles.progressHead}>
            <Text style={styles.progressLabel}>{dictionary.common.dossierProgress}</Text>
            <Text style={styles.progressPct}>{progress.percentage}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
          </View>
          <Text style={styles.progressMeta}>
            {progress.completed === progress.total
              ? dictionary.common.dossierCompleted
              : `${progress.completed} / ${progress.total} ${dictionary.common.cardsRead}`}
          </Text>
        </View>
      </View>

      {matchedRoute ? (
        <Pressable
          style={styles.routeBridge}
          onPress={() => router.push(`/routes/${matchedRoute.id}` as any)}
        >
          <Ionicons name="map-outline" size={18} color={theme.accent} />
          <View style={styles.routeBridgeText}>
            <Text style={styles.routeBridgeLabel}>{dictionary.common.exploreAsRoute}</Text>
            <Text style={styles.routeBridgeTitle}>{matchedRoute.title}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.muted} />
        </Pressable>
      ) : null}

      {recommended ? (
        <Pressable
          style={styles.cta}
          onPress={() =>
            navigateToCard(router, recommended.id, setReaderReturn, dossierReturn)
          }
        >
          <Text style={styles.ctaLabel}>{dictionary.common.nextStep}</Text>
          <Text style={styles.ctaTitle}>{recommended.title}</Text>
          <Text style={styles.ctaBtn}>
            {readIds.includes(recommended.id)
              ? dictionary.common.readAgain
              : progress.completed > 0
                ? dictionary.common.continueJourney
                : dictionary.common.startJourney}
          </Text>
        </Pressable>
      ) : null}

      {flagshipCards.length ? (
        <>
          <Text style={styles.section}>{dictionary.common.flagship}</Text>
          {flagshipCards.map((c) => (
            <HistoryCardItem
              key={c.id}
              card={c}
              isRead={readIds.includes(c.id)}
              returnTo={dossierReturn}
            />
          ))}
        </>
      ) : null}

      {standardCards.length ? (
        <>
          <Text style={styles.section}>{dictionary.common.otherCardsSection}</Text>
          {standardCards.map((c) => (
            <HistoryCardItem
              key={c.id}
              card={c}
              isRead={readIds.includes(c.id)}
              returnTo={dossierReturn}
            />
          ))}
        </>
      ) : null}

      {related.length ? (
        <>
          <Text style={styles.section}>{dictionary.common.relatedDossiersSection}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {related.map((d) => (
              <Pressable
                key={d.slug}
                style={styles.relatedCard}
                onPress={() => router.replace(`/explore/media/${d.slug}` as never)}
              >
                <Text style={styles.relatedTitle} numberOfLines={2}>
                  {d.title}
                </Text>
                <Text style={styles.relatedMeta}>
                  {d.cardIds.length} {dictionary.common.cardsCountLabel}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : null}
    </ScrollView>
  );
}

function localeTagSep(dictionary: Record<string, any>) {
  return dictionary.common.andSeparator ?? " · ";
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  content: { paddingHorizontal: 20 },
  hero: { marginBottom: 24 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.accentSoft,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 1.5, color: theme.accent, textTransform: "uppercase" },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  title: { flex: 1, fontSize: 32, fontWeight: "600", color: theme.ink, lineHeight: 38 },
  desc: { fontSize: 13, color: theme.muted, lineHeight: 20, marginBottom: 20 },
  progressCard: {
    backgroundColor: theme.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  progressHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  progressLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, color: theme.muted },
  progressPct: { fontSize: 12, fontWeight: "800", color: theme.accent },
  progressTrack: { height: 6, backgroundColor: theme.paper, borderRadius: 999, overflow: "hidden", marginBottom: 8 },
  progressFill: { height: "100%", backgroundColor: theme.accent },
  progressMeta: { fontSize: 11, fontWeight: "700", color: theme.muted },
  routeBridge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  routeBridgeText: { flex: 1 },
  routeBridgeLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 1.5, color: theme.muted, marginBottom: 4 },
  routeBridgeTitle: { fontSize: 14, fontWeight: "600", color: theme.ink },
  cta: {
    backgroundColor: theme.ink,
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },
  ctaLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, color: theme.accent, marginBottom: 8 },
  ctaTitle: { fontSize: 20, fontWeight: "600", color: theme.white, marginBottom: 12, lineHeight: 26 },
  ctaBtn: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2, color: theme.white, textTransform: "uppercase" },
  section: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: theme.muted,
    marginBottom: 12,
    marginTop: 8,
  },
  relatedCard: {
    width: 140,
    padding: 14,
    backgroundColor: theme.white,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  relatedTitle: { fontSize: 13, fontWeight: "600", color: theme.ink, marginBottom: 6, minHeight: 36 },
  relatedMeta: { fontSize: 10, fontWeight: "700", color: theme.accent },
});
