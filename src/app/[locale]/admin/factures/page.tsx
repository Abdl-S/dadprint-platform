import { getAdminInvoices, getAdminOrders } from '@/lib/data/admin';
import { AdminFacturesClient } from './AdminFacturesClient';

export default async function AdminFacturesPage() {
  const [initial, orders] = await Promise.all([getAdminInvoices(), getAdminOrders()]);
  return <AdminFacturesClient initial={initial} orders={orders} />;
}
