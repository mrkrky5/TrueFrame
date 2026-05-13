import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { i18n } from '@/lib/i18n-config';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = i18n.locales;
  const baseUrl = SITE_CONFIG.baseUrl;

  const routes = ['', '/explore', '/routes', '/saved'];
  const staticUrls = locales.flatMap(locale => 
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  // Load cards for dynamic routes
  let cardUrls: any[] = [];
  try {
    const trCards = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/cards.tr.json'), 'utf8'));
    
    // TR Cards
    cardUrls = trCards.map((card: any) => ({
      url: `${baseUrl}/tr/card/${card.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // EN whitelisted cards only
    // In a real environment we would import ENGLISH_PILOT_IDS
    // Since this runs at build time, we can filter
    const ENGLISH_PILOT_IDS = [
      "oppenheimer-trinity", "shogun-edo", "assassins-creed-origins-medjay",
      "chernobyl-legasov", "gladiator-maximus", "1917-schofield",
      "ghost-of-tsushima-jin", "kingdom-come-henry", "rdr2-arthur", "vikings-ragnar"
    ];

    const enCardUrls = trCards
      .filter((c: any) => ENGLISH_PILOT_IDS.includes(c.id))
      .map((card: any) => ({
        url: `${baseUrl}/en/card/${card.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    
    cardUrls = [...cardUrls, ...enCardUrls];
  } catch (e) {
    console.error('Sitemap generation error:', e);
  }

  return [...staticUrls, ...cardUrls];
}
