'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'dadprint_favorites';

interface FavoritesContextValue {
  favorites: string[];
  toggle: (productSlug: string) => void;
  isFavorite: (productSlug: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Favoris stockés côté navigateur (localStorage) pour l'instant — fonctionne
 * sans compte. Une fois l'authentification réelle branchée, ce provider
 * pourra synchroniser avec Supabase sans changer les composants qui l'utilisent.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // localStorage indisponible (mode privé, etc.) — les favoris restent vides pour la session
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // idem
    }
  }, [favorites, loaded]);

  function toggle(slug: string) {
    setFavorites((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  function isFavorite(slug: string) {
    return favorites.includes(slug);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
