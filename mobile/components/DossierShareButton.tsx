import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, Share, StyleSheet } from "react-native";

import { dossierShareUrl } from "@/constants/site";
import { surfaces } from "@/constants/surfaces";
import { theme } from "@/constants/theme";
import { useLocale } from "@/context/LocaleContext";
import { hapticLight } from "@/utils/haptics";

export default function DossierShareButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const { dictionary, locale } = useLocale();

  const share = async () => {
    hapticLight();
    const url = dossierShareUrl(locale, slug);
    const lead = (dictionary.common.shareDossierLead ?? "{{title}}").replace("{{title}}", title);
    const message = `${lead}\n${url}`;

    try {
      await Share.share(
        Platform.OS === "ios"
          ? { title: lead, message, url }
          : { title: lead, message }
      );
    } catch {
      // dismissed
    }
  };

  return (
    <Pressable
      hitSlop={12}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
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
  pressed: { opacity: 0.88 },
});
