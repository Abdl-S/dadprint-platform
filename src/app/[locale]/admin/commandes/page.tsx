import { getAdminOrders, getOrderStatuses } from '@/lib/data/admin';
import { AdminCommandesClient } from './AdminCommandesClient';

export default async function AdminCommandesPage() {
  const [initial, orderStatuses] = await Promise.all([getAdminOrders(), getOrderStatuses()]);
  return <AdminCommandesClient initial={initial} orderStatuses={orderStatuses} />;
}
