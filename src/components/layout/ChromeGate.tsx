'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Masque l'habillage public (header, footer, boutons flottants, barre mobile)
 * sur toutes les routes /admin — l'administration a sa propre mise en page
 * (AdminShell) et ne doit jamais montrer la navigation du site public.
 */
export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.includes('/admin');

  if (isAdmin) return null;
  return <>{children}</>;
}
