import { Platform } from "react-native";

/**
 * iOS-only AdMob config.
 * Set USE_TEST_ADS true during development; false for TestFlight/App Store.
 * Set ADS_ENABLED false to hide all ad UI without removing code.
 */
export const ADS_ENABLED = true;
/** TestFlight / App Store gönderiminden önce `false` yap. */
export const USE_TEST_ADS = true;

/** Google sample iOS App ID (dev fallback; production App ID lives in app.json plugin). */
export const TEST_IOS_APP_ID = "ca-app-pub-3940256099942544~1458002511";

const TEST_IOS_BANNER = "ca-app-pub-3940256099942544/2934735716";
const PRODUCTION_IOS_BANNER = "ca-app-pub-1571569580384263/2826203413";

export type AdPlacement = "explore_inline" | "after_read";

/** Explore: inline banner after this many catalog cards (0-based index). */
export const EXPLORE_INLINE_AD_AFTER_INDEX = 3;

export const adsConfig = {
  enabled: ADS_ENABLED,
  useTestAds: USE_TEST_ADS,
};

export function canShowAds(): boolean {
  return ADS_ENABLED && Platform.OS === "ios";
}

export function getBannerUnitId(_placement: AdPlacement): string | null {
  if (!canShowAds()) return null;
  if (USE_TEST_ADS) return TEST_IOS_BANNER;
  return PRODUCTION_IOS_BANNER;
}
