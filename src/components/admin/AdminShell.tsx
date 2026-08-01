'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FolderTree, Package, Boxes, PenTool, FileText, ShoppingCart,
  Users, Star, Image as ImageIcon, Building2, Newspaper, Mail, FileEdit, Settings,
  CreditCard, ShieldCheck, BarChart3, Sparkles, Menu, X, LogOut, Bell,
} from 'lucide-react';
import { useAdminAuth, type AdminRole } from '@/lib/admin/auth-context';
import { useStaffNotifications, markRead } from '@/lib/notifications/store';
import { Logo } from '@/components/brand/Logo';

/**
 * Permissions par rôle — 'administrateur' voit toujours tout. Pour les
 * autres rôles, seuls les modules listés ici apparaissent dans la sidebar
 * ET restent accessibles (reflète `rolePermissions` de lib/mock/admin.ts,
 * mais sous une forme exploitable pour filtrer la navigation).
 */
const ROLE_ACCESS: Record<string, AdminRole[]> = {
  '/admin': ['administrateur', 'commercial', 'graphiste', 'production', 'livreur', 'support'],
  '/admin/devis': ['administrateur', 'commercial'],
  '/admin/commandes': ['administrateur', 'commercial', 'production', 'livreur'],
  '/admin/paiements': ['administrateur', 'commercial'],
  '/admin/clients': ['administrateur', 'commercial', 'support'],
  '/admin/avis': ['administrateur', 'support'],
  '/admin/packs': ['administrateur', 'commercial'],
  '/admin/studio': ['administrateur', 'graphiste'],
  '/admin/newsletter': ['administrateur', 'support'],
};
function canAccess(href: string, role?: AdminRole) {
  if (!role || role === 'administrateur') return true;
  if (!(href in ROLE_ACCESS)) return true; // modules non restreints : catalogue/contenu/système restent visibles
  return ROLE_ACCESS[href].includes(role);
}

const nav = [
  { section: 'Général', items: [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  ]},
  { section: 'Catalogue', items: [
    { href: '/admin/categories', label: 'Catégories', icon: FolderTree },
    { href: '/admin/produits', label: 'Produits', icon: Package },
    { href: '/admin/packs', label: 'Packs', icon: Boxes },
    { href: '/admin/services', label: 'Services graphiques', icon: PenTool },
  ]},
  { section: 'Ventes', items: [
    { href: '/admin/devis', label: 'Devis', icon: FileText },
    { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
    { href: '/admin/paiements', label: 'Paiements', icon: CreditCard },
  ]},
  { section: 'Clients', items: [
    { href: '/admin/clients', label: 'CRM Clients', icon: Users },
    { href: '/admin/avis', label: 'Avis clients', icon: Star },
  ]},
  { section: 'Contenu', items: [
    { href: '/admin/portfolio', label: 'Portfolio', icon: ImageIcon },
    { href: '/admin/nos-clients', label: 'Nos clients', icon: Building2 },
    { href: '/admin/blog', label: 'Blog', icon: Newspaper },
    { href: '/admin/pages', label: 'Pages', icon: FileEdit },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  ]},
  { section: 'Production', items: [
    { href: '/admin/studio', label: 'DadPrint Studio', icon: Sparkles },
  ]},
  { section: 'Système', items: [
    { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
    { href: '/admin/utilisateurs', label: 'Utilisateurs & rôles', icon: ShieldCheck },
    { href: '/admin/statistiques', label: 'Statistiques', icon: BarChart3 },
    { href: '/admin/journal', label: "Journal d'activité", icon: FileText },
    { href: '/admin/sauvegardes', label: 'Sauvegardes', icon: Boxes },
    { href: '/admin/ia', label: 'Assistant IA', icon: Sparkles },
  ]},
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const myNotifications = useStaffNotifications(session?.role);
  const unread = myNotifications.filter((n) => !n.read).length;

  const activeLabel = nav.flatMap((s) => s.items).find((i) => pathname === i.href || pathname?.endsWith(i.href))?.label ?? 'Tableau de bord';

  return (
    <div className="flex min-h-screen bg-[#F7F5F2]">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-8 bg-white lg:flex">
        <div className="flex h-20 items-center border-b border-ink-8 px-6">
          <Logo size="sm" href={null} />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {nav
            .map((section) => ({ ...section, items: section.items.filter((item) => canAccess(item.href, session?.role)) }))
            .filter((section) => section.items.length > 0)
            .map((section) => (
            <div key={section.section} className="mb-5">
              <p className="mb-1.5 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-40">{section.section}</p>
              {section.items.filter((item) => canAccess(item.href, session?.role)).map((item) => {
                const active = pathname === item.href || pathname?.endsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active ? 'bg-ink text-paper' : 'text-ink-70 hover:bg-ink-8'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-ink-8 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-magenta text-xs font-bold text-white">
              {session?.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold">{session?.name}</p>
              <p className="truncate text-[11px] capitalize text-ink-40">{session?.role}</p>
            </div>
            <button onClick={logout} aria-label="Déconnexion" className="text-ink-40 hover:text-danger">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <Logo size="sm" href={null} />
              <button onClick={() => setMobileOpen(false)}><X size={22} /></button>
            </div>
            {nav
            .map((section) => ({ ...section, items: section.items.filter((item) => canAccess(item.href, session?.role)) }))
            .filter((section) => section.items.length > 0)
            .map((section) => (
              <div key={section.section} className="mb-5">
                <p className="mb-1.5 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-40">{section.section}</p>
                {section.items.filter((item) => canAccess(item.href, session?.role)).map((item) => {
                  const active = pathname === item.href || pathname?.endsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${active ? 'bg-ink text-paper' : 'text-ink-70'}`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink-8 bg-white/90 px-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden"><Menu size={22} /></button>
            <h1 className="text-lg font-bold">{activeLabel}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink-8">
                <Bell size={17} />
                {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-magenta" />}
              </button>
              {notifOpen && (
                <div className="absolute end-0 top-11 z-50 w-80 rounded-lg border border-ink-8 bg-white p-2 shadow-raised">
                  {myNotifications.length === 0 && <p className="p-4 text-center text-xs text-ink-40">Aucune notification</p>}
                  {myNotifications.slice(0, 6).map((n) => (
                    <button key={n.id} onClick={() => markRead(n.id)} className={`block w-full rounded-md p-3 text-start text-xs ${n.read ? '' : 'bg-brand-magenta/5'}`}>
                      <p className="font-bold">{n.title}</p>
                      <p className="mt-0.5 text-ink-70">{n.body}</p>
                      <p className="mt-1 flex gap-1">
                        {n.channels.map((c) => <span key={c} className="rounded-full bg-ink-8 px-1.5 py-0.5 text-[9px] font-bold uppercase text-ink-40">{c}</span>)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link href="/" className="hidden text-xs font-semibold text-ink-40 hover:text-ink sm:block">← Voir le site</Link>
          </div>
        </header>
        <main className="flex-1 p-5 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
