import { getProducts, getCategories } from '@/lib/data/catalog';
import { AdminProduitsClient } from './AdminProduitsClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


/**
 * `includeUnavailable = true` — l'équipe doit voir aussi les produits
 * désactivés (contrairement au catalogue public), pour pouvoir les
 * réactiver ou les modifier.
 */
export default async function AdminProduitsPage() {
  noStore();
  const [initialProducts, categories] = await Promise.all([
    getProducts(undefined, true),
    getCategories(),
  ]);
  return <AdminProduitsClient initialProducts={initialProducts} categories={categories} />;
}
