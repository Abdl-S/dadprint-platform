import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Search, FileUp, Send, CreditCard, PackageCheck, Star } from 'lucide-react';
import type { Locale } from '@/types';

export default async function CommentCaFonctionnePage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('howItWorksPage');

  const steps = [
    { key: 'discover', icon: Search },
    { key: 'customize', icon: FileUp },
    { key: 'quote', icon: Send },
    { key: 'pay', icon: CreditCard },
    { key: 'track', icon: PackageCheck },
    { key: 'review', icon: Star },
  ] as const;

  return (
    <Section className="pt-12">
      <Container className="max-w-3xl">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">{t('title')}</h1>
        <p className="mt-5 text-lg text-ink-70">{t('subtitle')}</p>

        <ol className="mt-12 space-y-8">
          {steps.map(({ key, icon: Icon }, i) => (
            <li key={key} className="flex gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                <Icon size={19} />
              </div>
              <div className="pt-1.5">
                <span className="font-mono text-xs font-bold text-brand-magenta">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-1 text-lg font-bold">{t(`${key}Title`)}</h3>
                <p className="mt-1.5 text-sm text-ink-70">{t(`${key}Desc`)}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <Button href="/produits" variant="magenta" size="lg">{t('cta')}</Button>
        </div>
      </Container>
    </Section>
  );
}
