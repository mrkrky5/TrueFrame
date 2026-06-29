import { Platform } from "react-native";
import {
  AdEventType,
  InterstitialAd,
} from "react-native-google-mobile-ads";

import {
  ADS_ENABLED,
  INTERSTITIAL_EVERY_N_OPENS,
  getInterstitialUnitId,
} from "@/constants/ads";

let interstitial: InterstitialAd | null = null;
let loaded = false;
let openCount = 0;

function canRun(): boolean {
  return ADS_ENABLED && Platform.OS === "ios";
}

function ensureLoaded(): void {
  if (!canRun()) return;
  const unitId = getInterstitialUnitId();
  if (!unitId) return;

  if (!interstitial) {
    interstitial = InterstitialAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: true,
    });
    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      loaded = true;
    });
    // Reload a fresh ad after the user dismisses one.
    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      loaded = false;
      interstitial?.load();
    });
    interstitial.addAdEventListener(AdEventType.ERROR, () => {
      loaded = false;
    });
  }

  if (!loaded) interstitial.load();
}

/** Preload the first interstitial at app start so it's ready when due. */
export function primeInterstitial(): void {
  ensureLoaded();
}

/**
 * Counts card opens and shows a full-screen ad every Nth open,
 * but only if one is preloaded (never blocks navigation).
 */
export function maybeShowInterstitial(): void {
  if (!canRun()) return;

  openCount += 1;
  ensureLoaded();

  if (openCount % INTERSTITIAL_EVERY_N_OPENS !== 0) return;
  if (loaded && interstitial) {
    try {
      interstitial.show();
    } catch {
      /* ignore show errors */
    }
  }
}
