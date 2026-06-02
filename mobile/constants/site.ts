import { SITE_BASE_URL, cardPublicUrl, dossierPublicUrl } from "@/lib/site-brand";

export const SITE_BASE = SITE_BASE_URL;

export function cardShareUrl(locale: string, cardId: string): string {
  return cardPublicUrl(locale, cardId);
}

export function dossierShareUrl(locale: string, slug: string): string {
  return dossierPublicUrl(locale, slug);
}
