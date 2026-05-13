export type MediaType = "game" | "film" | "series" | "book" | "general" | "other";
export type VerificationStatus = "verified" | "needs_review" | "placeholder";
export type SpoilerLevel = "none" | "minor" | "major";
export type AccuracyType = "real" | "partly-real" | "inspired-by-reality" | "fictionalized" | "fiction";

export interface Source {
  title: string;
  url: string;
  type: string;
}

export interface HistoryImage {
  src: string;
  alt: string;
  caption?: string;
  credit: string;
  sourceUrl: string;
  license: string;
  type: "historical" | "illustrative" | "reconstruction";
}

export interface HistoryCard {
  id: string;
  title: string;
  subtitle: string;
  mediaType: MediaType;
  mediaTitle: string;
  mediaConnection?: string;
  verificationStatus: VerificationStatus;
  sourceQuality: string;
  whatWeSee: string;
  realHistory: string;
  accuracyNote: string;
  whyInteresting: string;
  misconception?: string;
  mediaChanged?: string; // Phase 2A.5: What the media altered
  whyItMatters?: string; // Phase 2A.5: Historical legacy
  themes: string[];
  readingTimeMinutes: number;
  sources: Source[];
  relatedCardIds: string[];
  nextTopics: string[];
  difficulty: "basic" | "medium" | "deep";
  era?: string;
  region?: string;
  images?: {
    hero?: HistoryImage;
    thumbnail?: HistoryImage;
    inline?: HistoryImage[];
  };
  // Phase 2A Additions
  spoilerLevel?: SpoilerLevel;
  spoilerNote?: string;
  accuracyType?: AccuracyType;
  isPremium?: boolean;
  isFlagship?: boolean; // Phase 2A.5: Identifies long-form premium cards
  publicationDate?: string;
  tags?: string[];
  quickRealityCheck?: string;
}

export interface ReadingRoute {
  id: string;
  title: string;
  description: string;
  cardIds: string[];
  icon: string;
}
