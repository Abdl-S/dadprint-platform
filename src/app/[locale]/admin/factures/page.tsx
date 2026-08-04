import { getAdminInvoices, getAdminOrders } from '@/lib/data/admin';
import { AdminFacturesClient } from './AdminFacturesClient';

/** Toujours interroger Supabase à la requête — jamais mis en cache comme page statique (sinon les modifications admin n'apparaîtraient qu'au prochain déploiement). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { unstable_noStore as noStore } from 'next/cache';


export default async function AdminFacturesPage() {
  noStore();
  const [initial, orders] = await Promise.all([getAdminInvoices(), getAdminOrders()]);
  return <AdminFacturesClient initial={initial} orders={orders} />;
}
