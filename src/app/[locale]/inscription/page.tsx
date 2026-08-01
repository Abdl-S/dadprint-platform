'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

export default function InscriptionPage() {
  const t = useTranslations('authPage');
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      setError(signUpError.message.includes('already registered') ? t('emailTaken') : t('signupError'));
      setLoading(false);
      return;
    }

    // Complète le profil créé automatiquement par le déclencheur en base avec le téléphone
    if (data.user && phone) {
      await supabase.from('dp_profiles').update({ phone }).eq('id', data.user.id);
    }

    // Si la confirmation email est désactivée sur le projet, la session est immédiate
    if (data.session) {
      router.push('/compte');
      router.refresh();
    } else {
      setDone(true);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <Section className="pt-20 text-center">
        <Container className="max-w-sm">
          <CheckCircle2 size={32} className="mx-auto text-success" />
          <h1 className="mt-4 text-2xl font-black">{t('checkEmailTitle')}</h1>
          <p className="mt-3 text-ink-70">{t('checkEmailDesc')}</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="pt-16">
      <Container className="max-w-sm">
        <UserPlus size={28} className="text-brand-magenta" />
        <h1 className="mt-3 text-3xl font-black">{t('signupTitle')}</h1>
        <p className="mt-2 text-sm text-ink-70">{t('signupSubtitle')}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input required placeholder={t('fullName')} aria-label={t('fullName')} value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          <input required type="email" placeholder={t('email')} aria-label={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          <input required type="tel" placeholder={t('phone')} aria-label={t('phone')} value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border border-ink-15 p-3 text-sm" />
          <input required type="password" minLength={6} placeholder={t('password')} aria-label={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-ink-15 p-3 text-sm" />

          {error && (
            <p role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>
          )}

          <Button type="submit" variant="magenta" size="lg" className="w-full" loading={loading} disabled={loading}>
            {t('signupCta')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-70">
          {t('hasAccount')} <Link href="/connexion" className="font-bold text-brand-magenta hover:underline">{t('loginLink')}</Link>
        </p>
      </Container>
    </Section>
  );
}
