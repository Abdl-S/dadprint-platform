/**
 * Service Worker DadPrint — mise en cache intelligente + fondations push.
 *
 * Stratégies volontairement différenciées par type de ressource :
 * - App shell (logo, icônes, manifest) : mis en cache à l'installation, jamais périmé.
 * - Pages (navigation) : réseau en priorité, secours sur le cache si hors-ligne
 *   (le contenu doit rester à jour ; le cache n'est qu'un filet de sécurité).
 * - Assets statiques Next.js (_next/static, images) : cache d'abord, très rapide,
 *   sûr car ces fichiers sont "hashés" (leur contenu ne change jamais sous une même URL).
 * - Tout ce qui touche Supabase ou une API : jamais mis en cache — prix, stock,
 *   statut de commande doivent toujours venir du réseau.
 */

const CACHE_VERSION = 'dadprint-v1';
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGES_CACHE = `${CACHE_VERSION}-pages`;

const APP_SHELL = [
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('dadprint-') && !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function isSupabaseOrApi(url) {
  return url.hostname.endsWith('.supabase.co') || url.pathname.startsWith('/api');
}

function isNextStaticAsset(url) {
  return url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/icons') || url.pathname.startsWith('/splash');
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Jamais de cache pour les données dynamiques (Supabase, API)
  if (isSupabaseOrApi(url)) return;

  // Assets statiques hashés : cache d'abord
  if (isNextStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      })
    );
    return;
  }

  // Navigation (pages HTML) : réseau d'abord, secours cache, puis page hors-ligne
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(PAGES_CACHE).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || caches.match('/offline.html');
        })
    );
  }
});

/**
 * === Notifications push — fondation, non activée ===
 * Prêt pour un futur enregistrement (subscription) et un service d'envoi (VAPID)
 * côté administration : suivi de commande, devis prêt, promotion.
 * Rien n'est envoyé tant qu'aucun service ne pousse de message.
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'DadPrint', {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-96.png',
      data: data.url ? { url: data.url } : undefined,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(self.clients.openWindow(url));
});
