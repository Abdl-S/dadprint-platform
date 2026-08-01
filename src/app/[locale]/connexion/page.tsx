'use client';

import { Suspense, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { LogIn } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionPageContent />
    </Suspense>
  );
}

function ConnexionPageContent() {
  const t = useTranslations('authPage');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(t('loginError'));
      setLoading(false);
      return;
    }

    router.push(searchParams.get('next') || '/compte');
    router.refresh();
  }

  return (
    <Section className="pt-16">
      <Container className="max-w-sm">
        <LogIn size={28} className="text-brand-magenta" />
        <h1 className="mt-3 text-3xl font-black">{t('loginTitle')}</h1>
        <p className="mt-2 text-sm text-ink-70">{t('loginSubtitle')}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            required type="email" placeholder={t('email')} aria-label={t('email')}
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-ink-15 p-3 text-sm"
          />
          <input
            required type="password" placeholder={t('password')} aria-label={t('password')}
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-ink-15 p-3 text-sm"
          />

          {error && (
            <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>
          )}

          <Button type="submit" variant="magenta" size="lg" className="w-full" loading={loading} disabled={loading}>
            {t('loginCta')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-70">
          {t('noAccount')} <Link href="/inscription" className="font-bold text-brand-magenta hover:underline">{t('signupLink')}</Link>
        </p>
      </Container>
    </Section>
  );
}
