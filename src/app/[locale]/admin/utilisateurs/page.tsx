import { getAdminUsers } from '@/lib/data/admin';
import { AdminUtilisateursClient } from './AdminUtilisateursClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function AdminUtilisateursPage() {
  noStore();
  const initial = await getAdminUsers();
  return <AdminUtilisateursClient initial={initial} />;
}
