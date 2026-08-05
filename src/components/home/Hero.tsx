'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * Hero — diaporama plein écran (option "A" validée par le client), avec de
 * vraies photos produits en fond (choisies côté page d'accueil, différentes
 * à chaque chargement — voir `page.tsx`). Le texte reste fixe par-dessus,
 * un dégradé sombre garde la lisibilité quelle que soit la photo affichée.
 *
 * ⚠️ Les chiffres de `home.stats` (commandes livrées, délai moyen, note de
 * satisfaction) sont des EXEMPLES à remplacer par les vraies statistiques de
 * DadPrint avant mise en ligne — jamais publier des chiffres inventés.
 */
export function Hero({ collageImages }: { collageImages: { url: string; alt: string }[] }) {
  const t = useTranslations('home');
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (collageImages.length <= 1) return;
    const interval = setInterval(() => setActive((i) => (i + 1) % collageImages.length), 4500);
    return () => clearInterval(interval);
  }, [collageImages.length]);

  return (
    <section className="relative h-[560px] overflow-hidden sm:h-[640px]">
      {collageImages.map((img, i) => (
        <div key={img.url} className={`absolute inset-0 transition-opacity duration-1000 ease-premium ${i === active ? 'opacity-100' : 'opacity-0'}`}>
          <Image src={img.url} alt={img.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-ink/10" />
        </div>
      ))}

      <Container className="relative z-10 flex h-full items-center">
        <div className="max-w-xl text-paper">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-yellow">DadPrint — Nouakchott</span>
          <h1 className="mt-3 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.6rem]">
            {t('heroLine1')} <span className="text-brand-magenta">{t('heroHighlight')}</span><br />
            {t('heroLine2')}
          </h1>
          <p className="mt-6 max-w-md text-lg text-paper/85">{t('heroSubtitle')}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={buildWhatsAppUrl({ intent: 'general' })} variant="magenta" size="lg">
              {t('ctaWhatsapp')}
            </Button>
            <Button href="/realisations" variant="outline" size="lg" className="border-paper/40 text-paper hover:bg-paper/10">
              {t('ctaSecondary')}
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <div className="text-3xl font-black">{t('stats.ordersValue')}</div>
              <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-wide text-paper/50">{t('stats.ordersLabel')}</div>
            </div>
            <div>
              <div className="text-3xl font-black">{t('stats.delayValue')}</div>
              <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-wide text-paper/50">{t('stats.delayLabel')}</div>
            </div>
            <div>
              <div className="text-3xl font-black">{t('stats.satisfactionValue')}</div>
              <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-wide text-paper/50">{t('stats.satisfactionLabel')}</div>
            </div>
          </div>
        </div>
      </Container>

      {collageImages.length > 1 && (
        <div className="absolute bottom-7 start-6 z-10 flex gap-2 sm:start-10">
          {collageImages.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${i === active ? 'w-7 bg-brand-yellow' : 'w-3.5 bg-paper/35'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
