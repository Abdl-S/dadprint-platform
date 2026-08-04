import { getCategories } from '@/lib/data/catalog';
import { AdminCategoriesClient } from './AdminCategoriesClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function AdminCategoriesPage() {
  noStore();
  const initialCategories = await getCategories();
  return <AdminCategoriesClient initialCategories={initialCategories} />;
}
