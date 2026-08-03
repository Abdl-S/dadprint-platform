import type { Metadata, Viewport } from 'next';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, isRtl, type Locale } from '@/i18n/config';
import { Header } from '@/components/layout/Header';
import { ChromeGate } from '@/components/layout/ChromeGate';
import { FavoritesProvider } from '@/lib/favorites/context';
import { AuthProvider } from '@/lib/auth/context';
import { Footer } from '@/components/layout/Footer';
import { StickyMobileActionBar } from '@/components/layout/StickyMobileActionBar';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { VisitorAssistant } from '@/components/layout/VisitorAssistant';
import { AppleSplashLinks } from '@/components/pwa/AppleSplashLinks';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import '../globals.css';

// Police d'interface — jamais utilisée pour le logo (le logo reste l'image officielle, intouchée)
const inter = { variable: '' };
const spaceMono = { variable: '' };
const notoArabic = { variable: '' };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Couleur de la barre de statut / navigateur — installée comme app, elle doit rester "ink".
export const viewport: Viewport = {
  themeColor: '#221E1F',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // respecte les encoches iPhone une fois installée en plein écran
};

// SEO + PWA : chaque page peut surcharger ces métadonnées par défaut via generateMetadata
export const metadata: Metadata = {
  metadataBase: new URL('https://mycrewdeck-placeholder-domain.example'), // TODO: domaine définitif DadPrint
  title: {
    default: 'DadPrint — Impression premium, sans vous déplacer',
    template: '%s | DadPrint',
  },
  description:
    "DadPrint est la plateforme d'impression et de communication visuelle en Mauritanie : commandez, personnalisez et suivez votre production entièrement en ligne.",
  openGraph: {
    siteName: 'DadPrint',
    type: 'website',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'DadPrint',
    statusBarStyle: 'black-translucent',
  },
  other: {
    // Installation "app" sur Windows/Edge — étend le comportement standalone du manifest
    'msapplication-TileColor': '#221E1F',
    'msapplication-TileImage': '/icons/icon-144.png',
  },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = isRtl(locale as Locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <head>
        <AppleSplashLinks />
      </head>
      <body
        className={`${inter.variable} ${spaceMono.variable} ${notoArabic.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <FavoritesProvider>
              <ChromeGate><Header /></ChromeGate>
              <main className="pb-16 lg:pb-0">{children}</main>
              <ChromeGate>
                <Footer />
                <FloatingActions />
                <VisitorAssistant />
                <InstallPrompt />
              </ChromeGate>
            </FavoritesProvider>
          </AuthProvider>
        </NextIntlClientProvider>
        <ChromeGate><StickyMobileActionBar /></ChromeGate>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
