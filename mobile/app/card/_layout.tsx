import { Stack } from "expo-router";

import { theme } from "@/constants/theme";

export default function CardStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.bg, flex: 1 },
        animation: "slide_from_right",
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
