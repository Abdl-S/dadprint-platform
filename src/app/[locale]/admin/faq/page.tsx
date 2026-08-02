import { getFaq } from '@/lib/data/content';
import { AdminFaqClient } from './AdminFaqClient';

export default async function AdminFaqPage() {
  const initial = await getFaq();
  return <AdminFaqClient initial={initial} />;
}
