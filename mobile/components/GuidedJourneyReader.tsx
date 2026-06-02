import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import RelatedTopicCards from "@/components/RelatedTopicCards";
import CardReaderTopBar from "@/components/CardReaderTopBar";
import HistoryCard from "@/components/HistoryCard";
import ReadReflection from "@/components/ReadReflection";
import ReaderCompletionPanel from "@/components/ReaderCompletionPanel";
import { readerControlsBottom, screenBottomInset } from "@/constants/layout";
import { theme } from "@/constants/theme";
import { hapticSelection } from "@/utils/haptics";
import { openExternalUrl } from "@/utils/openExternalUrl";
import { useLearning } from "@/context/LearningContext";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import {
  ContentBlock,
  deriveCardBlocks,
  formatAccuracyLabel,
  formatMediaType,
} from "@shared/contentBlocks";
import { estimateReadingMinutesLeft } from "@shared/readerProgress";
import type { AccuracyType, HistoryCard as Card, Source } from "../../types/index";

export default function GuidedJourneyReader({
  card,
  allCards,
  similarCards,
  onComplete,
}: {
  card: Card;
  allCards: Card[];
  similarCards: Card[];
  onComplete: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { dictionary } = useLocale();
  const { readIds } = useHistory();
  const { getGuess, setGuess, getReflections, toggleReflection } = useLearning();
  const blocks = useMemo(() => deriveCardBlocks(card, dictionary), [card, dictionary]);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const completeScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setStep(0);
    setDone(false);

    AsyncStorage.getItem(`progress_${card.id}`).then((raw) => {
      if (!raw) return;
      const n = parseInt(raw, 10);
      if (!isNaN(n) && n >= 0 && n < blocks.length) setStep(n);
    });
  }, [card.id, blocks.length]);

  useEffect(() => {
    if (done || blocks.length === 0) return;
    if (step >= blocks.length) {
      setStep(Math.max(0, blocks.length - 1));
      return;
    }
    AsyncStorage.setItem(`progress_${card.id}`, String(step));
  }, [card.id, step, done, blocks.length]);

  useEffect(() => {
    if (!done) return;
    completeScrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [done]);

  if (blocks.length === 0) {
    return (
      <View style={styles.root}>
        <CardReaderTopBar cardId={card.id} cardTitle={card.title} />
        <View style={[styles.complete, { paddingBottom: screenBottomInset(insets.bottom, { includeTabBar: false }) }]}>
          <Text style={styles.completeTitle}>{dictionary.common.error}</Text>
          <ReaderCompletionPanel variant="complete" />
        </View>
      </View>
    );
  }

  const safeStep = Math.min(Math.max(step, 0), blocks.length - 1);
  const block = blocks[safeStep];
  const isLast = safeStep === blocks.length - 1;
  const pct = Math.round(((safeStep + 1) / blocks.length) * 100);
  const minutesLeft = estimateReadingMinutesLeft(card, safeStep, blocks.length);
  const guessRequired = block?.type === "accuracyGuess" && !getGuess(card.id);

  const next = () => {
    if (safeStep < blocks.length - 1) setStep((s) => Math.min(s + 1, blocks.length - 1));
    else {
      setDone(true);
      onComplete();
      AsyncStorage.removeItem(`progress_${card.id}`);
    }
  };

  const controlsBottom = readerControlsBottom(insets.bottom);
  const contentBottom = screenBottomInset(insets.bottom, { includeTabBar: false });

  if (done) {
    return (
      <View style={styles.root}>
        <CardReaderTopBar cardId={card.id} cardTitle={card.title} />
        <ScrollView
          ref={completeScrollRef}
          style={styles.completeScroll}
          contentContainerStyle={[styles.completeContent, { paddingBottom: contentBottom }]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
          <Text style={styles.completeTitle}>{dictionary.common.explorationComplete}</Text>
          <Text style={styles.completeDesc}>{dictionary.common.readerMarkCompleteHint}</Text>
          <RelatedTopicCards card={card} allCards={allCards} />
          <ReaderCompletionPanel variant="complete" />
        </ScrollView>
      </View>
    );
  }

  const progressCenter = (
    <View style={styles.progressArea}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
      <View style={styles.progressMeta}>
        <Text style={styles.progressLabel}>
          {safeStep + 1}/{blocks.length}
        </Text>
        {minutesLeft > 0 ? (
          <Text style={styles.progressMinutes}>
            {(dictionary.common.minutesLeft ?? "~{{count}} min left").replace(
              "{{count}}",
              String(minutesLeft)
            )}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <CardReaderTopBar
        cardId={card.id}
        cardTitle={card.title}
        center={progressCenter}
        readerStep={step}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 16, paddingBottom: controlsBottom + 76 }]}
        keyboardShouldPersistTaps="handled"
      >
        <BlockView block={block} card={card} similarCards={similarCards} readIds={readIds} />
      </ScrollView>

      <View style={[styles.nav, { bottom: controlsBottom, paddingBottom: 8 }]}>
        {safeStep > 0 ? (
          <Pressable
            style={styles.backBtn}
            onPress={() => setStep((s) => Math.max(0, s - 1))}
            accessibilityRole="button"
            accessibilityLabel={dictionary.common.back}
          >
            <Ionicons name="chevron-back" size={24} color={theme.ink} />
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
        <Pressable
          style={[styles.nextBtn, guessRequired && styles.nextDisabled, isLast && styles.nextComplete]}
          onPress={next}
          disabled={guessRequired}
          accessibilityRole="button"
          accessibilityLabel={isLast ? dictionary.common.completeJourney : dictionary.common.continue}
        >
          <Text style={styles.nextText}>
            {isLast ? dictionary.common.completeJourney : dictionary.common.continue}
          </Text>
          {!isLast ? <Ionicons name="chevron-forward" size={18} color={theme.white} /> : null}
        </Pressable>
      </View>
    </View>
  );
}

function BlockView({
  block,
  card,
  similarCards,
  readIds,
}: {
  block: ContentBlock;
  card: Card;
  similarCards: Card[];
  readIds: string[];
}) {
  const { dictionary } = useLocale();
  const { getGuess, setGuess, getReflections, toggleReflection } = useLearning();

  switch (block.type) {
    case "hook":
      return (
        <View style={styles.blockGap}>
          <Text style={styles.mediaTag}>
            {formatMediaType(block.metadata?.mediaType as any, dictionary)} • {String(block.metadata?.mediaTitle)}
          </Text>
          <Text style={styles.hookTitle}>{block.title}</Text>
          {block.metadata?.subtitle ? (
            <Text style={styles.hookSubtitle}>{String(block.metadata.subtitle)}</Text>
          ) : null}
          <View style={styles.hookBox}>
            <Text style={styles.hookBoxLabel}>{dictionary.common.startingNote}</Text>
            <Text style={styles.hookBoxText}>{String(block.content)}</Text>
          </View>
        </View>
      );

    case "shortContext":
      return (
        <View style={styles.paperBlock}>
          <Text style={styles.blockLabel}>{block.title || dictionary.common.quickContext}</Text>
          <Text style={styles.serifBody}>{String(block.content)}</Text>
        </View>
      );

    case "accuracyGuess":
      return (
        <View style={styles.paperBlock}>
          <Text style={styles.blockLabel}>{dictionary.common.accuracyGuessTitle}</Text>
          <Text style={styles.guessHint}>{dictionary.common.accuracyGuessSubtitle}</Text>
          {!getGuess(card.id) ? (
            <View style={styles.guessGrid}>
              {(Object.keys(dictionary.common.accuracyOptions) as AccuracyType[]).map((val) => (
                <Pressable key={val} style={styles.guessBtn} onPress={() => { hapticSelection(); setGuess(card.id, val); }}>
                  <Text style={styles.guessBtnText}>{dictionary.common.accuracyOptions[val]}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.guessResult}>
              <Text style={styles.guessResultLabel}>{dictionary.common.actualRating}</Text>
              <Text style={styles.guessResultValue}>
                {formatAccuracyLabel(block.metadata?.actualAccuracy as AccuracyType, dictionary)}
              </Text>
              {block.metadata?.explanation ? (
                <Text style={styles.body}>{String(block.metadata.explanation)}</Text>
              ) : null}
            </View>
          )}
        </View>
      );

    case "mediaChanged":
    case "history":
    case "whyItMatters":
      return (
        <View style={styles.paperBlock}>
          {block.title ? <Text style={styles.blockLabel}>{block.title}</Text> : null}
          <Text style={styles.serifBody}>{String(block.content)}</Text>
        </View>
      );

    case "sources":
      return (
        <View style={styles.paperBlock}>
          <Text style={styles.blockLabel}>{String(block.title)}</Text>
          {(block.content as Source[]).map((s, i) => (
            <Pressable key={i} onPress={() => openExternalUrl(s.url)} style={styles.sourceRow}>
              <Text style={styles.sourceTitle}>{s.title}</Text>
              <Ionicons name="open-outline" size={16} color={theme.accent} />
            </Pressable>
          ))}
        </View>
      );

    case "reflection":
      return (
        <View style={styles.paperBlock}>
          <Text style={styles.blockLabel}>{dictionary.common.feelQuestion}</Text>
          <ReadReflection
            cardId={card.id}
            selectedReflections={getReflections(card.id)}
            onToggle={(r) => toggleReflection(card.id, r)}
          />
        </View>
      );

    case "similar":
      return (
        <View style={styles.blockGap}>
          <Text style={styles.blockLabel}>{dictionary.card.relatedTopicHeading ?? dictionary.common.similarDiscoveries}</Text>
          {similarCards.map((c) => (
            <HistoryCard key={c.id} card={c} isRead={readIds.includes(c.id)} />
          ))}
        </View>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.bg,
    overflow: "hidden",
  },
  progressArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 44,
  },
  progressTrack: { flex: 1, height: 4, backgroundColor: theme.paper, borderRadius: 999, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: theme.accent },
  progressMeta: { alignItems: "flex-end", minWidth: 72 },
  progressLabel: { fontSize: 10, fontWeight: "800", color: theme.accent, textAlign: "right" },
  progressMinutes: { fontSize: 9, fontWeight: "700", color: theme.muted, marginTop: 2, textAlign: "right" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  blockGap: { gap: 16 },
  paperBlock: {
    backgroundColor: theme.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  mediaTag: { fontSize: 9, fontWeight: "800", letterSpacing: 1.5, color: theme.accent },
  hookTitle: { fontSize: 28, fontWeight: "600", color: theme.ink, lineHeight: 34 },
  hookSubtitle: { fontSize: 14, fontStyle: "italic", color: theme.muted, borderLeftWidth: 2, borderLeftColor: theme.accent, paddingLeft: 12 },
  hookBox: { backgroundColor: theme.ink, borderRadius: 24, padding: 24 },
  hookBoxLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 2, color: "rgba(255,255,255,0.5)", marginBottom: 12 },
  hookBoxText: { fontSize: 17, lineHeight: 26, color: theme.white, fontWeight: "500" },
  blockLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase", color: theme.muted, marginBottom: 12 },
  serifBody: { fontSize: 18, lineHeight: 28, color: theme.ink },
  body: { fontSize: 15, lineHeight: 24, color: theme.muted },
  guessHint: { fontSize: 11, color: theme.muted, marginBottom: 12 },
  guessGrid: { gap: 8 },
  guessBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.paper,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  guessBtnText: { fontSize: 11, fontWeight: "700", color: theme.ink, textTransform: "uppercase" },
  guessResult: { gap: 8 },
  guessResultLabel: { fontSize: 10, fontWeight: "800", color: theme.muted, letterSpacing: 1.5 },
  guessResultValue: { fontSize: 16, fontWeight: "700", color: theme.accent },
  sourceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sourceTitle: { flex: 1, fontSize: 14, fontWeight: "600", color: theme.ink, marginRight: 8 },
  nav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: "rgba(250,249,246,0.95)",
  },
  backBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  backSpacer: { width: 56 },
  nextBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.ink,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextComplete: { backgroundColor: theme.success },
  nextDisabled: { backgroundColor: theme.paper },
  nextText: { color: theme.white, fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
  complete: {
    flex: 1,
    width: "100%",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: theme.bg,
  },
  completeScroll: { flex: 1 },
  completeContent: {
    width: "100%",
    alignSelf: "stretch",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: theme.bg,
  },
  completeTitle: { fontSize: 24, fontWeight: "600", color: theme.ink, marginTop: 16, textAlign: "center" },
  completeDesc: { fontSize: 14, color: theme.muted, marginTop: 8, textAlign: "center", lineHeight: 22 },
});
