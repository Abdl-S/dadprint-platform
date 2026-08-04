import { Suspense } from 'react';
import { getAdminQuotes } from '@/lib/data/admin';
import { AdminDevisClient } from './AdminDevisClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function AdminDevisPage() {
  noStore();
  const initial = await getAdminQuotes();
  return (
    <Suspense fallback={null}>
      <AdminDevisClient initial={initial} />
    </Suspense>
  );
}
