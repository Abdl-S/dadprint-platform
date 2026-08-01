'use client';

import { useEffect } from 'react';

/**
 * Enregistre le service worker au chargement du site.
 * Ne bloque jamais le rendu — best effort, silencieux si le navigateur
 * ne supporte pas les service workers (pas de dégradation d'expérience).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // échec silencieux : le site reste utilisable normalement, juste sans cache offline
      });
    }
  }, []);

  return null;
}
