import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { locales, defaultLocale } from '@/i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // toutes les URLs incluent la langue: /fr/..., /en/..., /ar/...
});

/**
 * Combine le routage de langue (next-intl) avec le rafraîchissement de la
 * session Supabase. Ce rafraîchissement est nécessaire à chaque requête —
 * sans lui, les jetons de session expirent silencieusement et l'utilisateur
 * se retrouve déconnecté sans erreur explicite.
 */
export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Applique le middleware à toutes les routes sauf assets statiques et API
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
