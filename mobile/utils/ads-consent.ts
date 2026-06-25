export type AdPrivacyOptionsResult =
  | "privacy_form"
  | "consent_form"
  | "att_prompt"
  | "settings"
  | "unavailable";

/** Web / non-iOS: no native consent flow. */
export async function prepareAdConsent(): Promise<void> {}

export async function showAdPrivacyOptions(): Promise<AdPrivacyOptionsResult> {
  return "unavailable";
}
