import { getCategories, getProducts } from '@/lib/data/catalog';
import { ProduitsPageClient } from './ProduitsPageClient';

/**
 * Catalogue — données réelles depuis Supabase (dp_categories / dp_products).
 * L'UI de filtrage reste côté client dans ProduitsPageClient.
 */
export default async function ProduitsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return <ProduitsPageClient categories={categories} products={products} />;
}
