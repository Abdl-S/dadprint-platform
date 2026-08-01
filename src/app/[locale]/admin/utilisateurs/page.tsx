import { getAdminUsers } from '@/lib/data/admin';
import { AdminUtilisateursClient } from './AdminUtilisateursClient';

export default async function AdminUtilisateursPage() {
  const initial = await getAdminUsers();
  return <AdminUtilisateursClient initial={initial} />;
}
