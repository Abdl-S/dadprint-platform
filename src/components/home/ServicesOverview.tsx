import { useTranslations } from 'next-intl';
import { PenTool, Printer, Truck, HeartHandshake } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Link } from '@/i18n/navigation';

/**
 * "Nos services" — les 4 grands piliers de l'activité (distinct du catalogue
 * produits) : c'est le message "Nous créons. Nous imprimons. Nous livrons.
 * Nous accompagnons." rendu visuellement.
 */
export function ServicesOverview() {
  const t = useTranslations('servicesOverview');
  const pillars = [
    { key: 'design', icon: PenTool },
    { key: 'print', icon: Printer },
    { key: 'delivery', icon: Truck },
    { key: 'support', icon: HeartHandshake },
  ] as const;

  return (
    <Section>
      <Container>
        <Reveal className="mb-10 max-w-lg">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-magenta">{t('eyebrow')}</span>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t('title')}</h2>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ key, icon: Icon }, i) => (
            <Reveal key={key} delay={i * 80}>
              <Link href="/nos-services" className="group block h-full rounded-lg border border-ink-8 p-6 transition-colors hover:border-ink">
                <Icon size={26} className="text-brand-magenta" />
                <h3 className="mt-4 font-bold">{t(`${key}Title`)}</h3>
                <p className="mt-2 text-sm text-ink-70">{t(`${key}Desc`)}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
