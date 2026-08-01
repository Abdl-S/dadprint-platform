import { useTranslations } from 'next-intl';
import { Instagram, Facebook, Lock } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/navigation';
import { mainNav } from '@/lib/constants';
import { paymentProviders } from '@/lib/payment-providers';
import { CALL_NUMBER } from '@/lib/whatsapp';
import { NewsletterForm } from './NewsletterForm';

const usefulLinks = [
  { href: '/comment-ca-fonctionne', labelKey: 'howItWorks' as const },
  { href: '/nos-services', labelKey: 'ourServices' as const },
  { href: '/demarrer', labelKey: 'wizard' as const },
  { href: '/blog', labelKey: 'blog' as const },
  { href: '/suivi', labelKey: 'tracking' as const },
  { href: '/faq', labelKey: 'faq' as const },
  { href: '/avis', labelKey: 'reviews' as const },
];

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/8 bg-ink text-paper/70">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo size="sm" href={null} />
            <p className="mt-4 max-w-xs text-sm text-paper/60">{t('tagline')}</p>
            <div className="mt-5 flex gap-2.5">
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15">
                <Instagram size={15} />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15">
                <Facebook size={15} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-paper">{t('navTitle')}</h4>
            <ul className="space-y-2.5 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper/60 hover:text-paper">
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-paper">{t('usefulTitle')}</h4>
            <ul className="space-y-2.5 text-sm">
              {usefulLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper/60 hover:text-paper">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-paper">{t('contactTitle')}</h4>
            <ul className="space-y-2.5 text-sm text-paper/60">
              <li>{CALL_NUMBER}</li>
              <li>contact@dadprint.mr</li>
              <li>Nouakchott, Mauritanie</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {paymentProviders.filter((p) => p.enabled).map((p) => (
                <span key={p.id} className="rounded-sm bg-paper/10 px-2.5 py-1 text-xs font-semibold">
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter — emplacement prêt, branchement (Supabase ou service tiers) à venir */}
        <div className="mt-12 flex flex-col gap-3 border-t border-paper/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-bold text-paper">{t('newsletterTitle')}</h4>
            <p className="text-xs text-paper/50">{t('newsletterDesc')}</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-paper/10 pt-6 font-mono text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} DadPrint — {t('rights')}</span>
          <div className="flex items-center gap-4">
            <Link href="/confidentialite" className="hover:text-paper/70">{t('privacy')}</Link>
            <Link href="/conditions-generales" className="hover:text-paper/70">{t('terms')}</Link>
            <Link href="/admin" className="text-paper/25 hover:text-paper/60" aria-label="Espace administration" title="Espace administration">
              <Lock size={12} />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
