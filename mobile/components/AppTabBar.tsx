import { Ionicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN, shouldHideTabBar } from "@/constants/layout";
import { detailTabFromPathname } from "@/constants/navigation";
import { theme } from "@/constants/theme";
import { useNavigationTab, type PrimaryTab } from "@/context/NavigationContext";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";

type TabKey = PrimaryTab;

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (opts: unknown) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

const TAB_META: Record<TabKey, { icon: keyof typeof Ionicons.glyphMap; iconFocused: keyof typeof Ionicons.glyphMap }> = {
  index: { icon: "home-outline", iconFocused: "home" },
  explore: { icon: "compass-outline", iconFocused: "compass" },
  routes: { icon: "trail-sign-outline", iconFocused: "trail-sign" },
  saved: { icon: "bookmark-outline", iconFocused: "bookmark" },
};

function routeToTab(routeName: string): TabKey | null {
  if (routeName === "index") return "index";
  if (routeName === "explore") return "explore";
  if (routeName === "routes") return "routes";
  if (routeName === "saved") return "saved";
  return null;
}

function resolveActiveTab(
  state: TabBarProps["state"],
  pathname: string,
  lastPrimaryTab: PrimaryTab
): TabKey {
  const fromDetail = detailTabFromPathname(pathname);
  if (fromDetail) return fromDetail;

  const current = state.routes[state.index]?.name ?? "index";
  const direct = routeToTab(current);
  if (direct) return direct;
  if (pathname.startsWith("/card/")) return lastPrimaryTab;
  return lastPrimaryTab;
}

export default function AppTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { dictionary } = useLocale();
  const { savedIds } = useHistory();
  const { lastPrimaryTab, setLastPrimaryTab, scrollPrimaryTabToTop, tabBarSuppressed } =
    useNavigationTab();
  const activeTab = resolveActiveTab(state, pathname, lastPrimaryTab);

  if (shouldHideTabBar(pathname) || tabBarSuppressed) {
    return null;
  }

  const labels: Record<TabKey, string> = {
    index: dictionary.nav.home,
    explore: dictionary.nav.explore,
    routes: dictionary.nav.routes,
    saved: dictionary.nav.saved,
  };

  const tabs: TabKey[] = ["index", "explore", "routes", "saved"];

  return (
    <View
      style={[
        styles.outer,
        { paddingBottom: Math.max(insets.bottom, Platform.OS === "web" ? 12 : 4) },
      ]}
    >
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const route = state.routes.find((r) => r.name === tab);
          if (!route) return null;

          const focused = activeTab === tab;
          const meta = TAB_META[tab];
          const badge = tab === "saved" && savedIds.length > 0 ? savedIds.length : 0;

          const onPress = () => {
            if (focused) {
              scrollPrimaryTabToTop(tab);
              return;
            }
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              setLastPrimaryTab(tab);
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={tab}
              accessibilityRole="button"
              accessibilityLabel={labels[tab]}
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress}
              style={({ pressed }) => [styles.item, focused && styles.itemFocused, pressed && styles.itemPressed]}
            >
              <View style={styles.iconWrap}>
                <Ionicons
                  name={focused ? meta.iconFocused : meta.icon}
                  size={22}
                  color={focused ? theme.accent : theme.muted}
                />
                {badge > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge > 9 ? "9+" : badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[styles.label, focused && styles.labelFocused]} numberOfLines={1}>
                {labels[tab]}
              </Text>
              {focused ? <View style={styles.activeDot} /> : <View style={styles.dotSpacer} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: TAB_BAR_MARGIN + 4,
    pointerEvents: "box-none",
  },
  bar: {
    flexDirection: "row",
    alignItems: "stretch",
    height: TAB_BAR_HEIGHT,
    backgroundColor: Platform.OS === "web" ? "rgba(255,255,255,0.96)" : theme.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.borderStrong,
    paddingHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      },
      web: { boxShadow: "0 8px 32px rgba(0,0,0,0.08)" as any },
    }),
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 8,
    borderRadius: 22,
    marginVertical: 4,
    minHeight: 48,
  },
  itemFocused: { backgroundColor: theme.accentSoft },
  itemPressed: { opacity: 0.85 },
  iconWrap: {
    position: "relative",
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: theme.white,
  },
  badgeText: { fontSize: 9, fontWeight: "800", color: theme.white },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: theme.muted,
    marginTop: 2,
    maxWidth: 76,
    textAlign: "center",
  },
  labelFocused: { color: theme.accent, fontWeight: "800" },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.accent,
    marginTop: 3,
  },
  dotSpacer: { width: 4, height: 4, marginTop: 3 },
});
