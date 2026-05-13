import { getCards, getRoutes } from "@/lib/get-content";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";
import RoutesClient from "@/components/pages/RoutesClient";

export default async function RoutesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const cards = await getCards(lang as Locale);
  const routes = await getRoutes(lang as Locale);
  const dictionary = await getDictionary(lang as Locale);

  return (
    <RoutesClient 
      routes={routes} 
      cards={cards} 
      locale={lang as Locale} 
      dictionary={dictionary} 
    />
  );
}
