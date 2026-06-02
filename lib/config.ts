import {
  SITE_BASE_URL,
  SITE_BRAND,
  SITE_EMAIL,
  legalPageUrl,
} from "./site-brand";

export const SITE_CONFIG = {
  name: SITE_BRAND.name,
  baseUrl: SITE_BASE_URL,
  feedbackEmail: SITE_EMAIL,
  feedbackUrl:
    process.env.NEXT_PUBLIC_FEEDBACK_URL || `mailto:${SITE_BRAND.email}`,
  supportPath: (locale: string) => `/${locale}/support`,
  supportUrl: (locale: string) => legalPageUrl(locale, "support"),
};
