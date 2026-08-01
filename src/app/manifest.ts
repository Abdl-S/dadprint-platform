import type { MetadataRoute } from 'next';

/**
 * Manifest PWA — permet l'installation sur Android, Windows et macOS
 * (via Chrome/Edge "Installer l'application") sans passer par un store.
 * iOS ne lit pas ce fichier pour l'installation (voir les balises
 * apple-* dans app/[locale]/layout.tsx) mais l'utilise pour Safari 16.4+.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DadPrint — Impression premium, sans vous déplacer',
    short_name: 'DadPrint',
    description:
      "Commandez votre impression en ligne, suivez la production et recevez votre livraison, sans vous déplacer.",
    start_url: '/', // laisse le middleware de détection de langue choisir FR/EN/AR selon le navigateur — jamais figé sur /fr
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FBFAF7', // écran de démarrage — couleur "paper" de la charte
    theme_color: '#221E1F',      // barre de statut / cadre navigateur — couleur "ink" de la charte
    lang: 'fr',
    dir: 'ltr',
    categories: ['business', 'shopping', 'productivity'],
    icons: [
      { src: '/icons/icon-72.png', sizes: '72x72', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-96.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-128.png', sizes: '128x128', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-152.png', sizes: '152x152', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-256.png', sizes: '256x256', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Commander',
        short_name: 'Commander',
        url: '/fr/produits',
        icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
      },
      {
        name: 'Demander un devis',
        short_name: 'Devis',
        url: '/fr/devis',
        icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
      },
    ],
  };
}
