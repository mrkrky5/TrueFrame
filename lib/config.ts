export const SITE_CONFIG = {
  name: "Medyadan Gerçeğe",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://medyadangercege.com",
  feedbackEmail: {
    tr: "iletisim@medyadangercege.com",
    en: "hello@medyadangercege.com" // English support placeholder
  },
  feedbackUrl: process.env.NEXT_PUBLIC_FEEDBACK_URL || "mailto:iletisim@medyadangercege.com", // Legacy fallback
};
