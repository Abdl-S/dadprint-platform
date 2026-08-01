import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

// La racine "/" redirige toujours vers la langue par défaut ("/fr")
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
