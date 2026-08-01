import { NextResponse } from 'next/server';

/**
 * Point d'entrée IA — génération de fiche produit.
 *
 * ⚠️ IMPORTANT : ceci génère du contenu par gabarit (templates), PAS par un
 * vrai modèle de langage — aucune clé API n'est disponible dans cet
 * environnement. C'est le vrai point d'intégration pour un futur appel LLM
 * (Claude, GPT...) : remplacer uniquement le corps de cette fonction par un
 * appel API réel changera le comportement partout, sans toucher à l'admin
 * qui appelle déjà ce endpoint exactement comme le ferait la vraie IA.
 */
export async function POST(request: Request) {
  const { productName, category } = await request.json();

  if (!productName) {
    return NextResponse.json({ error: 'productName requis' }, { status: 400 });
  }

  await new Promise((r) => setTimeout(r, 600)); // simule une latence réseau réaliste

  const shortDescription = `${productName} personnalisable, imprimé avec soin par DadPrint — idéal pour ${category ?? 'votre projet'}.`;
  const description = `Découvrez notre ${productName.toLowerCase()}, conçu pour répondre aux besoins des professionnels comme des particuliers. Chaque exemplaire est imprimé avec une attention particulière à la qualité, dans nos ateliers à Nouakchott. Commandez en ligne, suivez votre production en temps réel, et recevez votre commande où que vous soyez en Mauritanie.`;
  const seoTitle = `${productName} — Impression professionnelle | DadPrint`;
  const seoDescription = `Commandez votre ${productName.toLowerCase()} en ligne avec DadPrint. Qualité premium, délais annoncés, livraison partout en Mauritanie.`;
  const hashtags = ['#DadPrint', '#Impression', '#Nouakchott', `#${productName.replace(/\s+/g, '')}`, '#Mauritanie'];
  const socialPost = `✨ Nouveau chez DadPrint : ${productName} !\n\nCommandez en ligne, sans vous déplacer. ${hashtags.join(' ')}`;

  return NextResponse.json({
    shortDescription, description, seoTitle, seoDescription, hashtags, socialPost,
    generatedBy: 'template', // 'llm' le jour où un vrai modèle sera branché
  });
}
