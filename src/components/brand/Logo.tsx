import Image from 'next/image';
import Link from 'next/link';
import logoSrc from '../../../public/brand/dadprint-logo.png';
import logoWhiteSrc from '../../../public/brand/dadprint-logo-white.png';

/**
 * Logo officiel DadPrint — fond extérieur rendu transparent (détourage par
 * flood-fill depuis les bords, aucune retouche du tracé, des couleurs ou des
 * blancs qui font partie du dessin lui-même).
 *
 * RÈGLE ABSOLUE : ce composant ne doit JAMAIS recolorer, recréer, déformer,
 * recadrer ou remplacer le fichier logo. Les seuls paramètres ajustables
 * sont la taille d'affichage (`size`) et la variante de couleur (`onDark`)
 * — cette dernière pointe vers un second fichier officiel, une version
 * monochrome blanche du même tracé exact (même forme, mêmes proportions),
 * demandée explicitement pour rester lisible sur fond sombre (footer).
 * Jamais un recolorage à la volée : deux fichiers statiques, un par usage.
 *
 * Le logo est identique dans les 3 langues, y compris en RTL : on ne le
 * retourne jamais en miroir (contrairement au reste de l'interface).
 */
export function Logo({
  size = 'md',
  href = '/',
  onDark = false,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string | null;
  onDark?: boolean;
}) {
  const heights = { sm: 32, md: 44, lg: 64, xl: 76 };
  const height = heights[size];

  const img = (
    <Image src={onDark ? logoWhiteSrc : logoSrc} alt="DadPrint" height={height} style={{ height, width: 'auto' }} priority />
  );

  if (!href) return img;

  return (
    <Link href={href} aria-label="DadPrint — Accueil" className="inline-flex shrink-0">
      {img}
    </Link>
  );
}
