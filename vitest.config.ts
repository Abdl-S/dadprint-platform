import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Configuration Vitest — tests unitaires sur la logique métier (référence,
 * recommandations, workflow). Les tests de parcours utilisateur, responsive
 * et performance nécessitent un vrai navigateur (Playwright) : hors périmètre
 * ici, mais cette configuration sert de socle pour les brancher plus tard.
 */
export default defineConfig({
  test: { environment: 'node' },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
