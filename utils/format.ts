import { AccuracyType, MediaType, SpoilerLevel } from "@/types";

export const safeUpperCase = (str: string | undefined, locale: string): string => {
  if (!str) return "";
  try {
    // English should be strictly en-US to avoid system locale leakage (like dotted I)
    const normalizedLocale = locale === 'tr' ? 'tr-TR' : 'en-US';
    return str.toLocaleUpperCase(normalizedLocale);
  } catch (e) {
    return str.toUpperCase();
  }
};

export const formatMediaType = (type: MediaType, dictionary?: any, locale: string = 'en'): string => {
  if (dictionary?.common?.mediaTypes?.[type]) {
    return safeUpperCase(dictionary.common.mediaTypes[type], locale);
  }
  const map: Record<string, string> = {
    game: "GAME",
    film: "MOVIE",
    series: "SERIES",
    book: "BOOK",
    general: "GENERAL",
    other: "OTHER"
  };
  return map[type] || "OTHER";
};

export const formatAccuracyType = (type: AccuracyType, dictionary?: any, locale: string = 'en'): string => {
  if (dictionary?.common?.accuracyOptions?.[type]) {
    return safeUpperCase(dictionary.common.accuracyOptions[type], locale);
  }
  const map: Record<string, string> = {
    "real": "GERÇEK",
    "partly-real": "KISMEN GERÇEK",
    "inspired-by-reality": "GERÇEKTEN ESİNLENMİŞ",
    "fictionalized": "DRAMATİZE EDİLMİŞ",
    "fiction": "KURGU"
  };
  return map[type] || "BİLİNMİYOR";
};

export const formatSpoilerLevel = (level: SpoilerLevel, dictionary?: any, locale: string = 'en'): string => {
  if (dictionary?.card) {
    if (level === "none") return safeUpperCase(dictionary.card.noSpoilers, locale);
    if (level === "minor") return safeUpperCase(dictionary.card.spoilers, locale);
    if (level === "major") return safeUpperCase(dictionary.card.heavySpoilers, locale);
  }
  const map: Record<string, string> = {
    none: "SÜRPRİZBOZAN YOK",
    minor: "HAFİF SÜRPRİZBOZAN",
    major: "SÜRPRİZBOZAN"
  };
  return map[level] || "";
};

export const formatMediaTitle = (title: string | undefined): string => {
  if (!title) return "";
  // If title contains " / ", take only the first part to keep tags clean
  if (title.includes(" / ")) {
    return title.split(" / ")[0];
  }
  return title;
};

export const formatTag = (tag: string, dictionary?: any, locale: string = 'en'): string => {
  if (!tag) return "";
  
  // Normalize tag for lookup: lowercase, trim, and collapse multiple dashes
  const normalizedTag = tag.toLowerCase().trim().replace(/-+/g, '-');
  
  // If dictionary has tag mapping, use it
  if (dictionary?.common?.tagLabels?.[normalizedTag]) {
    return dictionary.common.tagLabels[normalizedTag];
  }

  // Custom mappings for common malformed or technical tags
  const customMap: Record<string, string> = {
    "antik-dnya": "Ancient World",
    "antik-dunya": "Ancient World",
    "dunya-tarihi": "World History",
    "dnya-tarih": "World History",
    "ronesans": "Renaissance",
    "rnesans": "Renaissance",
    "orta-cag": "Middle Ages",
    "orta-a": "Middle Ages",
    "soguk-savas": "Cold War",
    "osmanli": "Ottoman Empire",
    "samuray": "Samurai",
    "denizcilik": "Maritime",
    "savas": "War",
    "shogun": "Shōgun",
    "hacli-seferleri": "Crusades",
    "orta-dogu": "Middle East",
    "sovalyelik": "Chivalry",
    "eglence": "Entertainment",
    "mitoloji": "Mythology",
    "suc": "Crime & Mafia",
    "modern-tarih": "Modern History",
    "gnlk-yaam": "Daily Life",
    "msr": "Egypt",
    "ingiltere": "England",
    "fransa": "France",
    "viking": "Viking",
    "assassins-creed": "Assassin's Creed",
    "turning-points": "Turning Points",
    "world-war-2": "World War II",
    "ww2": "World War II",
    "ww1": "World War I",
    "roma": "Rome",
    "teknoloji": "Technology",
    "sanat": "Art",
    "mimari": "Architecture",
    "kultur": "Culture",
    "kltr": "Culture",
    "bilim-tarihi": "History of Science",
    "korsanlik": "Piracy",
    "vahsi-bati": "Wild West",
    "ic-savas": "Civil War"
  };

  // If we have a dictionary, it takes precedence over the customMap
  // because the dictionary is already localized.
  // The customMap here acts as a "best guess" English fallback.
  if (customMap[normalizedTag]) return customMap[normalizedTag];

  // Generic formatting: kebab-case to Title Case
  return tag
    .split("-")
    .map(word => {
      if (!word) return "";
      let firstChar = safeUpperCase(word.charAt(0), locale);
      const rest = word.slice(1).toLowerCase();
      return firstChar + rest;
    })
    .join(" ");
};

