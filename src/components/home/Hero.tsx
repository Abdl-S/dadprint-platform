import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * Hero — reproduit la direction validée par le client : titre XXL avec un mot
 * mis en évidence, collage photo + carte "Palette du projet" flottante,
 * barre de statistiques sous les CTA.
 *
 * ⚠️ Les chiffres de `home.stats` (commandes livrées, délai moyen, note de
 * satisfaction) sont des EXEMPLES à remplacer par les vraies statistiques de
 * DadPrint avant mise en ligne — jamais publier des chiffres inventés.
 */
export function Hero() {
  const t = useTranslations('home');

  return (
    <Section className="pt-10 sm:pt-14">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-5xl leading-[1.05] sm:text-6xl lg:text-[4.2rem]">
              {t('heroLine1')} <span className="text-brand-magenta">{t('heroHighlight')}</span><br />
              {t('heroLine2')}
            </h1>
            <p className="mt-7 max-w-lg text-lg text-ink-70">{t('heroSubtitle')}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={buildWhatsAppUrl({ intent: 'general' })} variant="magenta" size="lg">
                {t('ctaWhatsapp')}
              </Button>
              <Button href="/realisations" variant="outline" size="lg">
                {t('ctaSecondary')}
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <div className="text-3xl font-black">{t('stats.ordersValue')}</div>
                <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-wide text-ink-40">{t('stats.ordersLabel')}</div>
              </div>
              <div>
                <div className="text-3xl font-black">{t('stats.delayValue')}</div>
                <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-wide text-ink-40">{t('stats.delayLabel')}</div>
              </div>
              <div>
                <div className="text-3xl font-black">{t('stats.satisfactionValue')}</div>
                <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-wide text-ink-40">{t('stats.satisfactionLabel')}</div>
              </div>
            </div>
          </div>

          {/* Collage — mockups produits variés (cartes, textile, mugs) + carte "Palette du projet" flottante */}
          <div className="relative hidden h-[500px] sm:block">
            <div className="absolute right-0 top-0 w-[58%] overflow-hidden rounded-xl border-4 border-white shadow-raised">
              <Image src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80" alt="Cartes de visite premium DadPrint" width={800} height={600} priority className="aspect-[4/3] w-full object-cover" />
            </div>

            <div className="absolute left-0 top-[10%] w-[42%] overflow-hidden rounded-xl border-4 border-white shadow-raised">
              <Image src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" alt="T-shirt personnalisé DadPrint" width={600} height={720} className="aspect-[5/6] w-full object-cover" />
            </div>

            <div className="absolute left-[6%] bottom-0 w-[36%] overflow-hidden rounded-xl border-4 border-white shadow-raised">
              <Image src="https://images.unsplash.com/photo-1571907480495-4b26a4f1c1c9?w=600&q=80" alt="Mug personnalisé DadPrint" width={600} height={600} className="aspect-square w-full object-cover" />
            </div>

            <div className="absolute bottom-[4%] right-[2%] w-[44%] overflow-hidden rounded-xl border-4 border-white shadow-raised">
              <Image src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=700&q=80" alt="Roll-up et signalétique DadPrint" width={700} height={700} className="aspect-square w-full object-cover" />
            </div>

            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-1.5 rounded-full bg-white p-2 shadow-card">
              <span className="h-3 w-3 rounded-full" style={{ background: 'var(--color-magenta)' }} />
              <span className="h-3 w-3 rounded-full" style={{ background: 'var(--color-cyan)' }} />
              <span className="h-3 w-3 rounded-full" style={{ background: 'var(--color-yellow)' }} />
              <span className="h-3 w-3 rounded-full bg-ink" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
