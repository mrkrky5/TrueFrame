import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { openExternalUrl } from "@/utils/openExternalUrl";

/** Opens the public web version of a legal page in the system browser. */
export default function OnlineVersionLink({ url }: { url: string }) {
  const { dictionary } = useLocale();
  const label = dictionary.legal.viewOnline ?? "View online";

  return (
    <Pressable
      style={styles.row}
      onPress={() => void openExternalUrl(url)}
      accessibilityRole="link"
      accessibilityLabel={label}
    >
      <Ionicons name="open-outline" size={16} color={theme.accent} />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.paper,
  },
  text: { fontSize: 14, fontWeight: "700", color: theme.accent },
});
