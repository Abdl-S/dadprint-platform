import Image from 'next/image';
import Link from 'next/link';
import logoSrc from '../../../public/brand/dadprint-logo.png';

/**
 * Logo officiel DadPrint — fond extérieur rendu transparent (détourage par
 * flood-fill depuis les bords, aucune retouche du tracé, des couleurs ou des
 * blancs qui font partie du dessin lui-même). S'intègre maintenant sur
 * n'importe quel fond, clair ou sombre, sans artifice de plaque derrière.
 *
 * RÈGLE ABSOLUE : ce composant ne doit JAMAIS recolorer, recréer, déformer,
 * recadrer ou remplacer le fichier logo. Le seul paramètre ajustable est la
 * taille d'affichage (`size`), qui redimensionne proportionnellement
 * l'image source officielle — jamais son contenu.
 *
 * Le logo est identique dans les 3 langues, y compris en RTL : on ne le
 * retourne jamais en miroir (contrairement au reste de l'interface).
 */
export function Logo({
  size = 'md',
  href = '/',
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string | null;
}) {
  const heights = { sm: 32, md: 44, lg: 64, xl: 76 };
  const height = heights[size];

  const img = (
    <Image src={logoSrc} alt="DadPrint" height={height} style={{ height, width: 'auto' }} priority />
  );

  if (!href) return img;

  return (
    <Link href={href} aria-label="DadPrint — Accueil" className="inline-flex shrink-0">
      {img}
    </Link>
  );
}
