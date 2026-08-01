'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Phone, User } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { NotificationBell } from './NotificationBell';
import { mainNav } from '@/lib/constants';
import { buildWhatsAppUrl, buildTelUrl } from '@/lib/whatsapp';
import { useAuth } from '@/lib/auth/context';
import { cn } from '@/lib/utils';

/**
 * Header Concept 4 — transparent au chargement, se transforme en verre
 * dépoli (glassmorphism) dès qu'on scrolle, jamais brutalement (transition
 * fluide sur l'opacité et l'ombre). Le logo transparent s'intègre aussi
 * bien sur le Hero qu'une fois le fond blanc apparu au scroll.
 */
export function Header() {
  const t = useTranslations('nav');
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 24); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 ease-premium',
        scrolled
          ? 'border-b border-ink-8 bg-paper/75 shadow-soft backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <Container className="flex h-20 items-center justify-between lg:h-24">
        <Logo size="lg" />

        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-ink-70 transition-colors hover:text-ink"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <NotificationBell />

          <a
            href={buildTelUrl()}
            aria-label={t('callShort')}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-70 transition-colors hover:bg-ink/5 hover:text-ink sm:flex"
          >
            <Phone size={17} />
          </a>
          <a
            href={buildWhatsAppUrl({ intent: 'general' })}
            target="_blank" rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-success transition-colors hover:bg-success/10 sm:flex"
          >
            <WhatsAppIcon size={18} />
          </a>

          {!loading && (
            <Link
              href={user ? '/compte' : '/connexion'}
              aria-label={t('compte')}
              className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-70 transition-colors hover:bg-ink/5 hover:text-ink sm:flex"
            >
              <User size={17} />
            </Link>
          )}

          <Button href="/devis" variant="magenta" size="sm" className="hidden sm:inline-flex">
            {t('requestQuote')}
          </Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
