'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown, Check } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeNames, type Locale } from '@/i18n/config';

/**
 * Changement de langue instantané : reste sur la même page, change seulement
 * la locale. Menu compact (une seule pastille visible) plutôt que les 3
 * langues affichées côte à côte en permanence — l'ancienne version
 * encombrait le header, surtout avec les autres icônes (téléphone,
 * WhatsApp, compte, notifications) déjà présentes.
 */
export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={localeNames[locale]}
        aria-expanded={open}
        className="flex h-10 items-center gap-1 rounded-full px-2.5 text-sm font-bold text-ink-70 transition-colors hover:bg-ink/5 hover:text-ink"
      >
        {locale.toUpperCase()}
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-lg border border-ink-8 bg-white shadow-card">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => { router.replace(pathname, { locale: l }); setOpen(false); }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-start text-sm font-semibold transition-colors hover:bg-ink-8/50 ${l === locale ? 'text-brand-magenta' : 'text-ink'}`}
            >
              {localeNames[l]}
              {l === locale && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
