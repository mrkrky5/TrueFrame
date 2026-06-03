import { Link, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CardRow from "@/components/CardRow";
import HomeLanguageSheet from "@/components/HomeLanguageSheet";
import { HomeTabSkeleton } from "@/components/ui/AppSkeleton";
import { tabBarBottomInset } from "@/constants/layout";
import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { usePrimaryTabFocus } from "@/hooks/usePrimaryTabFocus";
import { useTabScrollToTop } from "@/hooks/useTabScrollToTop";
import { useCardProgress } from "@/hooks/useCardProgress";
import { getCards, getRoutes } from "@shared/content";
import { getStrongDossiers } from "@shared/dossier";
import { type } from "@/constants/typography";
import { getPrimaryHomeContinue } from "@shared/homeProgress";
import { formatReadStreakLabel } from "@shared/formatReadStreak";
import { useNavigationTab } from "@/context/NavigationContext";
import { useOpenCard } from "@/hooks/useOpenCard";
import { getDailyCard } from "@shared/daily";
import { deriveCardBlocks } from "@shared/contentBlocks";
import type { HistoryCard } from "../../types/index";

function ContinueCard({ card, locale }: { card: HistoryCard; locale: string }) {
  const { dictionary } = useLocale();
  const blockCount = useMemo(
    () => (card.isFlagship ? deriveCardBlocks(card, dictionary).length : 0),
    [card, dictionary]
  );
  const { pct, inProgress } = useCardProgress(card.id, blockCount);
  const homeReturn = { kind: "tab" as const, tab: "index" as const };

  return (
    <CardRow
      card={card}
      locale={locale}
      returnTo={homeReturn}
      progressPct={inProgress ? pct : undefined}
      subtitle={
        inProgress
          ? `${dictionary.common.continueAction} · %${pct}`
          : undefined
      }
    />
  );
}

export default function HomeScreen() {
  usePrimaryTabFocus("index");
  const scrollRef = useRef<ScrollView>(null);
  useTabScrollToTop("index", scrollRef);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, dictionary } = useLocale();
  const { recentIds, readIds, ready, readStreak, readToday } = useHistory();
  const { setReaderReturn } = useNavigationTab();
  const openCard = useOpenCard();
  const homeReturn = { kind: "tab" as const, tab: "index" as const };
  const cards = getCards(locale);
  const routes = getRoutes(locale);
  const dossiers = useMemo(() => getStrongDossiers(cards), [cards]);
  const daily = getDailyCard(cards);

  const primaryContinue = useMemo(() => {
    if (!ready) return null;
    return getPrimaryHomeContinue(routes, dossiers, cards, readIds);
  }, [ready, routes, dossiers, cards, readIds]);

  const continueItems = useMemo(() => {
    return recentIds
      .map((id) => cards.find((c) => c.id === id))
      .filter(Boolean)
      .filter((c) => !readIds.includes(c!.id))
      .slice(0, 5) as typeof cards;
  }, [recentIds, cards, readIds]);

  const streakLabel = useMemo(
    () =>
      formatReadStreakLabel(readStreak, readToday, {
        readStreakOne: dictionary.home.readStreakOne,
        readStreakMany: dictionary.home.readStreakMany,
        readStreakToday: dictionary.home.readStreakToday,
        readStreakStart: dictionary.home.readStreakStart,
      }),
    [readStreak, readToday, dictionary.home]
  );

  const featuredRoutes = useMemo(() => routes.slice(0, 2), [routes]);
  const bottomPad = tabBarBottomInset(insets.bottom) + 40;
  const [languageOpen, setLanguageOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const progressLabel = primaryContinue
    ? (dictionary.home.progressCount ?? "{{done}}/{{total}}")
        .replace("{{done}}", String(primaryContinue.done))
        .replace("{{total}}", String(primaryContinue.total))
    : null;

  const nextLine = primaryContinue?.nextCardTitle
    ? (dictionary.home.primaryContinueNext ?? "").replace("{{title}}", primaryContinue.nextCardTitle)
    : null;

  if (!ready) {
    return (
      <View style={[styles.screenRoot, styles.screen, { paddingTop: insets.top + 8 }]}>
        <HomeTabSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.screenRoot, { paddingTop: insets.top + 8 }]}>
    <ScrollView
      ref={scrollRef}
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{dictionary.home.greeting}</Text>
            <Text style={styles.title}>{dictionary.common.brandingTitle}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              style={styles.iconBtn}
              onPress={() => router.push("/settings" as never)}
              accessibilityRole="button"
              accessibilityLabel={dictionary.settings.title}
              hitSlop={8}
            >
              <Ionicons name="settings-outline" size={20} color={theme.ink} />
            </Pressable>
            <Pressable
              style={styles.langBtn}
              onPress={() => setLanguageOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={dictionary.home.languageShortcut}
              hitSlop={8}
            >
              <Ionicons name="language-outline" size={18} color={theme.ink} />
              <Text style={styles.langBtnText}>{dictionary.home.languageShortcut}</Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.valueSubtitle}>{dictionary.home.valueSubtitle}</Text>
        <Text style={styles.howItWorksInline}>
          {howItWorksOpen ? (
            <>
              <Text style={styles.howItWorksTitle}>{dictionary.home.howItWorksTitle} </Text>
              {dictionary.home.howItWorksBody}
            </>
          ) : (
            dictionary.home.howItWorksShort
          )}
        </Text>
        <Pressable onPress={() => setHowItWorksOpen((v) => !v)} hitSlop={8} style={styles.howItWorksToggle}>
          <Text style={styles.howItWorksToggleText}>
            {howItWorksOpen ? dictionary.home.howItWorksLess : dictionary.home.howItWorksMore}
          </Text>
        </Pressable>
      </View>

      {ready ? (
        <View style={styles.streakPill}>
          <Ionicons name="flame-outline" size={16} color={theme.accent} />
          <Text style={styles.streakText}>{streakLabel}</Text>
        </View>
      ) : null}

      {primaryContinue ? (
        <>
          <Text style={styles.sectionLabel}>{dictionary.home.primaryContinueLabel}</Text>
          <Link href={primaryContinue.href as never} asChild>
            <Pressable
              style={styles.primaryHero}
              onPress={() => setReaderReturn({ kind: "tab", tab: "index" })}
            >
              <View style={styles.primaryHeroHead}>
                <Ionicons
                  name={primaryContinue.kind === "route" ? "map-outline" : "folder-outline"}
                  size={18}
                  color="rgba(255,255,255,0.7)"
                />
                <Text style={styles.primaryHeroKind}>
                  {primaryContinue.kind === "route"
                    ? dictionary.nav.routes
                    : dictionary.common.dossierHeader}
                </Text>
              </View>
              <Text style={styles.primaryHeroTitle}>{primaryContinue.title}</Text>
              {nextLine ? <Text style={styles.primaryHeroNext}>{nextLine}</Text> : null}
              <View style={styles.progressTrackLight}>
                <View style={[styles.progressFillLight, { width: `${primaryContinue.pct}%` }]} />
              </View>
              {progressLabel ? <Text style={styles.primaryHeroMeta}>{progressLabel}</Text> : null}
              <View style={styles.primaryHeroCta}>
                <Text style={styles.primaryHeroCtaText}>{dictionary.home.primaryContinueCta}</Text>
                <Ionicons name="arrow-forward" size={16} color={theme.ink} />
              </View>
            </Pressable>
          </Link>
        </>
      ) : null}

      <View style={surfaces.sectionLabelPill}>
        <Text style={styles.sectionLabelInPill}>{dictionary.home.dailyRealityCheckSignal}</Text>
      </View>
      <View style={styles.dailyCard}>
        <Text style={styles.dailyTag}>{dictionary.common.vsReality}</Text>
        <Text style={styles.dailyTitle}>{daily.title}</Text>
        <Text style={styles.dailySubtitle} numberOfLines={2}>
          {daily.subtitle || daily.whatWeSee}
        </Text>
        <Pressable
          style={styles.dailyButton}
          onPress={() => openCard(daily.id, homeReturn)}
        >
          <Text style={styles.dailyButtonText}>{dictionary.common.seeReality}</Text>
        </Pressable>
      </View>

      {ready && !primaryContinue && continueItems.length > 0 ? (
        <>
          <Text style={styles.sectionLabel}>{dictionary.saved.recentlyViewed}</Text>
          <ContinueCard key={continueItems[0].id} card={continueItems[0]} locale={locale} />
          {continueItems.length > 1 ? (
            <Link href="/saved" asChild>
              <Pressable style={styles.seeAllBtn}>
                <Text style={styles.seeAllBtnText}>{dictionary.home.seeAllRecent}</Text>
              </Pressable>
            </Link>
          ) : null}
        </>
      ) : null}

      <Text style={styles.sectionLabel}>{dictionary.nav.routes}</Text>
      <Text style={styles.sectionHint}>{dictionary.routes?.explainer}</Text>
      {featuredRoutes.map((route) => {
        const routeCards = cards.filter((c) => route.cardIds.includes(c.id));
        const done = routeCards.filter((c) => readIds.includes(c.id)).length;
        const total = routeCards.length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        const progressLabelRoute = (dictionary.home.routeProgressCount ?? "{{done}}/{{total}}")
          .replace("{{done}}", String(done))
          .replace("{{total}}", String(total));
        return (
          <Link key={route.id} href={`/routes/${route.id}` as never} asChild>
            <Pressable style={styles.routeRow}>
              <Text style={styles.routeTitle}>{route.title}</Text>
              {done > 0 ? (
                <>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.routePct}>{progressLabelRoute}</Text>
                </>
              ) : (
                <Text style={styles.routeStart}>{dictionary.home.routeStart}</Text>
              )}
            </Pressable>
          </Link>
        );
      })}
      {routes.length > featuredRoutes.length ? (
        <Link href="/routes" asChild>
          <Pressable style={styles.seeAllBtn}>
            <Text style={styles.seeAllBtnText}>{dictionary.home.routesSeeAll}</Text>
          </Pressable>
        </Link>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.footerHint}>{dictionary.home.exploreArchiveLabel}</Text>
        <Link href="/explore" asChild>
          <Pressable style={styles.footerButton}>
            <Text style={styles.footerButtonText}>{dictionary.common.exploreLibrary}</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
    <HomeLanguageSheet visible={languageOpen} onClose={() => setLanguageOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: { flex: 1, position: "relative" },
  screen: { flex: 1, backgroundColor: theme.bg },
  content: { paddingHorizontal: 20 },
  header: { marginBottom: 16 },
  headerTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  headerText: { flex: 1 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    ...surfaces.inset,
  },
  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    ...surfaces.inset,
    marginTop: 4,
  },
  langBtnText: { fontSize: 11, fontWeight: "700", color: theme.ink },
  greeting: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: theme.muted,
    marginBottom: 6,
  },
  title: { ...type.brandTitle },
  valueSubtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: theme.ink,
    marginTop: 12,
    maxWidth: 340,
  },
  howItWorksInline: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
    color: theme.muted,
    maxWidth: 340,
  },
  howItWorksTitle: { fontWeight: "700", color: theme.ink },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: theme.accentSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 16,
  },
  streakText: { fontSize: 12, fontWeight: "700", color: theme.ink },
  howItWorksToggle: { alignSelf: "flex-start", marginTop: 6 },
  howItWorksToggleText: { fontSize: 12, fontWeight: "700", color: theme.accent },
  sectionLabel: {
    ...type.sectionCaps,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionLabelInPill: {
    ...type.sectionCaps,
    marginBottom: 0,
    marginTop: 0,
  },
  sectionHint: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.muted,
    marginBottom: 12,
    maxWidth: 340,
  },
  primaryHero: {
    backgroundColor: theme.cardDark,
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
  },
  primaryHeroHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  primaryHeroKind: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.55)",
    textTransform: "uppercase",
  },
  primaryHeroTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.white,
    lineHeight: 30,
    marginBottom: 8,
  },
  primaryHeroNext: {
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 16,
  },
  primaryHeroMeta: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.45)",
    marginTop: 6,
    marginBottom: 20,
  },
  progressTrackLight: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFillLight: { height: "100%", backgroundColor: theme.white },
  primaryHeroCta: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    backgroundColor: theme.white,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
  },
  primaryHeroCtaText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: theme.ink,
  },
  dailyCard: {
    ...surfaces.card,
    ...surfaces.cardAccent,
    padding: 18,
    marginBottom: 24,
  },
  dailyTag: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    color: theme.muted,
    marginBottom: 10,
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.ink,
    lineHeight: 24,
    marginBottom: 8,
  },
  dailySubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.muted,
    marginBottom: 14,
  },
  dailyButton: {
    alignSelf: "flex-start",
    backgroundColor: theme.ink,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  dailyButtonText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: theme.white,
  },
  routeRow: {
    ...surfaces.card,
    ...surfaces.cardAccent,
    padding: 16,
    marginBottom: 10,
  },
  routeTitle: { fontSize: 15, fontWeight: "600", color: theme.ink, marginBottom: 10 },
  progressTrack: {
    height: 4,
    backgroundColor: theme.paper,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: { height: "100%", backgroundColor: theme.accent },
  routePct: { fontSize: 10, fontWeight: "700", color: theme.muted },
  routeStart: { fontSize: 11, fontWeight: "700", color: theme.accent, marginTop: 4 },
  seeAllBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  seeAllBtnText: { fontSize: 12, fontWeight: "700", color: theme.accent },
  footer: {
    alignItems: "center",
    marginTop: 8,
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: theme.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.border,
  },
  footerHint: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: theme.muted,
    opacity: 0.5,
    marginBottom: 16,
    textAlign: "center",
  },
  footerButton: {
    backgroundColor: theme.ink,
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 18,
  },
  footerButtonText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: theme.white,
  },
});
