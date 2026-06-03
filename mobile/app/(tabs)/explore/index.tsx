import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InlineAdSlot from "@/components/ads/InlineAdSlot";
import MissingMediaRequest from "@/components/MissingMediaRequest";
import HistoryCard from "@/components/HistoryCard";
import MoodIcon from "@/components/MoodIcon";
import { tabBarBottomInset } from "@/constants/layout";
import { type } from "@/constants/typography";
import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { mediaTypeIconName } from "@/utils/mediaTypeIcon";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { useNavigationTab } from "@/context/NavigationContext";
import { useInProgressIds } from "@/hooks/useInProgressIds";
import { getCards } from "@shared/content";
import { sortCardsByReadState } from "@shared/cardSort";
import { getStrongDossiers } from "@shared/dossier";
import { EXPLORE_INLINE_AD_AFTER_INDEX } from "@/constants/ads";
import { EXPLORE_CATALOG_PREVIEW, getExploreSearchSuggestions, getStartHereCards } from "@shared/exploreCurated";
import { countUnreadCards, filterCards } from "@shared/explore";
import { sortDossiersByReadState, isDossierComplete } from "@shared/dossierSort";
import { getDossierReadProgress } from "@shared/homeProgress";
import {
  formatExploreDossierMeta,
  formatDossierCollectionProgress,
  formatDossierRemainingLabel,
} from "@/utils/formatDossierMeta";
import { flattenStyle } from "@/utils/flattenStyle";
import { usePrimaryTabFocus } from "@/hooks/usePrimaryTabFocus";
import { useOpenCard } from "@/hooks/useOpenCard";
import type { AccuracyType, MediaType } from "../../../types/index";

const MEDIA: Array<MediaType | "all"> = ["all", "game", "film", "series", "book"];

function formatResultsSummary(
  dictionary: Record<string, any>,
  total: number,
  unread: number
): string {
  const ex = dictionary.explore ?? {};
  const template =
    ex.resultsSummary ?? "{{total}} results · {{unread}} unread";
  return template.replace("{{total}}", String(total)).replace("{{unread}}", String(unread));
}

function buildMoods(locale: string, dictionary: Record<string, any>, allCards: ReturnType<typeof getCards>) {
  const labels = dictionary.common.moodLabels;
  const all = [
    { id: "war", label: labels.war, tag: locale === "tr" ? "savas" : "war" },
    { id: "myth", label: labels.myth, tag: locale === "tr" ? "mitoloji" : "myth" },
    { id: "samurai", label: labels.samurai, tag: locale === "tr" ? "samuray" : "samurai" },
    { id: "crime", label: labels.crime, tag: locale === "tr" ? "su" : "crime" },
    { id: "cold-war", label: labels["cold-war"], tag: locale === "tr" ? "soguk-savas" : "cold-war" },
    { id: "ancient-world", label: labels["ancient-world"], tag: locale === "tr" ? "antik-dnya" : "ancient-world" },
    { id: "empires", label: labels.empires, tag: locale === "tr" ? "imparatorluklar" : "empires" },
    { id: "propaganda", label: labels.propaganda, tag: locale === "tr" ? "propaganda" : "propaganda" },
    { id: "daily-life", label: labels["daily-life"], tag: locale === "tr" ? "gnlk-hayat" : "daily-life" },
    { id: "science-tech", label: labels["science-tech"], tag: locale === "tr" ? "bilim" : "science" },
  ];
  if (locale === "tr") return all;
  return all.filter((m) => allCards.some((c) => c.tags?.includes(m.tag)));
}

