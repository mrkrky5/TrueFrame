import { getCards } from "@/lib/get-content";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";
import SavedClient from "@/components/pages/SavedClient";

export default async function SavedPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const cards = await getCards(lang as Locale);
  const dictionary = await getDictionary(lang as Locale);

  return (
    <SavedClient 
      allCards={cards} 
      locale={lang as Locale} 
      dictionary={dictionary} 
    />
  );
}
