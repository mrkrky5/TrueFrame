import { SITE_BRAND, SITE_EMAIL, legalPageUrl } from "@/lib/site-brand";

/** Mobil geri bildirim / mağaza yasal linkleri */
export const SITE_CONFIG = {
  name: SITE_BRAND.name,
  feedbackEmail: SITE_EMAIL.tr,
  privacyUrl: legalPageUrl("tr", "privacy"),
  termsUrl: legalPageUrl("tr", "terms"),
  supportUrl: legalPageUrl("tr", "support"),
};
