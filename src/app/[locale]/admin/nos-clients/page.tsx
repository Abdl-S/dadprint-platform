import { unstable_noStore as noStore } from 'next/cache';
import { getAdminCompanies } from '@/lib/data/admin';
import { AdminNosClientsClient } from './AdminNosClientsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminNosClientsPage() {
  noStore();
  const initial = await getAdminCompanies();
  return <AdminNosClientsClient initial={initial} />;
}
