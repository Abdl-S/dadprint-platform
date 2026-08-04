import { Suspense } from 'react';
import { getCategories, getProducts } from '@/lib/data/catalog';
import { ProduitsPageClient } from './ProduitsPageClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


/**
 * Catalogue — données réelles depuis Supabase (dp_categories / dp_products).
 * L'UI de filtrage reste côté client dans ProduitsPageClient.
 */
export default async function ProduitsPage() {
  noStore();
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <Suspense fallback={null}>
      <ProduitsPageClient categories={categories} products={products} />
    </Suspense>
  );
}
