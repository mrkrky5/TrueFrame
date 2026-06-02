import { theme } from "@/constants/theme";

export const fonts = {
  serif: "SourceSerif4_600SemiBold",
  sans: "DMSans_400Regular",
  sansMedium: "DMSans_500Medium",
  sansBold: "DMSans_700Bold",
} as const;

export const type = {
  brandTitle: {
    fontFamily: fonts.serif,
    fontSize: 32,
    fontWeight: "600" as const,
    color: theme.ink,
    letterSpacing: -0.5,
  },
  screenTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontWeight: "600" as const,
    color: theme.ink,
  },
  cardTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: "600" as const,
    color: theme.ink,
    lineHeight: 26,
  },
  sectionCaps: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: "800" as const,
    letterSpacing: 1.2,
    textTransform: "uppercase" as const,
    color: theme.muted,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    color: theme.ink,
  },
  bodyMuted: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 20,
    color: theme.muted,
  },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: "800" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
    color: theme.muted,
  },
} as const;
