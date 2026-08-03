'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

/**
 * Bouton flottant "Commander" — le formulaire de commande peut être long
 * (6-8 champs selon le produit), donc le vrai bouton d'envoi finit loin en
 * bas de page, surtout sur mobile. Ce bouton reste visible tant que le
 * formulaire n'est pas encore à l'écran, et disparaît dès qu'il l'est —
 * jamais superposé au vrai bouton une fois qu'on y est.
 */
export function ScrollToOrderButton({ targetId }: { targetId: string }) {
  const t = useTranslations('product');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '-40% 0px -40% 0px' } // se cache dès que le formulaire approche du centre de l'écran
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  if (!visible) return null;

  return (
    <button
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      className="fixed bottom-20 start-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-paper shadow-raised transition-transform hover:-translate-y-0.5 lg:bottom-8"
    >
      {t('scrollToOrder')}
      <ChevronDown size={16} className="animate-bounce" />
    </button>
  );
}
