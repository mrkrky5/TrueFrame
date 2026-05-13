import { getCards } from "@/lib/get-content";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";
import ExploreClient from "@/components/pages/ExploreClient";

export default async function ExplorePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const cards = await getCards(lang as Locale);
  const dictionary = await getDictionary(lang as Locale);

  return (
    <ExploreClient 
      cards={cards} 
      locale={lang as Locale} 
      dictionary={dictionary} 
    />
  );
}
