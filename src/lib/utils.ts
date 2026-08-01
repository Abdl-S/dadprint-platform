import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Fusionne des classes Tailwind proprement (évite les conflits de classes dupliquées). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
