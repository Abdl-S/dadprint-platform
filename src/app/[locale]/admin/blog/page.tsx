import { getAdminArticles } from '@/lib/data/admin';
import { AdminBlogClient } from './AdminBlogClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function AdminBlogPage() {
  noStore();
  const initial = await getAdminArticles();
  return <AdminBlogClient initial={initial} />;
}
