import { getFaq } from '@/lib/data/content';
import { FaqPageClient } from './FaqPageClient';

export default async function FaqPage() {
  const faq = await getFaq();
  return <FaqPageClient faq={faq} />;
}
