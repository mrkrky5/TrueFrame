import { notFound } from "next/navigation";
import { getCards, getRoutes } from "@/lib/get-content";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";
import RouteDetailClient from "@/components/pages/RouteDetailClient";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string, id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const routes = await getRoutes(lang as Locale);
  const route = routes.find(r => r.id === id);
  const dictionary = await getDictionary(lang as Locale);

  if (!route) return {};

  const title = `${route.title} | ${dictionary.common.brandingTitle}`;
  const description = route.description || dictionary.common.dossierDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.baseUrl}/${lang}/routes/${id}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RouteDetailPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await params;
  const cards = await getCards(lang as Locale);
  const routes = await getRoutes(lang as Locale);
  const dictionary = await getDictionary(lang as Locale);

  const route = routes.find(r => r.id === id);

  if (!route) {
    notFound();
  }

  return (
    <RouteDetailClient 
      route={route} 
      allCards={cards} 
      locale={lang as Locale} 
      dictionary={dictionary} 
    />
  );
}
