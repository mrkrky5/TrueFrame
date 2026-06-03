import { Stack } from "expo-router";

import { theme } from "@/constants/theme";

export default function CardStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.bg },
        animation: "slide_from_right",
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
