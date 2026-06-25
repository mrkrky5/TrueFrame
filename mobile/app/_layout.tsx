import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import AdsBootstrap from "@/components/ads/AdsBootstrap";
import DailyNotificationBootstrap from "@/components/DailyNotificationBootstrap";
import DeepLinkBootstrap from "@/components/DeepLinkBootstrap";
import DevFreshGate from "@/components/DevFreshGate";
import FontProvider from "@/components/FontProvider";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import { theme } from "@/constants/theme";
import { NavigationProvider } from "@/context/NavigationContext";
import { LearningProvider } from "@/context/LearningContext";
import { ContentProvider } from "@/context/ContentContext";
import { HistoryProvider } from "@/context/HistoryContext";
import { LocaleProvider } from "@/context/LocaleContext";

export { ErrorBoundary } from "./error";

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: theme.bg },
  animation: "slide_from_right" as const,
  gestureEnabled: true,
  fullScreenGestureEnabled: Platform.OS === "ios",
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
    <DevFreshGate>
    <FontProvider>
    <LocaleProvider>
      <HistoryProvider>
        <NavigationProvider>
          <LearningProvider>
            <ContentProvider>
            <View style={styles.root}>
              <View style={styles.app}>
                <StatusBar style="dark" />
                <Stack screenOptions={stackScreenOptions}>
                  <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
                  <Stack.Screen name="card" options={{ presentation: "card" }} />
                  <Stack.Screen name="settings" options={{ presentation: "card" }} />
                  <Stack.Screen name="privacy" options={{ presentation: "card" }} />
                  <Stack.Screen name="terms" options={{ presentation: "card" }} />
                  <Stack.Screen name="support" options={{ presentation: "card" }} />
                  <Stack.Screen name="about" options={{ presentation: "card" }} />
                </Stack>
                <AdsBootstrap />
                <DeepLinkBootstrap />
                <DailyNotificationBootstrap />
                <OnboardingOverlay />
              </View>
            </View>
            </ContentProvider>
          </LearningProvider>
        </NavigationProvider>
      </HistoryProvider>
    </LocaleProvider>
    </FontProvider>
    </DevFreshGate>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: { flex: 1 },
  root: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 430 : undefined,
    alignSelf: Platform.OS === "web" ? "center" : undefined,
    backgroundColor: theme.bg,
    overflow: "hidden",
  },
  app: {
    flex: 1,
    width: "100%",
  },
});
