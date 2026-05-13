import { getCards, getRoutes } from "@/lib/get-content";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";
import HomeClient from "@/components/pages/HomeClient";
import { DictionaryProvider } from "@/components/utils/DictionaryProvider";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const cards = await getCards(lang as Locale);
  const routes = await getRoutes(lang as Locale);
  const dictionary = await getDictionary(lang as Locale);
  const globalDailyId = await import("@/lib/get-content").then(m => m.getGlobalDailyCardId());

  return (
    <DictionaryProvider dictionary={dictionary}>
      <HomeClient 
        cards={cards} 
        routes={routes} 
        locale={lang as Locale} 
        dictionary={dictionary} 
        globalDailyId={globalDailyId}
      />
    </DictionaryProvider>
  );
}
