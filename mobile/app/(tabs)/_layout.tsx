import { Tabs } from "expo-router";

import AppTabBar from "@/components/AppTabBar";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";

export default function TabLayout() {
  const { dictionary } = useLocale();

  return (
    <Tabs
      tabBar={(props) => (
        <AppTabBar state={props.state} navigation={props.navigation as any} />
      )}
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.bg },
        headerTintColor: theme.ink,
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: theme.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: dictionary.nav.home }} />
      <Tabs.Screen name="explore" options={{ title: dictionary.nav.explore }} />
      <Tabs.Screen name="routes" options={{ title: dictionary.nav.routes }} />
      <Tabs.Screen name="saved" options={{ title: dictionary.nav.saved }} />
    </Tabs>
  );
}
