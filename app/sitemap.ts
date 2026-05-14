import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { i18n, ENGLISH_PILOT_IDS } from '@/lib/i18n-config';
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
