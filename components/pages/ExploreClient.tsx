"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import HistoryCard from "@/components/ui/HistoryCard";
import { HistoryCard as IHistoryCard, MediaType, AccuracyType } from "@/types";
import { getAllDossiers, getStrongDossiers } from "@/utils/dossier";
import MediaDossierCard from "@/components/ui/MediaDossierCard";
import { Search as SearchIcon, Compass, Filter, X, Sparkles, Flame, Layers } from "lucide-react";
import { formatTag } from "@/utils/format";
import Link from "next/link";
import { Locale } from "@/lib/i18n-config";
import EnglishPilotBanner from "@/components/ui/EnglishPilotBanner";
import MissingMediaRequest from "@/components/ui/MissingMediaRequest";

interface ExploreClientProps {
  cards: IHistoryCard[];
  locale: Locale;
  dictionary: any;
}

const TRENDING_SEARCHES = [
  "Assassin’s Creed",
  "Shōgun",
  "Oppenheimer",
  "Chernobyl",
  "Ghost of Tsushima",
  "1917",
  "Red Dead Redemption",
  "Napoleon"
];

function ExploreContent({ cards: allCards, locale, dictionary }: ExploreClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag");
  const flagshipParam = searchParams.get("flagship");
  const queryParam = searchParams.get("q");

  const allDossiers = useMemo(() => getAllDossiers(allCards), [allCards]);
  const strongDossiers = useMemo(() => getStrongDossiers(allCards), [allCards]);

  const [activeMediaFilter, setActiveMediaFilter] = useState<MediaType | "all">("all");
  const [activeAccuracyFilter, setActiveAccuracyFilter] = useState<AccuracyType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [onlyFlagships, setOnlyFlagships] = useState(false);

  useEffect(() => {
    if (tagParam) setSelectedTag(tagParam);
    if (flagshipParam === "true") setOnlyFlagships(true);
    if (queryParam) setSearchQuery(queryParam);
  }, [tagParam, flagshipParam, queryParam]);

  const updateUrl = (params: { tag?: string | null, q?: string | null }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (params.tag !== undefined) {
      if (params.tag) current.set("tag", params.tag);
      else current.delete("tag");
    }
    
    if (params.q !== undefined) {
      if (params.q) current.set("q", params.q);
      else current.delete("q");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };

  const mediaTypes: { label: string; value: MediaType | "all" }[] = [
    { label: dictionary.common.mediaFilterLabels.all, value: "all" },
    { label: dictionary.common.mediaFilterLabels.game, value: "game" },
    { label: dictionary.common.mediaFilterLabels.film, value: "film" },
    { label: dictionary.common.mediaFilterLabels.series, value: "series" },
    { label: dictionary.common.mediaFilterLabels.book, value: "book" },
  ];

  const accuracyTypes: { label: string; value: AccuracyType | "all" }[] = [
    { label: dictionary.common.accuracyFilterLabels.all, value: "all" },
    { label: dictionary.card.highAccuracy, value: "real" },
    { label: dictionary.card.medAccuracy, value: "partly-real" },
    { label: dictionary.common.accuracyFilterLabels.inspired, value: "inspired-by-reality" },
    { label: dictionary.common.accuracyFilterLabels.fictionalized, value: "fictionalized" },
  ];

  const MOODS = useMemo(() => {
    const allMoods = [
      { id: "war", label: dictionary.common.moodLabels.war, icon: "⚔️", tag: locale === 'tr' ? "savas" : "war" },
      { id: "myth", label: dictionary.common.moodLabels.myth, icon: "✨", tag: locale === 'tr' ? "mitoloji" : "myth" },
      { id: "samurai", label: dictionary.common.moodLabels.samurai, icon: "⛩️", tag: locale === 'tr' ? "samuray" : "samurai" },
      { id: "crime", label: dictionary.common.moodLabels.crime, icon: "🕵️", tag: locale === 'tr' ? "suc" : "crime" },
      { id: "cold-war", label: dictionary.common.moodLabels["cold-war"], icon: "☢️", tag: locale === 'tr' ? "soguk-savas" : "cold-war" },
      { id: "ancient-world", label: dictionary.common.moodLabels["ancient-world"], icon: "🏛️", tag: locale === 'tr' ? "antik-dnya" : "ancient-world" },
      { id: "empires", label: dictionary.common.moodLabels.empires, icon: "👑", tag: locale === 'tr' ? "imparatorluklar" : "empires" },
      { id: "propaganda", label: dictionary.common.moodLabels.propaganda, icon: "📢", tag: locale === 'tr' ? "propaganda" : "propaganda" },
      { id: "daily-life", label: dictionary.common.moodLabels["daily-life"], icon: "🥣", tag: locale === 'tr' ? "gnlk-hayat" : "daily-life" },
      { id: "science-tech", label: dictionary.common.moodLabels["science-tech"], icon: "🔬", tag: locale === 'tr' ? "bilim" : "science" },
    ];

    if (locale === 'tr') return allMoods;

    // For English, only show moods that have at least one card in the pilot
    return allMoods.filter(mood => 
      allCards.some(card => card.tags && card.tags.includes(mood.tag))
    );
  }, [locale, dictionary, allCards]);

  const activeMood = useMemo(() => {
    return MOODS.find(m => m.tag === selectedTag);
  }, [MOODS, selectedTag]);

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      const matchesMedia = activeMediaFilter === "all" || card.mediaType === activeMediaFilter;
      const matchesAccuracy = activeAccuracyFilter === "all" || card.accuracyType === activeAccuracyFilter;
      const matchesFlagship = !onlyFlagships || card.isFlagship;
      const matchesTag = !selectedTag || (card.tags && card.tags.includes(selectedTag));

      const query = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        card.title.toLowerCase().includes(query) ||
        card.mediaTitle.toLowerCase().includes(query) ||
        (card.subtitle && card.subtitle.toLowerCase().includes(query)) ||
        (card.quickRealityCheck && card.quickRealityCheck.toLowerCase().includes(query)) ||
        card.themes.some(theme => theme.toLowerCase().includes(query)) ||
        (card.tags && card.tags.some(tag => tag.toLowerCase().includes(query)));

      return matchesMedia && matchesAccuracy && matchesFlagship && matchesTag && matchesSearch;
    });
  }, [allCards, activeMediaFilter, activeAccuracyFilter, onlyFlagships, selectedTag, searchQuery]);

  const matchingDossier = useMemo(() => {
    if (!searchQuery || searchQuery.length < 3) return null;
    const query = searchQuery.toLowerCase();
    return allDossiers.find(d =>
      d.title.toLowerCase() === query ||
      d.title.toLowerCase().includes(query)
    );
  }, [allDossiers, searchQuery]);

  const handleMoodClick = (mood: any) => {
    const newTag = selectedTag === mood.tag ? null : mood.tag;
    setSelectedTag(newTag);
    setSearchQuery("");
    updateUrl({ tag: newTag, q: "" });
  };

  const activeFilterCount = [
    activeMediaFilter !== "all",
    activeAccuracyFilter !== "all",
    onlyFlagships,
    selectedTag !== null
  ].filter(Boolean).length;

  const isAnyFilterActive = activeFilterCount > 0 || searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="px-6 max-w-lg mx-auto">
        <header className="mb-10 mt-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-serif text-neutral-950 mb-1">{dictionary.nav.explore}</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                {dictionary.common.traceHistory}
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${showFilters
                  ? "bg-neutral-950 text-white"
                  : activeFilterCount > 0
                    ? "bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 shadow-sm"
                    : "bg-white border border-neutral-200 text-neutral-600 shadow-sm"
                }`}
            >
              <Filter size={14} className={activeFilterCount > 0 ? "text-brand-secondary" : ""} />
              {dictionary.common.filter}
              {activeFilterCount > 0 && (
                <span className={`ml-1 ${showFilters ? "text-white/60" : "text-brand-secondary"}`}>
                  ({activeFilterCount})
                </span>
              )}
            </button>
          </div>

          <EnglishPilotBanner locale={locale} />

          <div className="relative mb-6">
            <input
              type="text"
              aria-label={dictionary.common.searchPlaceholder}
              placeholder={dictionary.common.searchPlaceholder}
              className="w-full bg-white border border-neutral-200 rounded-3xl px-5 py-4.5 pl-12 focus:outline-none focus:ring-4 focus:ring-neutral-950/5 transition-all shadow-sm text-neutral-900 placeholder:text-neutral-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateUrl({ q: e.target.value });
              }}
            />
            <SearchIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  updateUrl({ q: "" });
                }} 
                className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 p-1 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {showFilters && (
            <div className="bg-white rounded-3xl p-6 mt-4 mb-6 shadow-xl border border-black/5 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">
                    {dictionary.common.contentType}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mediaTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setActiveMediaFilter(type.value)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${activeMediaFilter === type.value ? "bg-neutral-950 text-white border-neutral-950" : "bg-neutral-50 text-neutral-500 border-neutral-100"
                          }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">
                    {dictionary.common.accuracy}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {accuracyTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setActiveAccuracyFilter(type.value)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${activeAccuracyFilter === type.value ? "bg-neutral-950 text-white border-neutral-950" : "bg-neutral-50 text-neutral-500 border-neutral-100"
                          }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                    {dictionary.common.onlyFlagship}
                  </span>
                  <button
                    onClick={() => setOnlyFlagships(!onlyFlagships)}
                    aria-pressed={onlyFlagships}
                    aria-label={dictionary.common.onlyFlagshipToggleLabel}
                    className={`w-10 h-5 rounded-full transition-all relative ${onlyFlagships ? "bg-brand-secondary" : "bg-neutral-200"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${onlyFlagships ? "left-5.5" : "left-0.5"}`}></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {!searchQuery && !selectedTag && !showFilters && (
            <div className="mt-8 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                  {dictionary.common.chooseMood}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodClick(mood)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm active:scale-[0.98] transition-all text-left group"
                  >
                    <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{mood.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-tight text-neutral-700 leading-tight">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        <div className="space-y-6">
          {isAnyFilterActive && (
            <div className="flex flex-col gap-3 px-1 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                  <Compass size={12} strokeWidth={3} /> {filteredCards.length} {dictionary.common.results}
                </span>
                
                {(selectedTag || searchQuery || activeMediaFilter !== 'all' || activeAccuracyFilter !== 'all' || onlyFlagships) && (
                  <button 
                    onClick={() => {
                      setActiveMediaFilter("all");
                      setActiveAccuracyFilter("all");
                      setSelectedTag(null);
                      setSearchQuery("");
                      setOnlyFlagships(false);
                      updateUrl({ tag: null, q: "" });
                    }}
                    className="text-[9px] font-black uppercase tracking-widest text-brand-secondary hover:underline"
                  >
                    {dictionary.common.clearFilter}
                  </button>
                )}
              </div>

              {activeMood && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950 text-white text-[9px] font-black uppercase tracking-widest shadow-lg animate-in zoom-in-95 duration-300">
                    <span>{activeMood.icon} {activeMood.label}</span>
                    <button 
                      onClick={() => {
                        setSelectedTag(null);
                        updateUrl({ tag: null });
                      }}
                      aria-label={dictionary.common.clearFilter}
                      className="ml-1 p-0.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X size={10} strokeWidth={4} />
                    </button>
                  </div>
                  
                  {!searchQuery && (
                    <button 
                      onClick={() => {
                        setSelectedTag(null);
                        updateUrl({ tag: null });
                      }}
                      className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-600 transition-colors ml-1"
                    >
                      {dictionary.common.showAll}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {matchingDossier && (
            <section className="mb-10">
              <MediaDossierCard dossier={matchingDossier} />
            </section>
          )}

          {!searchQuery && !selectedTag && !showFilters && (
            <section className="mb-12">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                  <Layers size={12} className="text-brand-secondary" /> {dictionary.common.featuredDossiers}
                </h2>
              </div>
              <div className="space-y-4">
                {strongDossiers.slice(0, 3).map((dossier) => (
                  <MediaDossierCard key={dossier.slug} dossier={dossier} />
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 gap-6">
            {filteredCards.map((card) => (
              <HistoryCard key={card.id} card={card} />
            ))}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-16 px-8 animate-in fade-in zoom-in-95 duration-500">
               <h3 className="text-2xl font-serif mb-4 text-neutral-950">
                {dictionary.common.noResults}
               </h3>
               <button
                  onClick={() => {
                    setActiveMediaFilter("all");
                    setActiveAccuracyFilter("all");
                    setSelectedTag(null);
                    setSearchQuery("");
                    setOnlyFlagships(false);
                    setShowFilters(false);
                  }}
                  className="w-full py-5 rounded-3xl bg-neutral-950 text-white text-[11px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                >
                  {dictionary.common.resetFilters}
                </button>
                <MissingMediaRequest dictionary={dictionary} locale={locale} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExploreClient(props: ExploreClientProps) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ExploreContent {...props} />
    </Suspense>
  );
}
