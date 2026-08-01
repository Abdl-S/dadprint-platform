import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export function WhyUs() {
  const t = useTranslations('whyUs');
  const points = ['point1', 'point2', 'point3', 'point4'] as const;

  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t('title')}</h2>
            <p className="mt-4 max-w-md text-ink-70">{t('description')}</p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {points.map((key, i) => (
              <li key={key} className="rounded-lg border border-ink-8 p-5">
                <span className="font-mono text-xs font-bold text-brand-cyan">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-2 font-bold">{t(key)}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
