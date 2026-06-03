import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import "react-native-reanimated";

import AdsBootstrap from "@/components/ads/AdsBootstrap";
import DailyNotificationBootstrap from "@/components/DailyNotificationBootstrap";
import DevFreshGate from "@/components/DevFreshGate";
import FontProvider from "@/components/FontProvider";
import ImageCacheBootstrap from "@/components/ImageCacheBootstrap";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import { theme } from "@/constants/theme";
import { NavigationProvider } from "@/context/NavigationContext";
import { LearningProvider } from "@/context/LearningContext";
import { HistoryProvider } from "@/context/HistoryContext";
import { LocaleProvider } from "@/context/LocaleContext";

export { ErrorBoundary } from "./error";

export default function RootLayout() {
  return (
    <DevFreshGate>
    <FontProvider>
    <LocaleProvider>
      <HistoryProvider>
        <NavigationProvider>
          <LearningProvider>
            <View style={styles.root}>
              <View style={styles.app}>
                <StatusBar style="dark" />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.bg },
                  }}
                >
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen
                    name="card"
                    options={{
                      presentation: "card",
                      animation: "slide_from_right",
                      gestureEnabled: true,
                      fullScreenGestureEnabled: true,
                    }}
                  />
                  <Stack.Screen name="settings" options={{ presentation: "card" }} />
                  <Stack.Screen name="privacy" options={{ presentation: "card" }} />
                  <Stack.Screen name="terms" options={{ presentation: "card" }} />
                  <Stack.Screen name="support" options={{ presentation: "card" }} />
                  <Stack.Screen name="about" options={{ presentation: "card" }} />
                </Stack>
                <AdsBootstrap />
                <DailyNotificationBootstrap />
                <ImageCacheBootstrap />
                <OnboardingOverlay />
              </View>
            </View>
          </LearningProvider>
        </NavigationProvider>
      </HistoryProvider>
    </LocaleProvider>
    </FontProvider>
    </DevFreshGate>
  );
}

const styles = StyleSheet.create({
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
