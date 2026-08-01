'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  User, FileText, CreditCard, FolderOpen, Palette, Heart, Star, MapPin, Bell,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { RatingStars } from '@/components/ui/RatingStars';
import { invoices, clientFiles, brandKits, clientNotifications, deliveryAddresses } from '@/lib/mock/account';
import { products, testimonials } from '@/lib/mock/data';
import { useFavorites } from '@/lib/favorites/context';
import { useAuth } from '@/lib/auth/context';
import type { Locale } from '@/types';
import type { MyOrder } from '@/lib/data/content';

type Tab = 'profil' | 'devis' | 'paiements' | 'fichiers' | 'marques' | 'favoris' | 'avis' | 'adresses' | 'notifications';

/**
 * Tableau de bord client — un seul espace, plusieurs sections, plutôt que
 * dix routes séparées. Toutes les données sont d'exemple (`lib/mock/`) et
 * prêtes à être remplacées par de vraies requêtes Supabase liées à une
 * session authentifiée, sans changer cette mise en page.
 */
export function ComptePageClient({ orders, profile }: { orders: MyOrder[]; profile: { name: string; phone: string; email: string } }) {
  return (
    <Suspense fallback={null}>
      <ComptePageContent orders={orders} profile={profile} />
    </Suspense>
  );
}

