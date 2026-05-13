import { notFound } from "next/navigation";
import { getCards } from "@/lib/get-content";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";
import { getDossierBySlug } from "@/utils/dossier";
import MediaDossierClient from "@/components/pages/MediaDossierClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const cards = await getCards(lang as Locale);
  const dossier = getDossierBySlug(cards, slug);
  const dictionary = await getDictionary(lang as Locale);

  if (!dossier) return {};

  const title = `${dossier.title} | ${dictionary.common.brandingTitle}`;
  const description = dictionary.common.dossierDescription;
  
  // Use first card's hero as OG image if available
  const firstCardId = dossier.cardIds[0];
  const firstCard = cards.find(c => c.id === firstCardId);
  const ogImage = firstCard?.images?.hero?.src || firstCard?.images?.thumbnail?.src || "/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://medyadangercege.com/${lang}/media/${slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function MediaDossierPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const { lang, slug } = await params;
  const cards = await getCards(lang as Locale);
  const dossier = getDossierBySlug(cards, slug);
  const dictionary = await getDictionary(lang as Locale);

  if (!dossier) {
    // Fallback for legacy/mangled slugs
    if (slug === "shgun") {
      const fallbackDossier = getDossierBySlug(cards, "shogun");
      if (fallbackDossier) {
        return (
          <MediaDossierClient 
            initialDossier={fallbackDossier} 
            allCards={cards} 
            locale={lang as Locale} 
            dictionary={dictionary} 
          />
        );
      }
    }
    notFound();
  }

  return (
    <MediaDossierClient 
      initialDossier={dossier} 
      allCards={cards} 
      locale={lang as Locale} 
      dictionary={dictionary} 
    />
  );
}
