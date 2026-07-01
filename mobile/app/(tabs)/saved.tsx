import { Link } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import CardRow from "@/components/CardRow";
import FeedbackCard from "@/components/FeedbackCard";
import TabHeader from "@/components/TabHeader";
import ListInlineAd from "@/components/ads/ListInlineAd";
import AnimatedPressable from "@/components/motion/AnimatedPressable";
import { EmptyStateIcon, EmptyStateText } from "@/components/motion/EmptyStateEnter";
import { ListTabSkeleton } from "@/components/ui/AppSkeleton";
import { tabScreenContentPadding } from "@/constants/layout";
import { type } from "@/constants/typography";
import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { sortCardsByReadState } from "@shared/cardSort";
import { useCards } from "@/context/ContentContext";
import { usePrimaryTabFocus } from "@/hooks/usePrimaryTabFocus";
import { useTabScrollToTop } from "@/hooks/useTabScrollToTop";

const LIST_TUNING = {
  initialNumToRender: 8,
  maxToRenderPerBatch: 10,
  windowSize: 7,
  removeClippedSubviews: true,
} as const;

type LibrarySection = "saved" | "read";

function SavedEmptyCard({ t }: { t: (key: string) => string }) {
  return (
    <View style={styles.emptyBox}>
      <EmptyStateIcon>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="library-outline" size={36} color={theme.accent} />
        </View>
      </EmptyStateIcon>
      <EmptyStateText delay={50}>
        <Text style={styles.emptyTitle}>{t("globalEmptyTitle")}</Text>
      </EmptyStateText>
      <EmptyStateText delay={100}>
        <Text style={styles.emptyDesc}>{t("globalEmptyDesc")}</Text>
      </EmptyStateText>
      <EmptyStateText delay={150}>
        <Link href="/explore" asChild>
          <AnimatedPressable style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>{t("globalEmptyPrimaryCta")}</Text>
          </AnimatedPressable>
        </Link>
      </EmptyStateText>
    </View>
  );
}

function SectionTabs({
  section,
  onChange,
  savedCount,
  readCount,
  t,
}: {
  section: LibrarySection;
  onChange: (s: LibrarySection) => void;
  savedCount: number;
  readCount: number;
  t: (key: string) => string;
}) {
  return (
    <View style={styles.tabs}>
      <Pressable
        style={[styles.tab, section === "saved" && styles.tabActive]}
        onPress={() => onChange("saved")}
        accessibilityRole="tab"
        accessibilityState={{ selected: section === "saved" }}
      >
        <Text style={[styles.tabText, section === "saved" && styles.tabTextActive]}>
          {t("tabSaved")}
          {savedCount > 0 ? ` (${savedCount})` : ""}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tab, section === "read" && styles.tabActive]}
        onPress={() => onChange("read")}
        accessibilityRole="tab"
        accessibilityState={{ selected: section === "read" }}
      >
        <Text style={[styles.tabText, section === "read" && styles.tabTextActive]}>
          {t("tabRead")}
          {readCount > 0 ? ` (${readCount})` : ""}
        </Text>
      </Pressable>
    </View>
  );
}

export default function SavedScreen() {
  usePrimaryTabFocus("saved");
  const scrollRef = useRef<FlatList>(null);
  useTabScrollToTop("saved", scrollRef);
  const insets = useSafeAreaInsets();
  const { locale, dictionary } = useLocale();
  const { savedIds, readIds, ready } = useHistory();
  const allCards = useCards();
  const [section, setSection] = useState<LibrarySection>("saved");

  const saved = useMemo(
    () => sortCardsByReadState(allCards.filter((c) => savedIds.includes(c.id)), readIds),
    [allCards, savedIds, readIds]
  );

  const savedIdSet = useMemo(() => new Set(saved.map((c) => c.id)), [saved]);

  const read = useMemo(() => {
    const ids = readIds.filter((id) => !savedIdSet.has(id));
    return sortCardsByReadState(
      allCards.filter((c) => ids.includes(c.id)),
      readIds
    );
  }, [allCards, readIds, savedIdSet]);

  const t = (key: string) => dictionary.saved?.[key as keyof typeof dictionary.saved] ?? key;
  const savedReturn = { kind: "tab" as const, tab: "saved" as const };
  const showGlobalEmpty = ready && saved.length === 0 && read.length === 0;
  const bottomPad = tabScreenContentPadding(insets.bottom);
  const listData = section === "saved" ? saved : read;

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerBlock}>
        <TabHeader title={t("title")} subtitle={t("subtitle")} />
        {showGlobalEmpty ? null : (
          <SectionTabs
            section={section}
            onChange={setSection}
            savedCount={saved.length}
            readCount={read.length}
            t={t}
          />
        )}
      </View>
    ),
    [section, saved.length, read.length, showGlobalEmpty, dictionary]
  );

  if (!ready) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
        <ListTabSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8, flex: 1 }]}>
      <FlatList
        ref={scrollRef}
        data={showGlobalEmpty ? [] : listData}
        keyExtractor={(item) => item.id}
        key={section}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        contentInsetAdjustmentBehavior="never"
        ListHeaderComponent={ListHeader}
        renderItem={({ item, index }) => (
          <View style={styles.rowWrap}>
            {section === "saved" ? <ListInlineAd index={index} placement="saved_inline" /> : null}
            <CardRow
              card={item}
              locale={locale}
              isRead={readIds.includes(item.id)}
              returnTo={savedReturn}
              badge={section === "read" ? dictionary.common.readStatus : undefined}
            />
          </View>
        )}
        ListEmptyComponent={
          showGlobalEmpty ? (
            <SavedEmptyCard t={t} />
          ) : (
            <Text style={styles.sectionHint}>
              {section === "saved" ? t("emptySavedHint") : t("emptyReadHint")}
            </Text>
          )
        }
        ListFooterComponent={showGlobalEmpty ? null : <FeedbackCard />}
        {...LIST_TUNING}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  content: { paddingHorizontal: 20 },
  headerBlock: { marginBottom: 16 },
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: theme.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: "center",
  },
  tabActive: { backgroundColor: theme.ink, borderColor: theme.ink },
  tabText: { fontSize: 12, fontWeight: "700", color: theme.muted },
  tabTextActive: { color: theme.white },
  rowWrap: { marginBottom: 4 },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: theme.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyBox: {
    ...surfaces.card,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: { fontSize: 22, fontWeight: "600", color: theme.ink, textAlign: "center", marginBottom: 10 },
  emptyDesc: { fontSize: 14, lineHeight: 22, color: theme.muted, textAlign: "center", marginBottom: 24 },
  primaryBtn: {
    backgroundColor: theme.ink,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  primaryBtnText: { color: theme.white, fontSize: 14, fontWeight: "700" },
  sectionHint: { fontSize: 13, lineHeight: 20, color: theme.muted, paddingVertical: 8 },
});