function ComptePageContent({ orders, profile }: { orders: MyOrder[]; profile: { name: string; phone: string; email: string } }) {
  const t = useTranslations('accountPage');
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('profil');
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [savingProfile, setSavingProfile] = useState(false);
  const { favorites } = useFavorites();

  useEffect(() => {
    const fromUrl = searchParams.get('tab') as Tab | null;
    if (fromUrl) setTab(fromUrl);
  }, [searchParams]);

  const tabs: { key: Tab; icon: any; label: string }[] = [
    { key: 'profil', icon: User, label: t('tabs.profil') },
    { key: 'devis', icon: FileText, label: t('tabs.devis') },
    { key: 'paiements', icon: CreditCard, label: t('tabs.paiements') },
    { key: 'fichiers', icon: FolderOpen, label: t('tabs.fichiers') },
    { key: 'marques', icon: Palette, label: t('tabs.marques') },
    { key: 'favoris', icon: Heart, label: t('tabs.favoris') },
    { key: 'avis', icon: Star, label: t('tabs.avis') },
    { key: 'adresses', icon: MapPin, label: t('tabs.adresses') },
    { key: 'notifications', icon: Bell, label: t('tabs.notifications') },
  ];

  const favoriteProducts = products.filter((p) => favorites.includes(p.slug));
  const unreadCount = clientNotifications.filter((n) => !n.read).length;

  return (
    <Section className="pt-12">
      <Container>
        <h1 className="text-4xl font-black">{t('title')}</h1>
        <p className="mt-3 text-ink-70">{t('subtitle')}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex shrink-0 items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap ${
                  tab === key ? 'bg-ink text-paper' : 'text-ink-70 hover:bg-ink-8'
                }`}
              >
                <Icon size={16} />
                {label}
                {key === 'notifications' && unreadCount > 0 && (
                  <span className="ms-auto rounded-full bg-brand-magenta px-1.5 text-[10px] font-bold text-white">{unreadCount}</span>
                )}
              </button>
            ))}
          </nav>

          <div>
            {tab === 'profil' && (
              <form
                className="max-w-md space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSavingProfile(true);
                  await fetch('/api/account/profile', {
                    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone }),
                  });
                  setSavingProfile(false);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input placeholder={t('fields.name')} value={name} onChange={(e) => setName(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm" />
                  <input placeholder={t('fields.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-md border border-ink-15 p-3 text-sm" />
                </div>
                <input placeholder={t('fields.email')} defaultValue={profile.email} disabled className="w-full rounded-md border border-ink-15 bg-ink-8/40 p-3 text-sm text-ink-40" />
                <div className="flex gap-3">
                  <Button type="submit" variant="magenta" loading={savingProfile} disabled={savingProfile}>{t('save')}</Button>
                  <Button type="button" variant="outline" onClick={() => { signOut(); router.push('/'); }}>{t('signOut')}</Button>
                </div>
              </form>
            )}

            {tab === 'devis' && (
              <div className="space-y-3">
                {orders.length === 0 && <p className="text-sm text-ink-40">{t('noOrders')}</p>}
                {orders.map((o) => (
                  <div key={o.reference} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-8 shadow-soft bg-white p-4">
                    <div>
                      <p className="font-mono text-xs text-ink-40">{o.reference} — {new Date(o.date).toLocaleDateString(locale)}</p>
                      <p className="font-bold text-sm">{o.productName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/suivi?ref=${o.reference}`} className="text-xs font-bold underline">{t('trackCta')}</Link>
                      {o.productSlug && <Button href={`/produits/${o.productSlug}`} size="sm" variant="outline">{t('reorderCta')}</Button>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'paiements' && (
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div key={inv.reference} className="flex items-center justify-between rounded-lg border border-ink-8 shadow-soft bg-white p-4">
                    <div>
                      <p className="font-mono text-xs text-ink-40">{inv.reference} · {inv.orderReference}</p>
                      <p className="font-bold text-sm">{inv.amount}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${inv.status === 'payee' ? 'bg-success/10 text-success' : 'bg-brand-yellow/20 text-ink-70'}`}>
                      {t(`invoiceStatus.${inv.status}`)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'fichiers' && (
              <div className="grid gap-3 sm:grid-cols-2">
                {clientFiles.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 rounded-lg border border-ink-8 shadow-soft bg-white p-3">
                    {f.type === 'logo' ? (
                      <img src={f.url} alt="" className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <FolderOpen size={20} className="text-ink-40" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{f.name}</p>
                      <p className="text-xs text-ink-40">{new Date(f.uploadedAt).toLocaleDateString(locale)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'marques' && (
              <div className="space-y-4">
                {brandKits.map((b) => (
                  <div key={b.id} className="rounded-lg border border-ink-8 shadow-soft bg-white p-5">
                    <div className="flex items-center gap-3">
                      <img src={b.logoUrl} alt="" className="h-12 w-12 rounded object-cover" />
                      <p className="font-bold">{b.name}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {b.colors.map((c) => <span key={c} className="h-6 w-6 rounded-full border border-ink-15" style={{ background: c }} />)}
                    </div>
                    <p className="mt-3 text-xs text-ink-40">{t('fonts')} : {b.fonts.join(', ')}</p>
                  </div>
                ))}
                <Button variant="outline">{t('addBrand')}</Button>
              </div>
            )}

            {tab === 'favoris' && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {favoriteProducts.length === 0 && <p className="text-sm text-ink-40">{t('noFavorites')}</p>}
                {favoriteProducts.map((p) => (
                  <Link key={p.id} href={`/produits/${p.slug}`} className="overflow-hidden rounded-lg border border-ink-8 shadow-soft bg-white">
                    <img src={p.images[0]} alt={p.name[locale]} className="aspect-[4/3] w-full object-cover" />
                    <div className="p-3"><p className="text-sm font-bold">{p.name[locale]}</p></div>
                  </Link>
                ))}
              </div>
            )}

            {tab === 'avis' && (
              <div className="space-y-3">
                {testimonials.slice(0, 2).map((r) => (
                  <div key={r.id} className="rounded-lg border border-ink-8 shadow-soft bg-white p-4">
                    <RatingStars rating={r.rating} />
                    <p className="mt-2 text-sm text-ink-70">&ldquo;{r.comment[locale]}&rdquo;</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'adresses' && (
              <div className="space-y-3">
                {deliveryAddresses.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-ink-8 shadow-soft bg-white p-4">
                    <div>
                      <p className="font-bold text-sm">{a.label} {a.isDefault && <span className="ms-2 text-xs text-brand-magenta">{t('default')}</span>}</p>
                      <p className="text-xs text-ink-40">{a.address}, {a.city}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm">{t('addAddress')}</Button>
              </div>
            )}

            {tab === 'notifications' && (
              <div className="space-y-2">
                {clientNotifications.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 rounded-md p-4 ${n.read ? 'border border-ink-8' : 'border border-brand-magenta/30 bg-brand-magenta/5'}`}>
                    <Bell size={16} className={n.read ? 'text-ink-40' : 'text-brand-magenta'} />
                    <div>
                      <p className="text-sm font-semibold">{n.message[locale]}</p>
                      <p className="mt-0.5 text-xs text-ink-40">{new Date(n.date).toLocaleDateString(locale)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
