import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/brand/Logo';

/**
 * 404 dans la langue courante — Next.js route ce fichier automatiquement
 * pour toute URL non trouvée sous /[locale]/*.
 */
export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <Section className="flex min-h-[70vh] items-center pt-12">
      <Container className="text-center">
        <Logo size="sm" href={null} />
        <p className="mt-8 font-mono text-sm font-bold text-brand-magenta">404</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">{t('title')}</h1>
        <p className="mx-auto mt-3 max-w-sm text-ink-70">{t('description')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="magenta">{t('ctaHome')}</Button>
          <Button href="/produits" variant="outline">{t('ctaCatalog')}</Button>
        </div>
      </Container>
    </Section>
  );
}
