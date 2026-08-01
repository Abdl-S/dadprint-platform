import { getCategories } from '@/lib/data/catalog';
import { AdminCategoriesClient } from './AdminCategoriesClient';

export default async function AdminCategoriesPage() {
  const initialCategories = await getCategories();
  return <AdminCategoriesClient initialCategories={initialCategories} />;
}
