import { AccuracyType, MediaType, SpoilerLevel } from "@/types";

export const formatMediaType = (type: MediaType, dictionary?: any): string => {
  if (dictionary?.common?.mediaTypes?.[type]) {
    return dictionary.common.mediaTypes[type].toUpperCase();
  }
  const map: Record<string, string> = {
    game: "OYUN",
    film: "FİLM",
    series: "DİZİ",
    book: "KİTAP",
    general: "GENEL",
    other: "DİĞER"
  };
  return map[type] || "DİĞER";
};

export const formatAccuracyType = (type: AccuracyType, dictionary?: any): string => {
  if (dictionary?.common?.accuracyOptions?.[type]) {
    return dictionary.common.accuracyOptions[type].toUpperCase();
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

export const formatSpoilerLevel = (level: SpoilerLevel, dictionary?: any): string => {
  if (dictionary?.card) {
    if (level === "none") return dictionary.card.noSpoilers?.toUpperCase() || "";
    if (level === "minor") return dictionary.card.spoilers?.toUpperCase() || "";
    if (level === "major") return dictionary.card.heavySpoilers?.toUpperCase() || "";
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

export const formatTag = (tag: string, dictionary?: any): string => {
  if (!tag) return "";
  
  // Normalize tag for lookup: lowercase, trim, and collapse multiple dashes
  const normalizedTag = tag.toLowerCase().trim().replace(/-+/g, '-');
  
  // If dictionary has tag mapping, use it
  if (dictionary?.common?.tagLabels?.[normalizedTag]) {
    return dictionary.common.tagLabels[normalizedTag];
  }

  // Custom mappings for common malformed or technical tags (Turkish defaults)
  const customMap: Record<string, string> = {
    "antik-dnya": "Antik Dünya",
    "antik-dunya": "Antik Dünya",
    "dunya-tarihi": "Dünya Tarihi",
    "dnya-tarih": "Dünya Tarihi",
    "ronesans": "Rönesans",
    "rnesans": "Rönesans",
    "orta-cag": "Orta Çağ",
    "orta-a": "Orta Çağ",
    "soguk-savas": "Soğuk Savaş",
    "osmanli": "Osmanlı",
    "samuray": "Samuray",
    "denizcilik": "Denizcilik",
    "savas": "Savaş",
    "shogun": "Shōgun",
    "hacli-seferleri": "Haçlı Seferleri",
    "orta-dogu": "Orta Doğu",
    "sovalyelik": "Şövalyelik",
    "eglence": "Eğlence",
    "mitoloji": "Mitoloji",
    "suc": "Suç ve Mafya",
    "modern-tarih": "Modern Tarih",
    "gnlk-yaam": "Günlük Yaşam",
    "msr": "Mısır",
    "ingiltere": "İngiltere",
    "fransa": "Fransa",
    "viking": "Viking",
    "assassins-creed": "Assassin's Creed",
    "turning-points": "Dönüm Noktaları",
    "world-war-2": "II. Dünya Savaşı",
    "ww2": "II. Dünya Savaşı",
    "ww1": "I. Dünya Savaşı",
    "roma": "Roma",
    "teknoloji": "Teknoloji",
    "sanat": "Sanat",
    "mimari": "Mimari",
    "kultur": "Kültür",
    "kltr": "Kültür",
    "bilim-tarihi": "Bilim Tarihi",
    "korsanlik": "Korsanlık",
    "vahsi-bati": "Vahşi Batı",
    "ic-savas": "İç Savaş"
  };

  if (customMap[normalizedTag]) return customMap[normalizedTag];

  // Generic formatting: kebab-case to Title Case
  return tag
    .split("-")
    .map(word => {
      if (!word) return "";
      let firstChar = word.charAt(0).toUpperCase();
      const rest = word.slice(1).toLowerCase();
      return firstChar + rest;
    })
    .join(" ");
};

