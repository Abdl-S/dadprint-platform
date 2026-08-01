'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Bouton d'installation natif (Android / Windows / macOS via Chrome, Edge).
 * N'apparaît QUE quand le navigateur signale que l'app est installable
 * (événement `beforeinstallprompt`) — jamais affiché sur iOS (Safari ne
 * déclenche pas cet événement ; l'installation s'y fait via "Partager →
 * Sur l'écran d'accueil", expliqué ailleurs pour ces visiteurs).
 */
export function InstallPrompt() {
  const t = useTranslations('pwa');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function install() {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  return (
    <div className="fixed inset-x-4 bottom-24 z-40 flex items-center justify-between gap-3 rounded-lg bg-ink px-4 py-3 text-paper shadow-xl sm:inset-x-auto sm:start-5 sm:max-w-xs">
      <div className="flex items-center gap-3">
        <Download size={20} className="shrink-0 text-brand-yellow" />
        <p className="text-xs font-semibold">{t('installMessage')}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button onClick={install} className="rounded-sm bg-brand-magenta px-3 py-1.5 text-xs font-bold">
          {t('install')}
        </button>
        <button onClick={() => setDismissed(true)} aria-label={t('dismiss')}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
