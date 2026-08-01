'use client';

import { Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { useTranslations } from 'next-intl';
import { buildWhatsAppUrl, buildTelUrl } from '@/lib/whatsapp';

/**
 * Actions flottantes globales, présentes sur toutes les pages :
 * WhatsApp (assistance générale) + Appel direct.
 * L'emplacement `data-ai-assistant-slot` réserve la place pour le futur
 * assistant IA sans le développer maintenant (demande explicite).
 */
export function FloatingActions() {
  const t = useTranslations('floating');

  return (
    <div className="fixed bottom-20 end-5 z-40 flex flex-col items-end gap-3 lg:bottom-5" data-ai-assistant-slot>
      <a
        href={buildTelUrl()}
        aria-label={t('call')}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper shadow-lg transition-transform hover:scale-105"
      >
        <Phone size={20} />
      </a>
      <a
        href={buildWhatsAppUrl({ intent: 'assistance' })}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('whatsapp')}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
      >
        <WhatsAppIcon size={26} />
      </a>
      {/* TODO (prochain prompt, hors admin) : bulle assistant IA viendra ici */}
    </div>
  );
}
