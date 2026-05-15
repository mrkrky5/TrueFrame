import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { i18n, ENGLISH_ACTIVE_IDS } from '@/lib/i18n-config';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = i18n.locales;
  const baseUrl = SITE_CONFIG.baseUrl;

  const routes = ['', '/explore', '/routes', '/saved'];
  
  // Static Routes
  const staticUrls = locales.flatMap(locale => 
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  let dynamicUrls: any[] = [];

  try {
    const trCards = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/cards.tr.json'), 'utf8'));
    const enCards = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/cards.en.json'), 'utf8'));
    const { getStrongDossiers } = require('@/utils/dossier');

    // TR Cards
    const trCardUrls = trCards.map((card: any) => ({
      url: `${baseUrl}/tr/card/${card.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // TR Dossiers
    const trDossiers = getStrongDossiers(trCards);
    const trMediaUrls = trDossiers.map((d: any) => ({
      url: `${baseUrl}/tr/media/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // EN Active Cards
    const enActiveCards = enCards.filter((c: any) => ENGLISH_ACTIVE_IDS.includes(c.id));
    const enCardUrls = enActiveCards.map((card: any) => ({
      url: `${baseUrl}/en/card/${card.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // EN Dossiers
    const enDossiers = getStrongDossiers(enActiveCards);
    const enMediaUrls = enDossiers.map((d: any) => ({
      url: `${baseUrl}/en/media/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    dynamicUrls = [...trCardUrls, ...trMediaUrls, ...enCardUrls, ...enMediaUrls];
  } catch (e) {
    console.error('Sitemap dynamic generation error:', e);
  }

  return [...staticUrls, ...dynamicUrls];
}
