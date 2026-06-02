import * as WebBrowser from "expo-web-browser";
import { Linking, Platform } from "react-native";

export async function openExternalUrl(url: string) {
  if (!url?.trim()) return;

  try {
    if (Platform.OS === "web") {
      await Linking.openURL(url);
      return;
    }
    await WebBrowser.openBrowserAsync(url);
  } catch {
    try {
      await Linking.openURL(url);
    } catch {
      // User cancelled or URL invalid — no crash
    }
  }
}
