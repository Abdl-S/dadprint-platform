import { getPortfolioItems } from '@/lib/data/content';
import { getCategories } from '@/lib/data/catalog';
import { AdminPortfolioClient } from './AdminPortfolioClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function AdminPortfolioPage() {
  noStore();
  const [items, categories] = await Promise.all([getPortfolioItems(), getCategories()]);
  const initial = items.map((i) => ({ ...i, published: true }));
  return <AdminPortfolioClient initial={initial} categories={categories} />;
}
