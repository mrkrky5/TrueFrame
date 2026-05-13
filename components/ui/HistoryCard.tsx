"use client";
import Link from "next/link";
import Image from "next/image";
import { HistoryCard as IHistoryCard } from "@/types";
import { Clock, ImageIcon } from "lucide-react";
import { formatMediaType, formatTag, formatMediaTitle } from "@/utils/format";
import { getDossierSlug } from "@/utils/dossier";
import { useLocale } from "@/hooks/useLocale";
import { useDictionary } from "@/components/utils/DictionaryProvider";

interface Props {
  card: IHistoryCard;
  variant?: "full" | "compact";
  className?: string;
  theme?: "light" | "dark";
}

const HistoryCard = ({ card, variant = "full", className = "", theme = "light" }: Props) => {
  const locale = useLocale();
  const dictionary = useDictionary();
  const hasThumbnail = card.images?.thumbnail;
  const dossierSlug = getDossierSlug(card.mediaTitle);
  const isDarkBackground = theme === "dark";

  return (
    <div className={`group relative ${className}`}>
      {/* Media Tag Link (Separate from main card link) */}
      <div className="absolute top-5 left-6 z-30 flex items-center gap-2 pointer-events-auto pr-6 w-full">
        {dossierSlug ? (
          <Link
            href={`/${locale}/media/${dossierSlug}`}
            className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-secondary hover:text-neutral-900 transition-colors truncate max-w-[80%]"
            onClick={(e) => e.stopPropagation()}
            title={`${formatMediaType(card.mediaType, dictionary)} • ${formatMediaTitle(card.mediaTitle)}`}
          >
            {dictionary.common.mediaTypes?.[card.mediaType]?.toUpperCase()} • {formatMediaTitle(card.mediaTitle)}
          </Link>
        ) : (
          <span 
            className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-secondary truncate max-w-[80%]"
            title={`${dictionary.common.mediaTypes?.[card.mediaType]?.toUpperCase()} • ${formatMediaTitle(card.mediaTitle)}`}
          >
            {dictionary.common.mediaTypes?.[card.mediaType]?.toUpperCase()} • {formatMediaTitle(card.mediaTitle)}
          </span>
        )}
      </div>

      <Link href={`/${locale}/card/${card.id}`} className="block">
        <div 
          className={`card-premium relative transition-all duration-300 hover:shadow-md overflow-hidden ${className.includes('bg-') ? '' : 'bg-white'} ${variant === "full" ? "p-0" : "p-3 flex gap-3"}`}
          style={isDarkBackground ? { backgroundColor: '#262626' } : {}}
        >
          
          {/* Full Variant Image Header */}
          {variant === "full" && hasThumbnail && (
            <div className="relative w-full h-32 bg-neutral-100 overflow-hidden border-b border-black/5">
              <Image 
                src={card.images!.thumbnail!.src} 
                alt={card.images!.thumbnail!.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 512px) 100vw, 512px"
              />
              {/* Type Badge on Image */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-neutral-600 shadow-sm border border-white/20 flex items-center gap-1">
                <ImageIcon size={8} /> {card.images!.thumbnail!.type === 'historical' ? dictionary.common.historicalImage : dictionary.common.representativeImage}
              </div>
            </div>
          )}

          <div className={variant === "full" ? "p-5" : "flex-1 min-w-0"}>
            <div className={`flex items-center justify-between mb-3 ${variant === "full" ? "mt-2" : "mt-6"}`}>
              <div className="flex items-center gap-2">
                {/* Spacer for the absolute positioned media tag link above */}
                <div className="h-4" />
                {card.spoilerLevel === "major" && (
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" title={dictionary.common.spoilerTitle} />
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {card.isFlagship && (
                  <span className="bg-neutral-950 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-sm border border-white/10">
                    {dictionary.common.flagship}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1 min-w-0">
                <h3 className={`font-serif leading-tight group-active:text-brand-secondary transition-colors ${variant === "full" ? "text-xl" : "text-base truncate"} ${isDarkBackground ? "text-white" : "text-neutral-950"}`}>
                  {card.title}
                </h3>
                <p className={`text-sm mt-1 leading-relaxed ${variant === "full" ? "line-clamp-2" : "line-clamp-1"} ${isDarkBackground ? "text-white/60" : "text-neutral-600"}`}>
                  {card.subtitle}
                </p>
              </div>

              {/* Compact Variant Thumbnail */}
              {variant === "compact" && hasThumbnail && (
                <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-neutral-100 border border-black/5">
                  <Image 
                    src={card.images!.thumbnail!.src} 
                    alt={card.images!.thumbnail!.alt}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
            </div>

            <div className={`flex items-center justify-between mt-5 pt-4 border-t ${isDarkBackground ? "border-white/10" : "border-black/5"} ${variant === "compact" ? "hidden" : ""}`}>
              <div className="flex gap-1.5">
                {card.themes.slice(0, 2).map((theme) => (
                  <span key={theme} className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border truncate max-w-[100px] ${isDarkBackground ? "bg-white/5 text-neutral-400 border-white/5" : "bg-neutral-50 text-neutral-500 border-neutral-100"}`}>
                    {formatTag(theme, dictionary)}
                  </span>
                ))}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isDarkBackground ? "text-white" : "text-neutral-800"}`}>
                <Clock size={12} strokeWidth={2.5} /> {card.readingTimeMinutes} {dictionary.common.minutes?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HistoryCard;
