/**
 * True Frame — tek kaynak: domain, e-posta, public URL’ler.
 * Mobil sync: scripts/setup-mobile-links.mjs → mobile/lib/site-brand.ts
 */
export const SITE_BRAND = {
  name: "True Frame",
  domain: "trueframe.app",
  email: "contact@trueframe.app",
} as const;

export const SITE_BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL) ||
  `https://${SITE_BRAND.domain}`;

export const SITE_EMAIL = {
  tr: SITE_BRAND.email,
  en: SITE_BRAND.email,
} as const;

export function sitePath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_BASE_URL}${p}`;
}

export function legalPageUrl(
  locale: string,
  page: "privacy" | "terms" | "support" | "about"
): string {
  return sitePath(`/${locale}/${page}`);
}

export function cardPublicUrl(locale: string, cardId: string): string {
  return sitePath(`/${locale}/card/${cardId}`);
}

export function dossierPublicUrl(locale: string, slug: string): string {
  return sitePath(`/${locale}/media/${slug}`);
}
