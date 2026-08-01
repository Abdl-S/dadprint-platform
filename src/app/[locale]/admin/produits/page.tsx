import { getProducts, getCategories } from '@/lib/data/catalog';
import { AdminProduitsClient } from './AdminProduitsClient';

/**
 * `includeUnavailable = true` — l'équipe doit voir aussi les produits
 * désactivés (contrairement au catalogue public), pour pouvoir les
 * réactiver ou les modifier.
 */
export default async function AdminProduitsPage() {
  const [initialProducts, categories] = await Promise.all([
    getProducts(undefined, true),
    getCategories(),
  ]);
  return <AdminProduitsClient initialProducts={initialProducts} categories={categories} />;
}
