import { Link } from "expo-router";
import React, { useMemo, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import CardRow from "@/components/CardRow";
import FeedbackCard from "@/components/FeedbackCard";
import { ListTabSkeleton } from "@/components/ui/AppSkeleton";
import { tabBarBottomInset } from "@/constants/layout";
import { type } from "@/constants/typography";
import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { sortCardsByReadState } from "@shared/cardSort";
import { getCards } from "@shared/content";
import { usePrimaryTabFocus } from "@/hooks/usePrimaryTabFocus";
import { useTabScrollToTop } from "@/hooks/useTabScrollToTop";

function SavedEmptyCard({ t }: { t: (key: string) => string }) {
  return (
    <View style={styles.emptyBox}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="library-outline" size={36} color={theme.accent} />
      </View>
      <Text style={styles.emptyTitle}>{t("globalEmptyTitle")}</Text>
      <Text style={styles.emptyDesc}>{t("globalEmptyDesc")}</Text>
      <Link href="/" asChild>
        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>{t("globalEmptyPrimaryCta")}</Text>
        </Pressable>
      </Link>
      <Link href="/explore" asChild>
        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>{t("globalEmptySecondaryCta")}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

export default function SavedScreen() {
  usePrimaryTabFocus("saved");
  const scrollRef = useRef<ScrollView>(null);
  useTabScrollToTop("saved", scrollRef);
  const insets = useSafeAreaInsets();
  const { locale, dictionary } = useLocale();
  const { savedIds, recentIds, readIds, ready } = useHistory();
  const allCards = getCards(locale);

  const saved = useMemo(
    () => sortCardsByReadState(allCards.filter((c) => savedIds.includes(c.id)), readIds),
    [allCards, savedIds, readIds]
  );
  const recent = useMemo(
    () => sortCardsByReadState(allCards.filter((c) => recentIds.includes(c.id)), readIds),
    [allCards, recentIds, readIds]
  );
  const read = useMemo(
    () => sortCardsByReadState(allCards.filter((c) => readIds.includes(c.id)), readIds),
    [allCards, readIds]
  );

  const t = (key: string) => dictionary.saved?.[key as keyof typeof dictionary.saved] ?? key;
  const savedReturn = { kind: "tab" as const, tab: "saved" as const };
  const showGlobalEmpty =
    ready && saved.length === 0 && recent.length === 0 && read.length === 0;
  const showSavedEmptyCard = ready && saved.length === 0 && !showGlobalEmpty;
  const bottomPad = tabBarBottomInset(insets.bottom) + 16;

  if (!ready) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
        <ListTabSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8, flex: 1 }]}>
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{t("title")}</Text>
          <Text style={styles.subtitle}>{t("subtitle")}</Text>
        </View>
        <Link href="/settings" asChild>
          <Pressable
            style={styles.settingsBtn}
            accessibilityRole="button"
            accessibilityLabel={dictionary.settings?.title ?? "Ayarlar"}
            hitSlop={8}
          >
            <Ionicons name="settings-outline" size={22} color={theme.ink} />
          </Pressable>
        </Link>
      </View>

      {showGlobalEmpty ? (
        <SavedEmptyCard t={t} />
      ) : (
        <>
          {showSavedEmptyCard ? <SavedEmptyCard t={t} /> : null}
          {saved.length > 0 ? (
            <Section title={t("savedItems")}>
              {saved.map((c) => (
                <CardRow
                  key={c.id}
                  card={c}
                  locale={locale}
                  isRead={readIds.includes(c.id)}
                  returnTo={savedReturn}
                />
              ))}
            </Section>
          ) : null}
          {recent.length > 0 ? (
            <Section title={t("recentlyViewed")}>
              {recent.map((c) => (
                <CardRow
                  key={c.id}
                  card={c}
                  locale={locale}
                  isRead={readIds.includes(c.id)}
                  returnTo={savedReturn}
                />
              ))}
            </Section>
          ) : null}
          {read.length > 0 ? (
            <Section title={t("completed")}>
              {read.map((c) => (
                <CardRow
                  key={c.id}
                  card={c}
                  locale={locale}
                  isRead
                  returnTo={savedReturn}
                  badge={dictionary.common.readStatus}
                />
              ))}
            </Section>
          ) : null}
        </>
      )}

      <FeedbackCard />
    </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 },
  headerText: { flex: 1, paddingRight: 12 },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    ...surfaces.inset,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { ...type.screenTitle, marginBottom: 6 },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: theme.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  subtitle: { fontSize: 14, color: theme.muted, marginBottom: 24 },
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
    marginBottom: 10,
  },
  primaryBtnText: { color: theme.white, fontSize: 14, fontWeight: "700" },
  secondaryBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    ...surfaces.inset,
    borderColor: theme.borderStrong,
  },
  secondaryBtnText: { color: theme.ink, fontSize: 13, fontWeight: "700" },
  section: {
    marginBottom: 24,
    padding: 14,
    borderRadius: 16,
    backgroundColor: theme.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: theme.ink, marginBottom: 12 },
});
