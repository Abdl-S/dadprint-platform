import { Phone, FileText, ShoppingBag } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { buildWhatsAppUrl, buildTelUrl } from '@/lib/whatsapp';

/**
 * Barre d'actions permanente — mobile uniquement (le desktop a déjà ces 4
 * actions accessibles dans le header + les bulles flottantes). Toujours les
 * 4 mêmes actions demandées : Appeler, WhatsApp, Devis, Commander — jamais
 * cachée, jamais remplacée par autre chose.
 */
export function StickyMobileActionBar() {
  const t = useTranslations('nav');
  const itemClasses = 'flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-ink-70';

  return (
    <nav
      aria-label={t('quickActions')}
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-ink-8 bg-paper/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <a href={buildTelUrl()} className={itemClasses}>
        <Phone size={19} />
        {t('callShort')}
      </a>
      <a href={buildWhatsAppUrl({ intent: 'general' })} target="_blank" rel="noopener noreferrer" className={itemClasses}>
        <WhatsAppIcon size={19} />
        WhatsApp
      </a>
      <Link href="/devis" className={itemClasses}>
        <FileText size={19} />
        {t('devis')}
      </Link>
      <Link href="/produits" className={itemClasses}>
        <ShoppingBag size={19} />
        {t('commander')}
      </Link>
    </nav>
  );
}
