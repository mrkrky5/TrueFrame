import tr from "../lib/dictionaries/tr.json";
import en from "../lib/dictionaries/en.json";
import type { Locale } from "./i18n";

const dictionaries = { tr, en } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export type Dictionary = ReturnType<typeof getDictionary>;
