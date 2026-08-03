import { Suspense } from 'react';
import { getAdminQuotes } from '@/lib/data/admin';
import { AdminDevisClient } from './AdminDevisClient';

export default async function AdminDevisPage() {
  const initial = await getAdminQuotes();
  return (
    <Suspense fallback={null}>
      <AdminDevisClient initial={initial} />
    </Suspense>
  );
}
