'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeNames, type Locale } from '@/i18n/config';

/**
 * Changement de langue instantané : reste sur la même page, change seulement la locale.
 * Utilise useRouter/usePathname "conscients de la locale" (src/i18n/navigation.ts),
 * donc aucune logique de préservation d'URL à réécrire ici.
 */
export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-sm font-semibold">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          aria-current={l === locale}
          className={`rounded-sm px-2 py-1 transition-colors ${
            l === locale ? 'bg-ink text-paper' : 'text-ink-70 hover:bg-ink/5'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
      <span className="sr-only">{localeNames[locale]}</span>
    </div>
  );
}
