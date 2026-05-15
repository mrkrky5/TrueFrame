import { getCards } from "@/lib/get-content";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";
import CardClient from "@/components/pages/CardClient";
import { notFound } from "next/navigation";
import { HistoryCard } from "@/types";

import { DictionaryProvider } from "@/components/utils/DictionaryProvider";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string, id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const cards = await getCards(lang as Locale);
  const ALIAS_MAP: Record<string, string> = {
    "ac-mirage-baghdad": "house-wisdom-baghdad",
    "crown-aberfan": "the-crown-aberfan-tragedy-real",
    "crown-suez-crisis": "the-crown-suez-crisis-empire-end",
    "oppenheimer-hearing-1954": "oppenheimer-gray-board-1954-real",
    "oppenheimer-downwinders": "oppenheimer-rad-downwinders",
    "mafia-rico-law": "mafia-rico-law-impact-real",
    "mafia-immigration": "mafia-immigration-crime",
    "rome-collapse-attila": "total-war-attila-collapse",
    "constantinople-1453": "constantinople-fall-turning-new",
    "mesopotamia-banking": "mesopotamian-markets-new",
    "mongol-yam-system": "aoe4-mongol-logistics",
    "medieval-castles-power": "aoe2-castles-politics",
    "medieval-justice-kcd": "kcd2-medieval-law",
    "last-emperor-eunuchs": "last-emperor-forbidden-city-eunuchs-real",
    "crown-empire-transition": "crown-commonwealth-empire",
    "last-samurai-satsuma": "last-samurai-rebellion",
    "chernobyl-pripyat-evacuation-real": "chernobyl-pripyat-delay"
  };
  const actualId = ALIAS_MAP[id] || id;
  const card = cards.find((c) => c.id === actualId);
  const dictionary = await getDictionary(lang as Locale);

  if (!card) return {};

  const title = `${card.title} | ${dictionary.common.brandingTitle}`;
  const description = card.quickRealityCheck || card.subtitle || dictionary.common.dossierDescription;
  const rawOgImage = card.images?.hero?.src || card.images?.thumbnail?.src || "/og-image.png";
  const ogImage = rawOgImage.startsWith("/") ? `${SITE_CONFIG.baseUrl}${rawOgImage}` : rawOgImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_CONFIG.baseUrl}/${lang}/card/${id}`,
      images: [{ url: ogImage.startsWith("/") ? `${SITE_CONFIG.baseUrl}${ogImage}` : ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function HistoryCardDetailPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await params;
  const cards = await getCards(lang as Locale);
  const ALIAS_MAP: Record<string, string> = {
    "ac-mirage-baghdad": "house-wisdom-baghdad",
    "crown-aberfan": "the-crown-aberfan-tragedy-real",
    "crown-suez-crisis": "the-crown-suez-crisis-empire-end",
    "oppenheimer-hearing-1954": "oppenheimer-gray-board-1954-real",
    "oppenheimer-downwinders": "oppenheimer-rad-downwinders",
    "mafia-rico-law": "mafia-rico-law-impact-real",
    "mafia-immigration": "mafia-immigration-crime",
    "rome-collapse-attila": "total-war-attila-collapse",
    "constantinople-1453": "constantinople-fall-turning-new",
    "mesopotamia-banking": "mesopotamian-markets-new",
    "mongol-yam-system": "aoe4-mongol-logistics",
    "medieval-castles-power": "aoe2-castles-politics",
    "medieval-justice-kcd": "kcd2-medieval-law",
    "last-emperor-eunuchs": "last-emperor-forbidden-city-eunuchs-real",
    "crown-empire-transition": "crown-commonwealth-empire",
    "last-samurai-satsuma": "last-samurai-rebellion",
    "chernobyl-pripyat-evacuation-real": "chernobyl-pripyat-delay"
  };

  const actualId = ALIAS_MAP[id] || id;
  const card = cards.find((c) => c.id === actualId);
  const dictionary = await getDictionary(lang as Locale);

  if (!card) {
    notFound();
  }

  // If we found the card via an alias, we could redirect, but since this is a server component 
  // and we want to be surgical, just loading the correct card is safer than a full redirect loop.
  // However, for SEO/Canonical reasons, a redirect is better.
  // Given the requirement "Avoid fragile browser-only logic", a server-side logic is good.
  
  // Let's stick to just loading the card to avoid extra roundtrips unless explicitly asked for 301.
  // Actually, let's keep it simple.

  return (
    <DictionaryProvider dictionary={dictionary}>
      <CardClient 
        card={card} 
        allCards={cards} 
        locale={lang as Locale} 
        dictionary={dictionary} 
      />
    </DictionaryProvider>
  );
}
