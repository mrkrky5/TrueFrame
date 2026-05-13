export const i18n = {
  defaultLocale: 'tr',
  locales: ['tr', 'en'],
} as const

export type Locale = (typeof i18n)['locales'][number]
 
export const ENGLISH_PILOT_IDS = [
  "oppenheimer-trinity",
  "chernobyl-disaster",
  "shogun-tokugawa-rise-real",
  "ac-origins-siwa",
  "gladiator-colosseum",
  "rdr2-frontier",
  "ghost-tsushima-invasion",
  "1917-siper-savasi-flagship",
  "the-terror-arctic-tragedy-flagship",
  "ac-mirage-baghdad"
];
