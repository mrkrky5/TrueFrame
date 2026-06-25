import { Platform } from "react-native";
import {
  AdsConsent,
  AdsConsentPrivacyOptionsRequirementStatus,
} from "react-native-google-mobile-ads";
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";

import { ADS_ENABLED } from "@/constants/ads";
import { initAds } from "@/utils/ads-init";

export type AdPrivacyOptionsResult =
  | "privacy_form"
  | "consent_form"
  | "att_prompt"
  | "settings"
  | "unavailable";

/**
 * UMP (EU/UK) + iOS ATT before AdMob init.
 * Falls back to non-personalized ads if consent flow fails.
 */
export async function prepareAdConsent(): Promise<void> {
  if (!ADS_ENABLED || Platform.OS !== "ios") return;

  try {
    await AdsConsent.gatherConsent();
  } catch (e) {
    if (__DEV__) {
      console.warn("[True Frame ads] UMP consent failed:", e);
    }
  }

  try {
    await requestTrackingPermissionsAsync();
  } catch (e) {
    if (__DEV__) {
      console.warn("[True Frame ads] ATT request failed:", e);
    }
  }
}

export async function showAdPrivacyOptions(): Promise<AdPrivacyOptionsResult> {
  if (!ADS_ENABLED || Platform.OS !== "ios") return "unavailable";

  try {
    await initAds();
    const info = await AdsConsent.requestInfoUpdate();

    if (
      info.privacyOptionsRequirementStatus ===
      AdsConsentPrivacyOptionsRequirementStatus.REQUIRED
    ) {
      await AdsConsent.showPrivacyOptionsForm();
      return "privacy_form";
    }

    if (info.isConsentFormAvailable) {
      await AdsConsent.showForm();
      return "consent_form";
    }

    const tracking = await getTrackingPermissionsAsync();
    if (tracking.status === "undetermined") {
      await requestTrackingPermissionsAsync();
      return "att_prompt";
    }

    return "settings";
  } catch (e) {
    if (__DEV__) {
      console.warn("[True Frame ads] Privacy options failed:", e);
    }

    return "unavailable";
  }
}
