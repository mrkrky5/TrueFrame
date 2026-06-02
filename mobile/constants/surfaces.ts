import { Platform, type ViewStyle } from "react-native";

import { theme } from "./theme";

/** Hafif gölge — kartlar arka plandan ayrılsın */
export const cardShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
  },
  android: { elevation: 2 },
  default: {},
}) ?? {};

export const surfaces = {
  screen: {
    backgroundColor: theme.bg,
  } as ViewStyle,
  card: {
    backgroundColor: theme.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.border,
    ...cardShadow,
  } as ViewStyle,
  cardAccent: {
    borderLeftWidth: 3,
    borderLeftColor: theme.accent,
  } as ViewStyle,
  band: {
    backgroundColor: theme.surfaceMuted,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  } as ViewStyle,
  inset: {
    backgroundColor: theme.surfaceInset,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
  } as ViewStyle,
  sectionLabelPill: {
    alignSelf: "flex-start" as const,
    backgroundColor: theme.surfaceInset,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 4,
  } as ViewStyle,
};
