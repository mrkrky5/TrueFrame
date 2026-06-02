import { Ionicons } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import { Platform, StyleSheet, View } from "react-native";

import { theme } from "@/constants/theme";

const MOOD_IONICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  war: "shield-outline",
  myth: "sparkles-outline",
  samurai: "flag-outline",
  crime: "search-outline",
  "cold-war": "flash-outline",
  "ancient-world": "business-outline",
  empires: "ribbon-outline",
  propaganda: "megaphone-outline",
  "daily-life": "restaurant-outline",
  "science-tech": "flask-outline",
};

const MOOD_SF: Record<string, string> = {
  war: "shield.fill",
  myth: "sparkles",
  samurai: "flag.fill",
  crime: "magnifyingglass",
  "cold-war": "atom",
  "ancient-world": "building.columns.fill",
  empires: "crown.fill",
  propaganda: "megaphone.fill",
  "daily-life": "fork.knife",
  "science-tech": "flask.fill",
};

export default function MoodIcon({
  moodId,
  active,
  inverted,
}: {
  moodId: string;
  active?: boolean;
  inverted?: boolean;
}) {
  const color = inverted ? theme.white : active ? theme.accent : theme.ink;

  if (Platform.OS === "ios" && MOOD_SF[moodId]) {
    return (
      <View style={styles.wrap}>
        <SymbolView name={MOOD_SF[moodId] as any} size={18} tintColor={color} />
      </View>
    );
  }

  const ion = MOOD_IONICONS[moodId] ?? "ellipse-outline";
  return (
    <View style={styles.wrap}>
      <Ionicons name={ion} size={18} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
});
