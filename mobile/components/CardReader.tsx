import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import RelatedTopicCards from "@/components/RelatedTopicCards";
import CardReaderTopBar from "@/components/CardReaderTopBar";
import GuidedJourneyReader from "@/components/GuidedJourneyReader";
import ReadReflection from "@/components/ReadReflection";
import ReaderCompletionPanel from "@/components/ReaderCompletionPanel";
import { cachedImageProps } from "@/constants/image";
import { screenBottomInset } from "@/constants/layout";
import { type } from "@/constants/typography";
import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLearning } from "@/context/LearningContext";
import { useLocale } from "@/context/LocaleContext";
import { formatMediaType } from "@shared/contentBlocks";
import { getSmartRelatedCards } from "@shared/relatedCards";
import { liteRealitySummary, parseRealHistorySections } from "@/utils/liteReaderContent";
import { openExternalUrl } from "@/utils/openExternalUrl";
import { needsSpoilerGate, spoilerGateDescription, spoilerGateTitle } from "@shared/spoiler";
import type { HistoryCard } from "../../types/index";

export default function CardReader({ card, allCards }: { card: HistoryCard; allCards: HistoryCard[] }) {
  const insets = useSafeAreaInsets();
  const bottomPad = screenBottomInset(insets.bottom, { includeTabBar: false });
  const { dictionary } = useLocale();
  const { addRecent, markAsRead, isRead, readIds } = useHistory();
  const { getReflections, toggleReflection } = useLearning();
  const [reveal, setReveal] = useState(false);
  const [savedProgress, setSavedProgress] = useState(0);
  const [heroFailed, setHeroFailed] = useState(false);

  const similar = useMemo(
    () => getSmartRelatedCards(card, allCards, readIds, 3),
    [allCards, card, readIds]
  );

  useEffect(() => {
    addRecent(card.id);
    setReveal(!needsSpoilerGate(card));
    setHeroFailed(false);

    AsyncStorage.getItem(`progress_${card.id}`).then((raw) => {
      if (raw) {
        const n = parseInt(raw, 10);
        if (!isNaN(n)) setSavedProgress(n);
      }
    });
  }, [card, addRecent]);

  const hero = card.images?.hero;
  const read = isRead(card.id);
  const realitySummary = liteRealitySummary(card);
  const historySections = useMemo(() => parseRealHistorySections(card.realHistory), [card.realHistory]);
  const showSpoilerGate = needsSpoilerGate(card) && !reveal;

  if (showSpoilerGate) {
    const spoilerLevelLabel = spoilerGateTitle(card, dictionary);
    const spoilerAccent =
      card.spoilerLevel === "major" ? theme.spoilerMajor : theme.spoilerMinor;
    const spoilerSoft =
      card.spoilerLevel === "major" ? "rgba(239,68,68,0.12)" : theme.spoilerMinorSoft;

    const journeySteps = card.isFlagship
      ? [
          dictionary.common.accuracyGuessTitle,
          dictionary.common.vsReality,
          dictionary.card.realHistory,
          dictionary.card.whyItMatters,
        ]
      : [];

    const gateBtnLabel = read
      ? dictionary.common.reOpen
      : savedProgress > 0
        ? dictionary.common.continueAction
        : card.isFlagship
          ? dictionary.common.startJourney
          : dictionary.common.viewContent;

    return (
      <View style={styles.root}>
        <CardReaderTopBar
          cardId={card.id}
          cardTitle={card.title}
          readerStep={savedProgress > 0 ? 1 : 0}
        />
        <ScrollView
          style={styles.gateScroll}
          contentContainerStyle={[styles.gateScrollContent, { paddingBottom: bottomPad }]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          {hero && !heroFailed ? (
            <View style={styles.gateHeroWrap}>
              <Image
                source={{ uri: hero.src }}
                style={styles.gateHeroImg}
                contentFit="cover"
                onError={() => setHeroFailed(true)}
                {...cachedImageProps}
              />
            </View>
          ) : null}

          <Text style={styles.gateMedia}>
            {formatMediaType(card.mediaType, dictionary)} • {card.mediaTitle}
          </Text>
          <Text style={styles.gateCardTitle}>{card.title}</Text>
          {card.subtitle ? (
            <Text style={styles.gateSubtitle} numberOfLines={3}>
              {card.subtitle}
            </Text>
          ) : null}

          <View style={[styles.gateWarning, { borderLeftColor: spoilerAccent, backgroundColor: spoilerSoft }]}>
            <View style={styles.gateWarningRow}>
              <View style={styles.gateIconWrap}>
                <Text style={styles.gateIcon}>⚠</Text>
              </View>
              <View style={styles.gateWarningHead}>
                <Text style={styles.gateTitle}>{spoilerLevelLabel}</Text>
              </View>
            </View>
            <Text style={styles.gateDesc}>{spoilerGateDescription(card, dictionary)}</Text>
          </View>

          {journeySteps.length > 0 ? (
            <View style={styles.gatePreview}>
              <Text style={styles.gatePreviewLabel}>{dictionary.card.spoilerGateIncludes}</Text>
              {journeySteps.map((step) => (
                <View key={step} style={styles.gatePreviewRow}>
                  <View style={styles.gatePreviewDot} />
                  <Text style={styles.gatePreviewStep}>{step}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {card.themes?.length ? (
            <View style={styles.gateTags}>
              {card.themes.slice(0, 3).map((t) => (
                <Text key={t} style={styles.gateTag}>
                  {t}
                </Text>
              ))}
            </View>
          ) : null}

          <Text style={styles.gateMeta}>
            {card.isFlagship ? `${dictionary.common.flagship} · ` : ""}
            {blocksHint(card, dictionary)}
          </Text>

          <Pressable
            style={styles.gateBtn}
            onPress={() => setReveal(true)}
            accessibilityRole="button"
            accessibilityLabel={gateBtnLabel}
          >
            <Text style={styles.gateBtnText}>{gateBtnLabel}</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  if (card.isFlagship) {
    return (
      <GuidedJourneyReader
        card={card}
        allCards={allCards}
        similarCards={similar}
        onComplete={() => markAsRead(card.id)}
      />
    );
  }

  return (
    <View style={styles.root}>
      <CardReaderTopBar
        cardId={card.id}
        cardTitle={card.title}
        readerStep={savedProgress > 0 ? 1 : 0}
      />
      <ScrollView
        style={styles.lite}
        contentContainerStyle={[styles.liteContent, { paddingBottom: bottomPad }]}
        contentInsetAdjustmentBehavior="automatic"
      >
        {hero && !heroFailed ? (
          <View style={styles.heroWrap}>
            <Image
              source={{ uri: hero.src }}
              style={styles.heroImg}
              contentFit="cover"
              onError={() => setHeroFailed(true)}
              {...cachedImageProps}
            />
          </View>
        ) : null}
        <Text style={styles.media}>{formatMediaType(card.mediaType, dictionary)} • {card.mediaTitle}</Text>
        <Text style={styles.title}>{card.title}</Text>

        {realitySummary ? (
          <View style={styles.block}>
            <Text style={styles.label}>{dictionary.common.realitySummary}</Text>
            <Text style={styles.body}>{realitySummary}</Text>
          </View>
        ) : null}

        {card.mediaChanged ? (
          <View style={styles.block}>
            <Text style={styles.label}>{dictionary.common.vsReality}</Text>
            <Text style={[styles.body, styles.italic]}>{card.mediaChanged}</Text>
          </View>
        ) : null}

        {historySections.length > 0 ? (
          <View style={styles.block}>
            <Text style={styles.label}>{dictionary.card.realHistory}</Text>
            {historySections.map((section, i) => {
              if (section.kind === "heading") {
                return (
                  <Text key={i} style={styles.historyHeading}>
                    {section.text}
                  </Text>
                );
              }
              if (section.kind === "list") {
                return (
                  <View key={i} style={styles.listBlock}>
                    {section.items.map((item, j) => (
                      <Text key={j} style={styles.listItem}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                );
              }
              return (
                <Text key={i} style={styles.serif}>
                  {section.text}
                </Text>
              );
            })}
          </View>
        ) : null}

        {card.sources?.map((s, i) => (
          <Pressable key={i} onPress={() => openExternalUrl(s.url)} style={styles.source}>
            <Text style={styles.sourceText}>↗ {s.title}</Text>
          </Pressable>
        ))}

        <View style={styles.block}>
          <Text style={styles.label}>{dictionary.common.feelQuestion}</Text>
          <ReadReflection
            cardId={card.id}
            selectedReflections={getReflections(card.id)}
            onToggle={(r) => toggleReflection(card.id, r)}
          />
        </View>

        {read ? (
          <View style={styles.doneBox}>
            <Text style={styles.doneTitle}>{dictionary.common.explorationComplete}</Text>
            <RelatedTopicCards card={card} allCards={allCards} />
            <ReaderCompletionPanel variant="complete" />
          </View>
        ) : (
          <ReaderCompletionPanel variant="markRead" onMarkRead={() => markAsRead(card.id)} />
        )}
      </ScrollView>
    </View>
  );
}

function blocksHint(card: HistoryCard, dictionary: { common: { minutesShort?: string; minutes: string; readTime: string } }) {
  const unit = dictionary.common.minutesShort ?? dictionary.common.minutes;
  return `${card.readingTimeMinutes} ${unit} · ${dictionary.common.readTime}`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  gateScroll: { flex: 1 },
  gateScrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  gateHeroWrap: {
    height: 176,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: theme.paper,
  },
  gateHeroImg: { width: "100%", height: "100%" },
  gateMedia: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: theme.accent,
    marginBottom: 10,
  },
  gateCardTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: theme.ink,
    lineHeight: 32,
    marginBottom: 10,
  },
  gateSubtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: theme.muted,
    marginBottom: 18,
  },
  gateWarning: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.border,
    borderLeftWidth: 4,
  },
  gateWarningRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 10 },
  gateIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
  },
  gateIcon: { fontSize: 20 },
  gateWarningHead: { flex: 1, paddingTop: 2 },
  gateTitle: { fontSize: 13, fontWeight: "700", color: "#b45309" },
  gateDesc: { fontSize: 14, lineHeight: 22, color: theme.muted },
  gatePreview: {
    backgroundColor: theme.paper,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },
  gatePreviewLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: theme.muted,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  gatePreviewRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  gatePreviewDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.accent },
  gatePreviewStep: { flex: 1, fontSize: 14, lineHeight: 20, color: theme.ink, fontWeight: "500" },
  gateTags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  gateTag: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    color: theme.muted,
    backgroundColor: theme.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  gateMeta: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.accent,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  gateBtn: {
    backgroundColor: theme.ink,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  gateBtnText: { color: theme.white, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  lite: { flex: 1 },
  liteContent: { padding: 20 },
  heroWrap: { height: 200, borderRadius: 20, overflow: "hidden", marginBottom: 16 },
  heroImg: { width: "100%", height: "100%" },
  media: { fontSize: 9, fontWeight: "800", letterSpacing: 1.5, color: theme.accent, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "600", color: theme.ink, marginBottom: 20, lineHeight: 34 },
  block: {
    backgroundColor: theme.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },
  label: { ...type.label, marginBottom: 10 },
  body: { fontSize: 15, lineHeight: 24, color: theme.ink },
  serif: { fontSize: 17, lineHeight: 28, color: theme.ink, marginBottom: 12 },
  historyHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.ink,
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.accent,
  },
  listBlock: { marginBottom: 12, paddingLeft: 4 },
  listItem: { fontSize: 15, lineHeight: 24, color: theme.ink, marginBottom: 6 },
  italic: { fontStyle: "italic", color: theme.muted },
  source: { paddingVertical: 10 },
  sourceText: { color: theme.accent, fontSize: 14 },
  doneBox: {
    marginTop: 16,
    backgroundColor: theme.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  doneTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.ink,
    textAlign: "center",
    marginBottom: 4,
  },
});
