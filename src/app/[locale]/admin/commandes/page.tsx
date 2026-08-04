import { getAdminOrders, getOrderStatuses } from '@/lib/data/admin';
import { AdminCommandesClient } from './AdminCommandesClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function AdminCommandesPage() {
  noStore();
  const [initial, orderStatuses] = await Promise.all([getAdminOrders(), getOrderStatuses()]);
  return <AdminCommandesClient initial={initial} orderStatuses={orderStatuses} />;
}
