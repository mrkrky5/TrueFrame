/** Public web pages (GitHub Pages). Used for AdMob/App Store + in-app "view online". */
const SITE_BASE = "https://mrkrky5.github.io/TrueFrame";

function localePath(locale: string): string {
  return locale === "en" ? "en" : "tr";
}

export function privacyUrl(locale: string): string {
  return `${SITE_BASE}/${localePath(locale)}/privacy/`;
}

export function termsUrl(locale: string): string {
  return `${SITE_BASE}/${localePath(locale)}/terms/`;
}

export function supportUrl(locale: string): string {
  return `${SITE_BASE}/${localePath(locale)}/support/`;
}
