'use client';

/**
 * Aperçu visuel en direct — réagit aux choix du client (couleur, finition,
 * dimensions) sur la photo du produit. C'est un aperçu INDICATIF (filtre
 * colorimétrique appliqué à la photo réelle, pas un rendu 3D produit par
 * produit — construire de vrais mockups paramétriques par couleur/matière
 * demanderait des assets dédiés par produit, hors périmètre ici) mais
 * l'interaction elle-même est réelle : chaque changement met à jour l'image
 * instantanément, sans rechargement.
 */

const COLOR_FILTERS: Record<string, string> = {
  'Noir': 'grayscale(1) brightness(0.35)',
  'Black': 'grayscale(1) brightness(0.35)',
  'Blanc': 'grayscale(1) brightness(1.5) contrast(0.8)',
  'White': 'grayscale(1) brightness(1.5) contrast(0.8)',
  'Bleu marine': 'grayscale(0.4) sepia(1) hue-rotate(180deg) saturate(3) brightness(0.55)',
  'Gris': 'grayscale(1) brightness(0.85)',
  'Rouge': 'grayscale(0.3) sepia(1) hue-rotate(-50deg) saturate(4) brightness(0.9)',
  'Jaune': 'grayscale(0.3) sepia(1) hue-rotate(0deg) saturate(4) brightness(1.1)',
  'Bleu': 'grayscale(0.3) sepia(1) hue-rotate(180deg) saturate(4) brightness(0.9)',
};

export function LiveProductPreview({
  image, colorValue, finishValue, dimensionValue,
}: { image: string; colorValue?: string; finishValue?: string; dimensionValue?: string }) {
  const filter = colorValue ? COLOR_FILTERS[colorValue] ?? 'none' : 'none';

  // Dimensions "Roll-up" → on fait varier l'échelle visuelle du mockup pour donner un sens de la taille relative
  const dimensionScale = dimensionValue?.replace(/\s/g, '').includes('100x200') ? 1 : dimensionValue?.replace(/\s/g, '').includes('85x200') ? 0.9 : 1;

  return (
    <div className="relative overflow-hidden rounded-lg bg-ink-8">
      <img
        src={image}
        alt="Aperçu du produit"
        style={{ filter, transform: `scale(${dimensionScale})`, transition: 'filter 300ms ease, transform 300ms ease' }}
        className="aspect-square w-full object-cover"
      />
      {finishValue?.toLowerCase().includes('brillant') && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent" />
      )}
      <span className="absolute bottom-2 start-2 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-bold text-paper backdrop-blur-sm">
        Aperçu indicatif
      </span>
    </div>
  );
}
