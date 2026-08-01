/**
 * Configuration centrale des langues.
 * Pour ajouter une langue plus tard : l'ajouter ici + créer messages/<locale>.json.
 * Rien d'autre dans le projet ne doit lister les langues en dur.
 */
export const locales = ['fr', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

// Langues qui s'affichent de droite à gauche
export const rtlLocales: Locale[] = ['ar'];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
