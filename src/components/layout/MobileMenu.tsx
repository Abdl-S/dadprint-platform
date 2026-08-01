'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { mainNav } from '@/lib/constants';

/** Menu mobile plein écran — prioritaire puisque le site est pensé Mobile First. */
export function MobileMenu() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(true)} aria-label={t('openMenu')}>
        <Menu size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-paper p-6">
          <div className="flex justify-end">
            <button onClick={() => setOpen(false)} aria-label={t('closeMenu')}>
              <X size={26} />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-black"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
          <Button href="/devis" variant="magenta" size="lg" className="mt-auto w-full" onClick={() => setOpen(false)}>
            {t('commander')}
          </Button>
        </div>
      )}
    </div>
  );
}
