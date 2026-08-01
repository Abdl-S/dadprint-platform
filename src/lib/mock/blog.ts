/** ⚠️ Articles d'exemple — l'admin pourra publier de vrais articles (module suivant). */
import type { BlogArticle } from '@/types';

const t = (fr: string, en: string, ar: string) => ({ fr, en, ar });

export const blogArticles: BlogArticle[] = [
  {
    slug: 'choisir-grammage-papier',
    title: t('Comment choisir le bon grammage de papier ?', 'How to choose the right paper weight?', 'كيف تختار وزن الورق المناسب؟'),
    excerpt: t('135g, 250g, 350g... on vous explique quand utiliser chaque grammage.', '135g, 250g, 350g... we explain when to use each weight.', '135غ، 250غ، 350غ... نشرح متى تستخدم كل وزن.'),
    content: t(
      'Le grammage du papier influence directement la perception de qualité de votre support imprimé. Un 135g convient parfaitement aux flyers de distribution ponctuelle, tandis qu\'un 300-350g s\'impose pour des cartes de visite ou des supports destinés à être conservés. Entre les deux, le 250g offre un bon compromis pour des brochures ou dépliants qui doivent tenir debout sans être trop rigides.',
      'Paper weight directly affects how premium your printed material feels. 135g works well for one-off distributed flyers, while 300-350g is the standard for business cards or materials meant to be kept. In between, 250g is a good compromise for brochures that need to stand upright without being too stiff.',
      'يؤثر وزن الورق مباشرة على جودة المطبوع المُدرَك.'
    ),
    coverImageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
    category: 'conseils-impression', publishedAt: '2026-07-20',
  },
  {
    slug: 'preparer-fichier-impression',
    title: t('Bien préparer son fichier avant impression', 'Properly preparing your file before printing', 'تحضير ملفك جيداً قبل الطباعة'),
    excerpt: t('CMJN, résolution, fond perdu : les bases pour éviter les mauvaises surprises.', 'CMYK, resolution, bleed: the basics to avoid surprises.', 'CMYK، الدقة، الهامش: الأساسيات لتجنب المفاجآت.'),
    content: t(
      'Trois points à vérifier systématiquement avant d\'envoyer un fichier à l\'impression : le mode colorimétrique doit être en CMJN (pas RVB, réservé à l\'écran), la résolution doit être d\'au moins 300 dpi à la taille réelle du document, et un fond perdu de 3mm doit être prévu si votre visuel touche les bords. Ces trois réflexes évitent 90% des retouches de dernière minute.',
      'Three things to check before sending a file to print: the color mode must be CMYK (not RGB, which is for screens), resolution should be at least 300 dpi at actual size, and a 3mm bleed should be included if your visual touches the edges. These three habits prevent 90% of last-minute fixes.',
      'ثلاث نقاط يجب التحقق منها قبل إرسال الملف للطباعة.'
    ),
    coverImageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
    category: 'conseils-design', publishedAt: '2026-07-15',
  },
  {
    slug: 'guide-choisir-support-communication',
    title: t('Quel support choisir pour votre communication ?', 'Which format should you choose for your communication?', 'أي وسيلة تختار لتواصلك؟'),
    excerpt: t('Flyer, roll-up, bâche... le bon choix dépend de votre objectif.', 'Flyer, roll-up, banner... the right choice depends on your goal.', 'منشور، لوحة، لافتة... الاختيار الصحيح يعتمد على هدفك.'),
    content: t(
      'Le choix du support dépend avant tout de la durée d\'exposition et du contexte : un flyer se distribue et se jette, un roll-up accompagne un stand pendant plusieurs événements, une bâche extérieure doit résister aux intempéries sur plusieurs mois. Pensez toujours à l\'usage final avant de penser au budget.',
      'The choice of format depends first on exposure duration and context: a flyer is handed out and discarded, a roll-up accompanies a booth across several events, an outdoor banner must withstand weather for months. Always think about final use before thinking about budget.',
      'يعتمد اختيار الوسيلة على مدة العرض والسياق.'
    ),
    coverImageUrl: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=800&q=80',
    category: 'guides', publishedAt: '2026-07-05',
  },
];
