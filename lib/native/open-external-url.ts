import { Browser } from "@capacitor/browser";
import { isNativeApp } from "@/lib/native/platform";

/**
 * Opens http(s) links in the system browser on native (SFSafariViewController on iOS)
 * and in a new tab on web.
 */
export async function openExternalUrl(url: string): Promise<void> {
  if (!url?.startsWith("http")) return;

  if (isNativeApp()) {
    await Browser.open({ url });
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}
