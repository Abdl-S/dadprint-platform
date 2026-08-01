import type { PricingMode } from '@/types';
import { useTranslations } from 'next-intl';

/**
 * Affichage du prix — un seul composant pour les 4 modes possibles,
 * pour ne jamais avoir un prix et un bouton incohérents entre eux (leçon apprise).
 */
export function PriceDisplay({
  mode, priceLabel, priceNote,
}: { mode: PricingMode; priceLabel?: string; priceNote?: string }) {
  const t = useTranslations('product');

  if (mode === 'hidden') return null;

  if (mode === 'fixed' && priceLabel) {
    return (
      <div>
        <span className="text-2xl font-black">{priceLabel}</span>
        {priceNote && <span className="ms-2 text-sm text-ink-40">{priceNote}</span>}
      </div>
    );
  }

  if (mode === 'from' && priceLabel) {
    return (
      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-ink-40">{t('from')}</span>
        <div className="text-2xl font-black">{priceLabel}</div>
        {priceNote && <span className="text-sm text-ink-40">{priceNote}</span>}
      </div>
    );
  }

  return <span className="text-lg font-bold text-brand-cyan">{t('quoteOnly')}</span>;
}

/** true si le mode implique de rediriger vers le devis plutôt que la commande directe. */
export function isQuoteFlow(mode: PricingMode): boolean {
  return mode === 'quote' || mode === 'hidden';
}
