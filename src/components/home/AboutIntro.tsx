import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Logo } from '@/components/brand/Logo';

/** "Présentation de DadPrint" — qui nous sommes, en une respiration, avant les sections plus denses. */
export function AboutIntro() {
  const t = useTranslations('aboutIntro');

  return (
    <Section className="pb-0">
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Logo size="sm" href={null} />
          <p className="mt-6 font-sans text-xl font-semibold leading-relaxed sm:text-2xl">{t('statement')}</p>
          <p className="mt-4 font-sans text-ink-70">{t('description')}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
