import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

/** expo-router Link + asChild passes styles through Slot — arrays crash on web. */
export function flattenStyle(style: StyleProp<ViewStyle>): ViewStyle | undefined {
  return StyleSheet.flatten(style) ?? undefined;
}
