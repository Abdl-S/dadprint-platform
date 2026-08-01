import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { products, categories, portfolioItems, clientCompanies } from '@/lib/mock/data';
import { packs } from '@/lib/mock/packs';
import { blogArticles } from '@/lib/mock/blog';

const staticRoutes = [
  '', '/produits', '/realisations', '/entreprises', '/a-propos', '/contact', '/devis',
  '/packs', '/demarrer', '/blog', '/avis', '/clients', '/faq', '/comment-ca-fonctionne',
  '/nos-services', '/suivi', '/confidentialite', '/conditions-generales',
];
const BASE_URL = 'https://dadprint.mr'; // TODO: confirmer le domaine définitif

/**
 * Sitemap multilingue et COMPLET : pages statiques + toutes les pages
 * dynamiques (produits, packs, réalisations, entreprises, articles de blog).
 * Ajouter un produit dans `lib/mock/data.ts` (puis, demain, dans Supabase)
 * l'ajoute automatiquement ici — jamais besoin de retoucher ce fichier.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const dynamicRoutes = [
    ...products.map((p) => `/produits/${p.slug}`),
    ...categories.map((c) => `/produits?categorie=${c.slug}`),
    ...packs.map((p) => `/packs/${p.slug}`),
    ...portfolioItems.map((p) => `/realisations/${p.id}`),
    ...clientCompanies.map((c) => `/clients/${c.slug}`),
    ...blogArticles.map((a) => `/blog/${a.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}${route}`])),
      },
    }))
  );
}
