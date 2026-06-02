import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { hapticSuccess } from "@/utils/haptics";

export default function SaveHeaderButton({ cardId }: { cardId: string }) {
  const { isSaved, toggleSave } = useHistory();
  const { dictionary } = useLocale();
  const saved = isSaved(cardId);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <View style={styles.wrap}>
      <Pressable
        hitSlop={12}
        style={styles.btn}
        accessibilityRole="button"
        accessibilityLabel={saved ? dictionary.common.saved : dictionary.common.save}
        onPress={() => {
          const nextSaved = !saved;
          toggleSave(cardId);
          hapticSuccess();
          setToast(
            nextSaved ? dictionary.common.saveToastSaved : dictionary.common.saveToastRemoved
          );
        }}
      >
        <Ionicons
          name={saved ? "bookmark" : "bookmark-outline"}
          size={22}
          color={saved ? theme.accent : theme.ink}
        />
      </Pressable>
      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative", alignItems: "flex-end" },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.border,
  },
  toast: {
    position: "absolute",
    top: 48,
    right: 0,
    minWidth: 140,
    maxWidth: 200,
    backgroundColor: theme.ink,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    zIndex: 20,
    pointerEvents: "none",
  },
  toastText: { color: theme.white, fontSize: 11, fontWeight: "600", textAlign: "center" },
});
