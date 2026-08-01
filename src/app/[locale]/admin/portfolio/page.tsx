import { getPortfolioItems } from '@/lib/data/content';
import { getCategories } from '@/lib/data/catalog';
import { AdminPortfolioClient } from './AdminPortfolioClient';

export default async function AdminPortfolioPage() {
  const [items, categories] = await Promise.all([getPortfolioItems(), getCategories()]);
  const initial = items.map((i) => ({ ...i, published: true }));
  return <AdminPortfolioClient initial={initial} categories={categories} />;
}
