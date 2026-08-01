import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from './config';

/**
 * Link, useRouter, usePathname, redirect "conscients" de la langue courante.
 * À utiliser PARTOUT dans l'app à la place des équivalents next/link, next/navigation
 * pour que la navigation reste toujours dans la bonne langue automatiquement.
 */
export const { Link, useRouter, usePathname, redirect } =
  createSharedPathnamesNavigation({ locales });
