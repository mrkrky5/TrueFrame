import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, Share, StyleSheet, View } from "react-native";

import { cardShareUrl } from "@/constants/site";
import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { hapticLight } from "@/utils/haptics";

export default function ShareHeaderButton({
  cardId,
  title,
}: {
  cardId: string;
  title: string;
}) {
  const { dictionary, locale } = useLocale();

  const share = async () => {
    hapticLight();
    const url = cardShareUrl(locale, cardId);
    const lead = (dictionary.common.shareCardLead ?? "{{title}}").replace("{{title}}", title);
    try {
      await Share.share(
        Platform.OS === "ios"
          ? { title: lead, url }
          : { title: lead, message: `${lead}\n${url}` }
      );
    } catch {
      // User dismissed share sheet
    }
  };

  return (
    <Pressable
      hitSlop={12}
      style={styles.btn}
      accessibilityRole="button"
      accessibilityLabel={dictionary.common.share}
      onPress={() => void share()}
    >
      <Ionicons name="share-outline" size={20} color={theme.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...surfaces.inset,
  },
});
