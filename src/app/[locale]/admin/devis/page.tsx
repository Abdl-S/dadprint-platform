import { getAdminQuotes } from '@/lib/data/admin';
import { AdminDevisClient } from './AdminDevisClient';

export default async function AdminDevisPage() {
  const initial = await getAdminQuotes();
  return <AdminDevisClient initial={initial} />;
}
