import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DadPrint',
};

/**
 * Layout racine minimal requis par Next.js App Router.
 * Le vrai layout (langue, polices, header/footer) vit dans app/[locale]/layout.tsx —
 * celui-ci ne sert que pour la redirection "/" -> "/fr" avant que la locale soit connue.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
