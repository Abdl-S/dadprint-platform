/**
 * ⚠️ DONNÉES D'EXEMPLE — à remplacer entièrement par des requêtes Supabase
 * quand le catalogue réel sera connecté. Sert uniquement à démontrer que
 * chaque composant fonctionne avec la bonne forme de données.
 * Aucun de ces avis, entreprises ou photos n'est réel.
 */
import type {
  Category, Product, PortfolioItem, ClientCompany, Testimonial, FaqItem,
} from '@/types';

const t = (fr: string, en: string, ar: string) => ({ fr, en, ar });

export const categories: Category[] = [
  { id: 'c1', slug: 'cartes-de-visite', name: t('Cartes de visite', 'Business Cards', 'بطاقات العمل'), description: t('Premier contact, première impression.', 'First contact, first impression.', 'أول تواصل، أول انطباع.'), coverImageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80', productCount: 4 },
  { id: 'c2', slug: 'flyers', name: t('Flyers', 'Flyers', 'منشورات'), description: t('Diffusez votre message largement.', 'Spread your message widely.', 'انشر رسالتك على نطاق واسع.'), coverImageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80', productCount: 3 },
  { id: 'c3', slug: 'brochures', name: t('Brochures', 'Brochures', 'كتيبات'), description: t('Présentez votre offre en détail.', 'Present your offer in detail.', 'اعرض عرضك بالتفصيل.'), coverImageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80', productCount: 2 },
  { id: 'c4', slug: 'affiches', name: t('Affiches', 'Posters', 'ملصقات'), description: t('Visibilité grand format.', 'Large-format visibility.', 'رؤية بحجم كبير.'), coverImageUrl: 'https://images.unsplash.com/photo-1568205612837-017257d2310a?w=600&q=80', productCount: 2 },
  { id: 'c5', slug: 'roll-up', name: t('Roll-up', 'Roll-up Banners', 'لوحات قابلة للطي'), description: t('Votre stand, prêt en 2 minutes.', 'Your booth, ready in 2 minutes.', 'جناحك جاهز خلال دقيقتين.'), coverImageUrl: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=600&q=80', productCount: 1 },
  { id: 'c6', slug: 'baches', name: t('Bâches', 'Banners', 'لافتات'), description: t('Grand format extérieur résistant.', 'Weatherproof large format.', 'حجم كبير مقاوم للعوامل الجوية.'), coverImageUrl: 'https://images.unsplash.com/photo-1568205612837-017257d2310a?w=600&q=80', productCount: 2 },
  { id: 'c7', slug: 'textile', name: t('Textile', 'Apparel', 'ملابس'), description: t('T-shirts, casquettes, personnalisés.', 'T-shirts, caps, customized.', 'قمصان وقبعات مخصصة.'), coverImageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80', productCount: 2 },
  { id: 'c7a', slug: 'tshirts', parentSlug: 'textile', name: t('T-shirts', 'T-shirts', 'قمصان'), description: t('Personnalisés recto et/ou verso.', 'Customized front and/or back.', 'مخصصة من الأمام و/أو الخلف.'), coverImageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', productCount: 1 },
  { id: 'c7b', slug: 'casquettes', parentSlug: 'textile', name: t('Casquettes', 'Caps', 'قبعات'), description: t('Broderie ou impression.', 'Embroidery or print.', 'تطريز أو طباعة.'), coverImageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80', productCount: 1 },
  { id: 'c8', slug: 'mugs', name: t('Mugs', 'Mugs', 'أكواب'), description: t('Cadeaux personnalisés du quotidien.', 'Personalized everyday gifts.', 'هدايا يومية مخصصة.'), coverImageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80', productCount: 1 },
  { id: 'c9', slug: 'packaging', name: t('Packaging', 'Packaging', 'تغليف'), description: t('Un emballage qui vend.', 'Packaging that sells.', 'تغليف يبيع منتجك.'), coverImageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80', productCount: 1 },
  { id: 'c10', slug: 'signaletique', name: t('Signalétique & enseignes', 'Signage', 'لافتات إرشادية'), description: t('Guidez et marquez votre espace.', 'Guide and mark your space.', 'وجّه وميّز مساحتك.'), coverImageUrl: 'https://images.unsplash.com/photo-1568205612837-017257d2310a?w=600&q=80', productCount: 1 },
];

export const products: Product[] = [
  {
    id: 'p1', slug: 'carte-de-visite-standard', categorySlug: 'cartes-de-visite',
    name: t('Carte de visite standard', 'Standard Business Card', 'بطاقة عمل قياسية'),
    shortDescription: t('9x5cm, papier premium, recto ou recto-verso.', '9x5cm, premium paper, single or double-sided.', '9×5 سم، ورق فاخر، وجه واحد أو وجهين.'),
    description: t(
      'La carte de visite reste le support le plus direct pour laisser une impression durable. Impression haute définition sur papier premium, disponible en plusieurs grammages et finitions.',
      'The business card remains the most direct way to leave a lasting impression. High-definition printing on premium paper, available in several weights and finishes.',
      'تبقى بطاقة العمل الوسيلة الأكثر مباشرة لترك انطباع دائم. طباعة عالية الدقة على ورق فاخر.'
    ),
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=900&q=80',
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=80',
    ],
    specs: [
      { label: t('Format', 'Format', 'المقاس'), value: t('9 x 5 cm', '9 x 5 cm', '9 × 5 سم') },
      { label: t('Grammage', 'Weight', 'الوزن'), value: t('350g', '350g', '350غ') },
      { label: t('Finition', 'Finish', 'التشطيب'), value: t('Pelliculage mat ou brillant', 'Matte or gloss lamination', 'تلميع لامع أو مطفي') },
    ],
    faq: [
      { question: t('Quel délai pour 500 cartes ?', 'What is the lead time for 500 cards?', 'ما هي مدة التسليم لـ 500 بطاقة؟'), answer: t('En général 48h une fois le fichier validé.', 'Generally 48h once the file is approved.', 'عادة 48 ساعة بعد اعتماد الملف.') },
    ],
    pricingMode: 'from', priceLabel: '5 000 MRU',
    priceNote: t('les 500 exemplaires', 'per 500 units', 'لكل 500 نسخة'),
    minQuantity: 100, delay: t('48h', '48h', '48 ساعة'),
    orderForm: [
      { type: 'select', key: 'format', label: t('Format', 'Format', 'المقاس'), options: ['9x5cm standard', '8.5x5.5cm carré', 'Format personnalisé'], required: true },
      { type: 'radio', key: 'faces', label: t('Impression', 'Printing', 'الطباعة'), options: ['Recto seul', 'Recto-verso'], required: true },
      { type: 'select', key: 'finition', label: t('Finition', 'Finish', 'التشطيب'), options: ['Sans pelliculage', 'Pelliculage mat', 'Pelliculage brillant'] },
      { type: 'quantity', key: 'quantite', label: t('Quantité', 'Quantity', 'الكمية'), min: 100, required: true },
      { type: 'textarea', key: 'commentaires', label: t('Commentaires', 'Comments', 'ملاحظات') },
    ],
  },
  {
    id: 'p2', slug: 'flyer-a5', categorySlug: 'flyers',
    name: t('Flyer A5', 'A5 Flyer', 'منشور A5'),
    shortDescription: t('Le format le plus polyvalent pour vos promotions.', 'The most versatile format for your promotions.', 'الحجم الأكثر تنوعاً لعروضكم.'),
    description: t('Idéal pour les campagnes de communication ponctuelles : ouverture, promotion, événement.', 'Ideal for one-off communication campaigns: openings, promotions, events.', 'مثالي لحملات التواصل المؤقتة.'),
    images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&q=80'],
    specs: [
      { label: t('Format', 'Format', 'المقاس'), value: t('A5 (148x210mm)', 'A5 (148x210mm)', 'A5') },
      { label: t('Papier', 'Paper', 'الورق'), value: t('135g à 300g', '135g to 300g', '135غ إلى 300غ') },
    ],
    faq: [],
    pricingMode: 'from', priceLabel: '8 000 MRU', priceNote: t('les 500 exemplaires', 'per 500 units', 'لكل 500 نسخة'),
    minQuantity: 100, delay: t('24-48h', '24-48h', '24-48 ساعة'),
    orderForm: [
      { type: 'select', key: 'format', label: t('Format', 'Format', 'المقاس'), options: ['A6', 'A5', 'A4'], required: true },
      { type: 'select', key: 'grammage', label: t('Grammage papier', 'Paper weight', 'وزن الورق'), options: ['135g', '170g', '250g', '300g'], required: true },
      { type: 'radio', key: 'faces', label: t('Impression', 'Printing', 'الطباعة'), options: ['Recto seul', 'Recto-verso'], required: true },
      { type: 'select', key: 'pelliculage', label: t('Pelliculage', 'Lamination', 'التلميع'), options: ['Sans', 'Mat', 'Brillant'] },
      { type: 'quantity', key: 'quantite', label: t('Quantité', 'Quantity', 'الكمية'), min: 100, required: true },
    ],
  },
  {
    id: 'p3', slug: 'casquette-personnalisee', categorySlug: 'casquettes',
    name: t('Casquette personnalisée', 'Custom Cap', 'قبعة مخصصة'),
    shortDescription: t('Broderie ou impression, à votre image.', 'Embroidery or print, your way.', 'تطريز أو طباعة حسب رغبتك.'),
    description: t('Casquettes personnalisables par broderie ou impression textile, plusieurs coloris disponibles.', 'Caps customizable by embroidery or textile printing, several colors available.', 'قبعات قابلة للتخصيص بالتطريز أو الطباعة.'),
    images: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80',
    ],
    specs: [
      { label: t('Technique', 'Technique', 'التقنية'), value: t('Broderie ou DTF', 'Embroidery or DTF', 'تطريز أو DTF') },
    ],
    tips: [
      t('La broderie résiste mieux dans le temps que l\'impression sur tissu épais.', 'Embroidery holds up better over time than print on thick fabric.', 'يدوم التطريز لفترة أطول من الطباعة على القماش السميك.'),
      t('Un logo simple à 1-2 couleurs rend mieux en petit format.', 'A simple 1-2 color logo renders better at small size.', 'الشعار البسيط بلون أو لونين يظهر بشكل أفضل بحجم صغير.'),
    ],
    faq: [],
    pricingMode: 'quote',
    minQuantity: 10, delay: t('5-7 jours', '5-7 days', '5-7 أيام'),
    orderForm: [
      { type: 'select', key: 'couleur', label: t('Couleur', 'Color', 'اللون'), options: ['Noir', 'Blanc', 'Bleu marine', 'Jaune', 'Rouge'], required: true },
      { type: 'select', key: 'type', label: t('Type', 'Type', 'النوع'), options: ['Casquette classique', 'Casquette trucker', 'Bob'], required: true },
      { type: 'radio', key: 'technique', label: t('Broderie ou impression', 'Embroidery or print', 'تطريز أو طباعة'), options: ['Broderie', 'Impression DTF'], required: true },
      { type: 'text', key: 'position_logo', label: t('Position du logo', 'Logo position', 'موضع الشعار'), placeholder: t('Ex : Devant centré', 'Ex: Centered front', 'مثال: في الأمام وسط') },
      { type: 'quantity', key: 'quantite', label: t('Quantité', 'Quantity', 'الكمية'), min: 10, required: true },
      { type: 'textarea', key: 'commentaires', label: t('Commentaires', 'Comments', 'ملاحظات') },
    ],
  },
  {
    id: 'p5', slug: 't-shirt-personnalise', categorySlug: 'tshirts',
    name: t('T-shirt personnalisé', 'Custom T-shirt', 'قميص مخصص'),
    shortDescription: t('Impression recto, verso, ou les deux.', 'Front, back, or both-side print.', 'طباعة أمامية أو خلفية أو كلاهما.'),
    description: t('T-shirt 100% coton, personnalisable par sublimation ou DTF, toutes tailles disponibles.', '100% cotton t-shirt, customizable via sublimation or DTF, all sizes available.', 'قميص قطن 100%، قابل للتخصيص، جميع المقاسات متوفرة.'),
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80'],
    specs: [
      { label: t('Matière', 'Material', 'المادة'), value: t('100% coton', '100% cotton', 'قطن 100%') },
    ],
    tips: [
      t('Prévoyez un fichier haute résolution pour un rendu net sur grande surface.', 'Provide a high-resolution file for a crisp result on large areas.', 'قدّم ملفاً عالي الدقة لنتيجة واضحة على مساحة كبيرة.'),
    ],
    faq: [],
    pricingMode: 'quote',
    minQuantity: 10, delay: t('5-7 jours', '5-7 days', '5-7 أيام'),
    orderForm: [
      { type: 'select', key: 'taille', label: t('Taille', 'Size', 'المقاس'), options: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
      { type: 'select', key: 'couleur', label: t('Couleur', 'Color', 'اللون'), options: ['Blanc', 'Noir', 'Gris', 'Bleu marine'], required: true },
      { type: 'select', key: 'coupe', label: t('Coupe', 'Fit', 'القصة'), options: ['Regular', 'Ajustée'], required: true },
      { type: 'radio', key: 'zone_impression', label: t('Zone d\'impression', 'Print area', 'منطقة الطباعة'), options: ['Recto', 'Verso', 'Recto + Verso'], required: true },
      { type: 'quantity', key: 'quantite', label: t('Quantité', 'Quantity', 'الكمية'), min: 10, required: true },
      { type: 'textarea', key: 'commentaires', label: t('Commentaires', 'Comments', 'ملاحظات') },
    ],
  },
  {
    id: 'p4', slug: 'roll-up-standard', categorySlug: 'roll-up',
    name: t('Roll-up standard', 'Standard Roll-up', 'لوحة قابلة للطي قياسية'),
    shortDescription: t('Structure alu + toile, prêt en quelques minutes.', 'Aluminum structure + canvas, ready in minutes.', 'هيكل ألمنيوم وقماش، جاهز خلال دقائق.'),
    description: t('Le roll-up est le support incontournable pour vos salons, événements et points de vente.', 'The roll-up is essential for your trade shows, events and points of sale.', 'اللوحة القابلة للطي ضرورية لمعارضكم وفعالياتكم.'),
    images: ['https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=900&q=80'],
    specs: [{ label: t('Dimensions', 'Dimensions', 'الأبعاد'), value: t('85 x 200 cm', '85 x 200 cm', '85×200 سم') }],
    faq: [],
    pricingMode: 'quote',
    minQuantity: 1, delay: t('3-5 jours', '3-5 days', '3-5 أيام'),
    orderForm: [
      { type: 'select', key: 'dimensions', label: t('Dimensions', 'Dimensions', 'الأبعاد'), options: ['85 x 200 cm', '100 x 200 cm', 'Sur mesure'], required: true },
      { type: 'radio', key: 'structure', label: t('Structure', 'Structure', 'الهيكل'), options: ['Standard', 'Premium avec housse'], required: true },
      { type: 'radio', key: 'livraison', label: t('Livraison', 'Delivery', 'التوصيل'), options: ['Retrait à l\'atelier', 'Livraison à domicile'], required: true },
      { type: 'date', key: 'date_souhaitee', label: t('Date souhaitée', 'Desired date', 'التاريخ المطلوب') },
    ],
  },
];

export const portfolioItems: PortfolioItem[] = [
  { id: 'pf1', categorySlug: 'cartes-de-visite', title: t('Cartes premium — cabinet d\'avocats', 'Premium cards — law firm', 'بطاقات فاخرة'), imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=700&q=80' },
  { id: 'pf2', categorySlug: 'textile', title: t('Casquettes brodées — équipe événementielle', 'Embroidered caps — event team', 'قبعات مطرزة'), imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=700&q=80', beforeImageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=80' },
  { id: 'pf3', categorySlug: 'baches', title: t('Bâche façade — ouverture de magasin', 'Facade banner — store opening', 'لافتة واجهة'), imageUrl: 'https://images.unsplash.com/photo-1568205612837-017257d2310a?w=700&q=80' },
  { id: 'pf4', categorySlug: 'flyers', title: t('Flyers événementiels', 'Event flyers', 'منشورات فعالية'), imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=700&q=80' },
  { id: 'pf5', categorySlug: 'roll-up', title: t('Roll-up salon professionnel', 'Trade show roll-up', 'لوحة معرض'), imageUrl: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=700&q=80' },
  { id: 'pf6', categorySlug: 'mugs', title: t('Mugs personnalisés — cadeaux d\'entreprise', 'Custom mugs — corporate gifts', 'أكواب مخصصة'), imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=700&q=80' },
];

export const clientCompanies: ClientCompany[] = [
  { id: 'cc1', name: 'Restaurant La Table', logoUrl: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=200&q=80', slug: 'la-table' },
  { id: 'cc2', name: 'Atlas Immobilier', logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80', slug: 'atlas-immobilier' },
  { id: 'cc3', name: 'Sahara Events', logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80', slug: 'sahara-events' },
];

export const testimonials: Testimonial[] = [
  {
    id: 'r1', authorName: 'Client vérifié', authorContext: t('Restaurant, Nouakchott', 'Restaurant, Nouakchott', 'مطعم، نواكشوط'),
    rating: 5, verified: true, productSlug: 'flyer-a5', date: '2026-07-18',
    comment: t('Commande passée entièrement sur WhatsApp, livrée dans les délais annoncés.', 'Order placed entirely via WhatsApp, delivered on the announced schedule.', 'تم الطلب بالكامل عبر واتساب وتم التسليم في الموعد المحدد.'),
  },
  {
    id: 'r2', authorName: 'Client vérifié', authorContext: t('Commerce, Nouakchott', 'Retail, Nouakchott', 'متجر، نواكشوط'),
    rating: 5, verified: true, productSlug: 'carte-de-visite-standard', date: '2026-07-10',
    comment: t('Bon rapport qualité-prix et suivi clair à chaque étape.', 'Good value for money and clear tracking at every step.', 'جودة جيدة مقابل السعر ومتابعة واضحة في كل مرحلة.'),
  },
  {
    id: 'r3', authorName: 'Client vérifié', authorContext: t('Association, Nouakchott', 'Association, Nouakchott', 'جمعية، نواكشوط'),
    rating: 4, verified: true, productSlug: 'roll-up-standard', date: '2026-06-29',
    comment: t('Le roll-up est arrivé bien protégé, exactement comme prévu.', 'The roll-up arrived well protected, exactly as planned.', 'وصلت اللوحة محمية جيداً وكما هو متوقع تماماً.'),
  },
  {
    id: 'r4', authorName: 'Client vérifié', authorContext: t('Événementiel, Nouakchott', 'Events, Nouakchott', 'فعاليات، نواكشوط'),
    rating: 5, verified: true, productSlug: 'casquette-personnalisee', date: '2026-06-15',
    comment: t('Broderie nette, couleurs fidèles à la maquette envoyée.', 'Clean embroidery, colors true to the sent mockup.', 'تطريز نظيف وألوان مطابقة للتصميم المُرسل.'),
  },
];

export const homeFaq: FaqItem[] = [
  { question: t('Dois-je me déplacer pour commander ?', 'Do I need to come in person to order?', 'هل يجب أن أحضر شخصياً للطلب؟'), answer: t('Non — tout se fait en ligne : choix du produit, envoi du fichier, devis, paiement et livraison.', 'No — everything is done online: product choice, file upload, quote, payment and delivery.', 'لا — كل شيء يتم عبر الإنترنت.') },
  { question: t('Je n\'ai pas de fichier prêt, c\'est possible ?', 'I don\'t have a ready file, is that possible?', 'ليس لدي ملف جاهز، هل هذا ممكن؟'), answer: t('Oui, indiquez-le dans le formulaire et notre équipe vous accompagne dans la création.', 'Yes, indicate it in the form and our team will help you create it.', 'نعم، أشر إلى ذلك في النموذج وسيساعدك فريقنا.') },
  { question: t('Quels moyens de paiement acceptez-vous ?', 'What payment methods do you accept?', 'ما هي وسائل الدفع المقبولة؟'), answer: t('Bankily, Masrivi, Sedad, Click, BIM Bank et Amanty.', 'Bankily, Masrivi, Sedad, Click, BIM Bank and Amanty.', 'بنكيلي، مصرفي، سداد، كليك، بنك BIM وأمانتي.') },
  { question: t('Livrez-vous en dehors de Nouakchott ?', 'Do you deliver outside Nouakchott?', 'هل توصلون خارج نواكشوط؟'), answer: t('Oui, partout en Mauritanie — les frais sont communiqués avec le devis.', 'Yes, throughout Mauritania — fees are communicated with the quote.', 'نعم، في جميع أنحاء موريتانيا.') },
];
