import { getAdminReviews } from '@/lib/data/admin';
import { AdminAvisClient } from './AdminAvisClient';

export default async function AdminAvisPage() {
  const initial = await getAdminReviews();
  return <AdminAvisClient initial={initial} />;
}
