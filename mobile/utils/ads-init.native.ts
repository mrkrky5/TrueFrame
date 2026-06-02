import mobileAds from "react-native-google-mobile-ads";

import { ADS_ENABLED } from "@/constants/ads";

let initialized = false;

export async function initAds(): Promise<void> {
  if (!ADS_ENABLED || initialized) return;
  try {
    await mobileAds().initialize();
    initialized = true;
  } catch (e) {
    if (__DEV__) {
      console.warn("[True Frame ads] Mobile Ads init failed:", e);
    }
  }
}
