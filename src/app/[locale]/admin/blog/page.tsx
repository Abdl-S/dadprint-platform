import { getAdminArticles } from '@/lib/data/admin';
import { AdminBlogClient } from './AdminBlogClient';

export default async function AdminBlogPage() {
  const initial = await getAdminArticles();
  return <AdminBlogClient initial={initial} />;
}