export default function ExploreScreen() {
  usePrimaryTabFocus("explore");
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, dictionary } = useLocale();
  const { readIds, recentIds } = useHistory();
  const { getExploreScrollOffset, setExploreScrollOffset, registerTabScrollToTop } =
    useNavigationTab();
  const openCard = useOpenCard();
  const exploreReturn = { kind: "tab" as const, tab: "explore" as const };
  const flatListRef = useRef<FlatList>(null);
  const scrollOffsetRef = useRef(0);
  const allCards = getCards(locale);
  const strongDossiers = useMemo(() => getStrongDossiers(allCards), [allCards]);
  const sortedDossiers = useMemo(
    () => sortDossiersByReadState(strongDossiers, readIds),
    [strongDossiers, readIds]
  );
  const startHereCards = useMemo(() => getStartHereCards(allCards, 6), [allCards]);
  const MOODS = useMemo(() => buildMoods(locale, dictionary, allCards), [locale, dictionary, allCards]);
  const accuracyTypes = useMemo<Array<{ label: string; value: AccuracyType | "all" }>>(
    () => [
      { label: dictionary.common.accuracyFilterLabels.all, value: "all" },
      { label: dictionary.card.highAccuracy, value: "real" },
      { label: dictionary.card.medAccuracy, value: "partly-real" },
      { label: dictionary.common.accuracyFilterLabels.inspired, value: "inspired-by-reality" },
      { label: dictionary.common.accuracyFilterLabels.fictionalized, value: "fictionalized" },
    ],
    [dictionary]
  );

  const [query, setQuery] = useState("");
  const [media, setMedia] = useState<MediaType | "all">("all");
  const [accuracy, setAccuracy] = useState<AccuracyType | "all">("all");
  const [onlyFlagships, setOnlyFlagships] = useState(false);
  const [spoilerFree, setSpoilerFree] = useState(false);
  const [tag, setTag] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAllCatalog, setShowAllCatalog] = useState(false);
  const bottomPad = tabBarBottomInset(insets.bottom) + 16;
  const ex = dictionary.explore ?? {};

  const filtered = useMemo(
    () => filterCards(allCards, { query, media, accuracy, tag, onlyFlagships, spoilerFree }),
    [allCards, query, media, accuracy, tag, onlyFlagships, spoilerFree]
  );

  const unreadCount = useMemo(() => countUnreadCards(filtered, readIds), [filtered, readIds]);
  const searchSuggestions = useMemo(() => getExploreSearchSuggestions(locale), [locale]);

  useFocusEffect(
    useCallback(() => {
      const offset = getExploreScrollOffset();
      if (offset > 0) {
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToOffset({ offset, animated: false });
          scrollOffsetRef.current = offset;
        });
      }
      return () => {
        setExploreScrollOffset(scrollOffsetRef.current);
      };
    }, [getExploreScrollOffset, setExploreScrollOffset])
  );

  useEffect(() => {
    return registerTabScrollToTop("explore", () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      scrollOffsetRef.current = 0;
      setExploreScrollOffset(0);
    });
  }, [registerTabScrollToTop, setExploreScrollOffset]);

  const handleScroll = useCallback((offsetY: number) => {
    scrollOffsetRef.current = offsetY;
  }, []);

  const activeMood = MOODS.find((m) => m.tag === tag);
  const activeFilterCount = [
    media !== "all",
    accuracy !== "all",
    onlyFlagships,
    spoilerFree,
    tag !== null,
  ].filter(Boolean).length;
  const isAnyFilterActive = activeFilterCount > 0 || query.length > 0;

  const { inProgressIds } = useInProgressIds(recentIds, readIds);

  const sortedStartHere = useMemo(
    () => sortCardsByReadState(startHereCards, readIds, inProgressIds),
    [startHereCards, readIds, inProgressIds]
  );

  const catalogData = useMemo(() => {
    const base = (() => {
      if (isAnyFilterActive) return filtered;
      if (showAllCatalog) return filtered;
      return filtered.slice(0, EXPLORE_CATALOG_PREVIEW);
    })();
    return sortCardsByReadState(base, readIds, inProgressIds);
  }, [filtered, isAnyFilterActive, showAllCatalog, readIds, inProgressIds]);

  const clearAllFilters = () => {
    setQuery("");
    setMedia("all");
    setAccuracy("all");
    setOnlyFlagships(false);
    setSpoilerFree(false);
    setTag(null);
    setShowFilters(false);
    setShowAllCatalog(false);
  };

  const openCardFromExplore = (cardId: string) => {
    openCard(cardId, exploreReturn);
  };

  const ListHeader = useMemo(
    () => (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{dictionary.nav.explore}</Text>
          <Text style={styles.trace}>{dictionary.common.traceHistory}</Text>
        </View>
        <Pressable
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => setShowFilters((v) => !v)}
        >
          <Text style={[styles.filterBtnText, activeFilterCount > 0 && styles.filterBtnTextActive]}>
            {dictionary.common.filter}
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Text>
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={theme.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.search}
          placeholder={dictionary.common.searchPlaceholder}
          placeholderTextColor={theme.muted}
          value={query}
          onChangeText={setQuery}
        />
        {query ? (
          <Pressable onPress={() => setQuery("")} style={styles.searchClear} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={theme.muted} />
          </Pressable>
        ) : null}
      </View>

      <Pressable
        style={[styles.quickChip, spoilerFree && styles.quickChipActive]}
        onPress={() => setSpoilerFree((v) => !v)}
      >
        <Text style={[styles.quickChipText, spoilerFree && styles.quickChipTextActive]}>
          {ex.spoilerFreeFilter ?? dictionary.card.noSpoilers}
        </Text>
      </Pressable>

      {showFilters ? (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>{dictionary.common.contentType}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {MEDIA.map((m) => (
              <Pressable
                key={m}
                style={[styles.chip, media === m && styles.chipActive]}
                onPress={() => setMedia(m)}
              >
                <Text style={[styles.chipText, media === m && styles.chipTextActive]}>
                  {m === "all" ? dictionary.common.mediaFilterLabels.all : m}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={[styles.filterLabel, { marginTop: 4 }]}>{dictionary.card.guessAccuracy}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {accuracyTypes.map((a) => (
              <Pressable
                key={a.value}
                style={[styles.chip, accuracy === a.value && styles.chipActive]}
                onPress={() => setAccuracy(a.value)}
              >
                <Text style={[styles.chipText, accuracy === a.value && styles.chipTextActive]} numberOfLines={1}>
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable style={styles.flagshipRow} onPress={() => setOnlyFlagships((v) => !v)}>
            <Text style={styles.flagshipLabel}>{dictionary.common.onlyFlagship}</Text>
            <View style={[styles.toggle, onlyFlagships && styles.toggleOn]}>
              <View style={[styles.knob, onlyFlagships && styles.knobOn]} />
            </View>
          </Pressable>
        </View>
      ) : null}

      {isAnyFilterActive ? (
        <>
          <View style={styles.activeBar}>
            <Text style={styles.resultsInline}>{formatResultsSummary(dictionary, filtered.length, unreadCount)}</Text>
            <Pressable onPress={clearAllFilters} hitSlop={8}>
              <Text style={styles.clearAll}>{dictionary.common.clearFilter}</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeFilterRow}>
            {media !== "all" ? (
              <Pressable style={styles.activeFilterChip} onPress={() => setMedia("all")}>
                <Text style={styles.activeFilterChipText}>
                  {dictionary.common.mediaFilterLabels[media as keyof typeof dictionary.common.mediaFilterLabels] ??
                    media}
                </Text>
                <Ionicons name="close" size={12} color={theme.white} />
              </Pressable>
            ) : null}
            {accuracy !== "all" ? (
              <Pressable style={styles.activeFilterChip} onPress={() => setAccuracy("all")}>
                <Text style={styles.activeFilterChipText}>
                  {accuracyTypes.find((a) => a.value === accuracy)?.label ?? accuracy}
                </Text>
                <Ionicons name="close" size={12} color={theme.white} />
              </Pressable>
            ) : null}
            {spoilerFree ? (
              <Pressable style={styles.activeFilterChip} onPress={() => setSpoilerFree(false)}>
                <Text style={styles.activeFilterChipText}>
                  {ex.spoilerFreeFilter ?? dictionary.card.noSpoilers}
                </Text>
                <Ionicons name="close" size={12} color={theme.white} />
              </Pressable>
            ) : null}
            {onlyFlagships ? (
              <Pressable style={styles.activeFilterChip} onPress={() => setOnlyFlagships(false)}>
                <Text style={styles.activeFilterChipText}>{dictionary.common.onlyFlagship}</Text>
                <Ionicons name="close" size={12} color={theme.white} />
              </Pressable>
            ) : null}
            {tag ? (
              <Pressable style={styles.activeFilterChip} onPress={() => setTag(null)}>
                <Text style={styles.activeFilterChipText}>{MOODS.find((m) => m.tag === tag)?.label ?? tag}</Text>
                <Ionicons name="close" size={12} color={theme.white} />
              </Pressable>
            ) : null}
          </ScrollView>
        </>
      ) : null}

      {activeMood ? (
        <View style={styles.activeChipRow}>
          <View style={styles.activeChip}>
            <View style={styles.activeChipInner}>
              <MoodIcon moodId={activeMood.id} active inverted />
              <Text style={styles.activeChipText}>{activeMood.label}</Text>
            </View>
            <Pressable onPress={() => setTag(null)} hitSlop={8}>
              <Ionicons name="close" size={14} color={theme.white} />
            </Pressable>
          </View>
        </View>
      ) : null}

      {!isAnyFilterActive ? (
        <View style={surfaces.band}>
          <Text style={styles.sectionLabel}>{ex.startHere ?? "Start here"}</Text>
          <Text style={styles.sectionHint}>{ex.startHereHint}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.startHereRow}>
            {sortedStartHere.map((card) => (
                <Pressable
                  key={card.id}
                  style={flattenStyle([
                    styles.startHereCard,
                    readIds.includes(card.id) ? styles.startHereCardRead : null,
                  ])}
                  onPress={() => openCardFromExplore(card.id)}
                >
                  <View style={styles.startHereMediaRow}>
                    <Ionicons name={mediaTypeIconName(card.mediaType)} size={12} color={theme.accent} />
                    <Text style={styles.startHereMedia} numberOfLines={1}>
                      {card.mediaTitle}
                    </Text>
                  </View>
                  <Text style={styles.startHereTitle} numberOfLines={2}>
                    {card.title}
                  </Text>
                  <Text style={styles.startHereMeta}>
                    {card.readingTimeMinutes} {dictionary.common.minutesShort ?? dictionary.common.minutes}
                  </Text>
                </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      <Text style={styles.sectionLabel}>{dictionary.common.chooseMood}</Text>
      {!isAnyFilterActive ? (
        <View style={styles.moodGrid}>
          {MOODS.map((m) => (
            <Pressable
              key={m.id}
              style={[styles.moodBtn, tag === m.tag && styles.moodBtnActive]}
              onPress={() => setTag(tag === m.tag ? null : m.tag)}
            >
              <View style={styles.moodIconWrap}>
                <MoodIcon moodId={m.id} active={tag === m.tag} />
              </View>
              <Text style={styles.moodLabel}>{m.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {!isAnyFilterActive ? (
        <>
          <Text style={styles.sectionLabel}>{dictionary.common.featuredDossiers}</Text>
          <Text style={styles.sectionHint}>{ex.dossiersExplainer}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dossierRow}>
            {sortedDossiers.slice(0, 6).map((d) => {
              const { done, left, total } = getDossierReadProgress(d, readIds);
              const complete = isDossierComplete(d, readIds);
              const collection = formatDossierCollectionProgress(dictionary, done, total);
              const remaining =
                done > 0 && left > 0
                  ? formatDossierRemainingLabel(dictionary, left, d.cardIds.length)
                  : null;
              return (
              <Pressable
                key={d.slug}
                style={[styles.dossierCard, complete && styles.dossierCardComplete]}
                onPress={() => router.push(`/explore/media/${d.slug}` as any)}
              >
                <Text style={[styles.dossierTitle, complete && styles.dossierTitleComplete]} numberOfLines={2}>
                  {d.title}
                </Text>
                <Text style={styles.dossierCollection}>{collection}</Text>
                <Text style={styles.dossierMeta}>{formatExploreDossierMeta(d, dictionary, locale)}</Text>
                {remaining ? <Text style={styles.dossierRemaining}>{remaining}</Text> : null}
                <Ionicons name="chevron-forward" size={14} color={theme.accent} style={styles.dossierChevron} />
              </Pressable>
            );
            })}
          </ScrollView>
        </>
      ) : null}

      {!isAnyFilterActive ? (
        <>
          <Text style={styles.sectionLabel}>{ex.catalogSection ?? dictionary.nav.explore}</Text>
          <Text style={styles.sectionHint}>{dictionary.common.productCardsHint}</Text>
          <Text style={styles.results}>
            {formatResultsSummary(dictionary, filtered.length, unreadCount)}
          </Text>
        </>
      ) : null}
    </>
    ),
    [
      dictionary,
      ex,
      activeFilterCount,
      showFilters,
      query,
      spoilerFree,
      media,
      accuracy,
      onlyFlagships,
      isAnyFilterActive,
      activeMood,
      sortedStartHere,
      readIds,
      MOODS,
      tag,
      sortedDossiers,
      locale,
      filtered.length,
      unreadCount,
      accuracyTypes,
    ]
  );

  const showAllLabel = (ex.showAllCards ?? "Show all {{count}} cards").replace(
    "{{count}}",
    String(filtered.length)
  );

  const applySuggestion = (suggestion: ReturnType<typeof getExploreSearchSuggestions>[number]) => {
    if (suggestion.query) {
      setQuery(suggestion.query);
      setTag(null);
    } else if (suggestion.tag) {
      setTag(suggestion.tag);
      setQuery("");
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <FlatList
        ref={flatListRef}
        data={catalogData}
        keyExtractor={(item) => item.id}
        onScroll={(e) => handleScroll(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={ListHeader}
        renderItem={({ item, index }) => (
          <>
            {!isAnyFilterActive && index === EXPLORE_INLINE_AD_AFTER_INDEX ? (
              <InlineAdSlot />
            ) : null}
            <HistoryCard
              card={item}
              isRead={readIds.includes(item.id)}
              showPreview
              returnTo={exploreReturn}
            />
          </>
        )}
        ListFooterComponent={
          !isAnyFilterActive ? (
            <>
              {!showAllCatalog && filtered.length > EXPLORE_CATALOG_PREVIEW ? (
                <Pressable style={styles.showAllBtn} onPress={() => setShowAllCatalog(true)}>
                  <Text style={styles.showAllBtnText}>{showAllLabel}</Text>
                </Pressable>
              ) : null}
              <MissingMediaRequest />
            </>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.empty}>{dictionary.common.noResults}</Text>
            {isAnyFilterActive ? (
              <>
                <Text style={styles.emptyHint}>{ex.emptySearchTitle}</Text>
                <View style={styles.suggestionRow}>
                  {searchSuggestions.map((s) => (
                    <Pressable
                      key={s.label}
                      style={styles.suggestionChip}
                      onPress={() => applySuggestion(s)}
                    >
                      <Text style={styles.suggestionChipText}>{s.label}</Text>
                    </Pressable>
                  ))}
                </View>
                <Pressable style={styles.emptyBtn} onPress={clearAllFilters}>
                  <Text style={styles.emptyBtnText}>{dictionary.common.clearFilter}</Text>
                </Pressable>
              </>
            ) : null}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  list: { paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  localeNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: theme.accentSoft,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  localeNoteText: { flex: 1, fontSize: 12, lineHeight: 18, color: theme.ink },
  title: { ...type.screenTitle },
  trace: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, color: theme.muted, marginTop: 4 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...surfaces.inset,
    borderRadius: 12,
  },
  filterBtnActive: { backgroundColor: theme.accentSoft, borderColor: theme.accent },
  filterBtnText: { fontSize: 10, fontWeight: "800", color: theme.ink },
  filterBtnTextActive: { color: theme.accent },
  searchWrap: { position: "relative", marginBottom: 12 },
  searchIcon: { position: "absolute", left: 16, top: 16, zIndex: 1 },
  search: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingLeft: 44,
    paddingRight: 44,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: theme.borderStrong,
    fontSize: 15,
    color: theme.ink,
  },
  searchClear: { position: "absolute", right: 14, top: 14 },
  quickChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 12,
  },
  quickChipActive: { backgroundColor: theme.accentSoft, borderColor: theme.accent },
  quickChipText: { fontSize: 10, fontWeight: "800", color: theme.muted, letterSpacing: 0.5 },
  quickChipTextActive: { color: theme.accent },
  filterPanel: {
    ...surfaces.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  filterLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, color: theme.muted, marginBottom: 10 },
  chipRow: { marginBottom: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: theme.paper,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  chipActive: { backgroundColor: theme.ink, borderColor: theme.ink },
  chipText: { fontSize: 10, fontWeight: "800", color: theme.muted, textTransform: "uppercase" },
  chipTextActive: { color: theme.white },
  flagshipRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 8 },
  flagshipLabel: { fontSize: 11, fontWeight: "700", color: theme.ink },
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: theme.paper, padding: 2 },
  toggleOn: { backgroundColor: theme.accent },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: theme.white },
  knobOn: { alignSelf: "flex-end" },
  activeBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  resultsInline: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, color: theme.muted },
  clearAll: { fontSize: 10, fontWeight: "800", letterSpacing: 1, color: theme.accent, textTransform: "uppercase" },
  activeChipRow: { flexDirection: "row", marginBottom: 12 },
  activeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.ink,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  activeChipInner: { flexDirection: "row", alignItems: "center", gap: 6 },
  activeChipText: { fontSize: 10, fontWeight: "800", color: theme.white, letterSpacing: 0.5 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: theme.muted,
    marginBottom: 6,
    marginTop: 10,
  },
  sectionHint: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.muted,
    marginBottom: 12,
    maxWidth: 340,
  },
  startHereRow: { marginBottom: 16 },
  startHereCard: {
    width: 168,
    padding: 14,
    marginRight: 10,
    ...surfaces.card,
    borderRadius: 16,
  },
  startHereCardRead: { opacity: 0.55 },
  startHereMediaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  startHereMedia: {
    flex: 1,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    color: theme.accent,
    textTransform: "uppercase",
  },
  startHereTitle: { ...type.cardTitle, fontSize: 15, lineHeight: 20, marginBottom: 8 },
  startHereMeta: { fontSize: 10, fontWeight: "700", color: theme.muted },
  activeFilterRow: { marginBottom: 12, flexGrow: 0 },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.ink,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  activeFilterChipText: { fontSize: 10, fontWeight: "700", color: theme.white },
  showAllBtn: {
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: theme.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  showAllBtnText: { fontSize: 12, fontWeight: "700", color: theme.accent },
  moodGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  moodBtn: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    minHeight: 44,
    backgroundColor: theme.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  moodBtnActive: { borderColor: theme.accent, backgroundColor: theme.accentSoft },
  moodIconWrap: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
  moodLabel: { fontSize: 10, fontWeight: "800", color: theme.ink, flex: 1 },
  dossierRow: { marginBottom: 20 },
  dossierCardComplete: { opacity: 0.52 },
  dossierTitleComplete: { color: theme.muted },
  dossierCollection: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: theme.ink,
    marginBottom: 4,
  },
  dossierCard: {
    width: 160,
    padding: 16,
    marginRight: 12,
    ...surfaces.card,
    ...surfaces.cardAccent,
    borderRadius: 16,
  },
  dossierTitle: { fontSize: 14, fontWeight: "600", color: theme.ink, marginBottom: 8, minHeight: 40 },
  dossierMeta: { fontSize: 10, fontWeight: "700", color: theme.accent },
  dossierRemaining: { fontSize: 9, fontWeight: "800", color: theme.muted, marginTop: 6, letterSpacing: 0.5 },
  dossierChevron: { position: "absolute", right: 12, top: 14 },
  results: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: theme.muted,
    marginBottom: 12,
    marginTop: 4,
  },
  emptyWrap: { alignItems: "center", paddingTop: 40, gap: 16 },
  empty: { textAlign: "center", color: theme.muted },
  emptyHint: { fontSize: 13, color: theme.muted, textAlign: "center", maxWidth: 280 },
  suggestionRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.border,
  },
  suggestionChipText: { fontSize: 11, fontWeight: "700", color: theme.ink },
  emptyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.ink,
    borderRadius: 12,
  },
  emptyBtnText: { color: theme.white, fontSize: 10, fontWeight: "800", letterSpacing: 1 },
});
