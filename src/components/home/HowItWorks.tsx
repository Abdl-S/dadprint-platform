import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

/** Vraie séquence chronologique → la numérotation 01-04 encode une information réelle ici. */
export function HowItWorks() {
  const t = useTranslations('howItWorks');
  const steps = ['step1', 'step2', 'step3', 'step4'] as const;

  return (
    <Section className="bg-ink-8/40">
      <Container>
        <div className="mb-12 max-w-lg">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t('title')}</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((key, i) => (
            <div key={key} className="relative">
              <span className="font-mono text-sm font-bold text-brand-magenta">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-bold">{t(`${key}Title`)}</h3>
              <p className="mt-2 text-sm text-ink-70">{t(`${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
