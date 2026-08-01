import type { Config } from 'tailwindcss';

/**
 * DadPrint — Design tokens
 * Les couleurs proviennent strictement de la charte graphique officielle.
 * Ne jamais coder une couleur de marque "en dur" ailleurs que dans ce fichier :
 * toute l'UI doit consommer ces tokens (bg-brand-magenta, text-ink-70, etc.)
 * pour que la charte reste centralisée et cohérente à mesure que le site grandit.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#221E1F', // texte principal, fonds sombres
          70: '#4A4544',
          40: '#8A8583',
          15: '#D8D4D1',
          8: '#ECE9E6',
        },
        paper: '#FBFAF7', // fond clair de marque
        brand: {
          magenta: '#EA0E8A',
          cyan: '#15A1D6',
          yellow: '#EFEB41',
        },
        success: '#1A9C53',
        danger: '#D6304A',
      },
      fontFamily: {
        // Police d'interface (PAS le logo — Impact reste exclusivement réservé au logo officiel)
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
        arabic: ['var(--font-arabic)', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '18px',
        xl: '28px',
      },
      boxShadow: {
        // Ombres teintées à l'encre de la marque plutôt que du gris neutre — plus de profondeur perçue.
        soft: '0 1px 2px rgba(34,30,31,0.04), 0 2px 8px rgba(34,30,31,0.04)',
        card: '0 2px 6px rgba(34,30,31,0.05), 0 8px 24px rgba(34,30,31,0.06)',
        raised: '0 4px 12px rgba(34,30,31,0.08), 0 16px 40px rgba(34,30,31,0.10)',
        glow: '0 8px 24px rgba(234,14,138,0.22)',
      },
      maxWidth: {
        container: '1180px',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        spin: 'spin 0.7s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
