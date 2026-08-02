import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { readFile } from 'fs/promises';
import path from 'path';
import { formatAmountInWords } from './numberToWords';

/** Sépare les milliers par un espace normal — `toLocaleString('fr-FR')` utilise une espace fine
 * insécable (U+202F) que la police standard du PDF ne sait pas encoder. */
function formatMRU(n: number): string {
  return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} MRU`;
}

export interface DocumentLine {
  qty: number;
  description: string;
  unitPrice: number;
}

export interface DocumentData {
  kind: 'devis' | 'facture';
  reference: string;
  date: Date;
  clientName: string;
  clientAddress?: string;
  lines: DocumentLine[];
}

// Couleurs reprises du modèle fourni par le client — jamais celles de la charte web (le document
// papier suit son propre modèle existant, indépendant du site).
const BLUE = rgb(0.09, 0.62, 0.85);
const GRAY_BAR = rgb(0.85, 0.85, 0.85);
const INK = rgb(0.13, 0.13, 0.13);

/**
 * Reproduit fidèlement le modèle de devis/facture papier déjà utilisé par
 * DadPrint (fourni en exemple) : en-tête logo, bloc client, tableau des
 * lignes, total, mention légale en toutes lettres, pied de page. Un seul
 * générateur pour les deux documents — seul le mot "DEVIS"/"FACTURE" change,
 * comme demandé.
 *
 * Ne reproduit pas le tampon/signature manuscrite du modèle fourni : c'est
 * un élément physique propre à chaque exemplaire signé à la main, pas
 * quelque chose qu'un document généré automatiquement peut représenter
 * honnêtement.
 */
export async function generateDocumentPdf(data: DocumentData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

  // Logo officiel — jamais recréé, le même fichier exact utilisé sur le site
  try {
    const logoBytes = await readFile(path.join(process.cwd(), 'public/brand/dadprint-logo.png'));
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(90 / logoImage.width);
    page.drawImage(logoImage, { x: 40, y: height - 40 - logoDims.height, width: logoDims.width, height: logoDims.height });
  } catch {
    // Si le logo est introuvable au moment du build, le document reste généré sans bloquer l'opération
  }

  let y = height - 130;

  // Bloc client (gauche)
  page.drawText('Client (e) :', { x: 40, y, size: 11, font: fontBold, color: INK });
  page.drawText(data.clientName, { x: 115, y, size: 11, font: fontRegular, color: INK });
  if (data.clientAddress) {
    y -= 18;
    page.drawText('Adresse :', { x: 40, y, size: 11, font: fontBold, color: INK });
    page.drawText(data.clientAddress, { x: 115, y, size: 11, font: fontRegular, color: INK });
  }

  // Référence + date (droite)
  const title = data.kind === 'devis' ? 'DEVIS' : 'FACTURE';
  const titleText = `${title} N°${data.reference}`;
  const titleSize = 20;
  const titleWidth = fontBoldItalic.widthOfTextAtSize(titleText, titleSize);
  page.drawText(titleText, { x: width - 40 - titleWidth, y: height - 100, size: titleSize, font: fontBoldItalic, color: INK });
  const dateText = `Date : ${data.date.toLocaleDateString('fr-FR')}`;
  const dateWidth = fontRegular.widthOfTextAtSize(dateText, 13);
  page.drawText(dateText, { x: width - 40 - dateWidth, y: height - 125, size: 13, font: fontRegular, color: INK });

  // Tableau — en-tête bleu arrondi
  y -= 50;
  const tableX = 40;
  const tableWidth = width - 80;
  const headerHeight = 30;
  page.drawRectangle({ x: tableX, y: y - headerHeight, width: tableWidth, height: headerHeight, color: BLUE });
  const cols = { qty: tableX + 20, desc: tableX + 90, pu: tableX + 300, total: tableX + tableWidth - 110 };
  page.drawText('Qté', { x: cols.qty, y: y - 20, size: 11, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Description', { x: cols.desc, y: y - 20, size: 11, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('P.U', { x: cols.pu, y: y - 20, size: 11, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('P.Total', { x: cols.total, y: y - 20, size: 11, font: fontBold, color: rgb(1, 1, 1) });

  y -= headerHeight;
  let total = 0;
  for (const line of data.lines) {
    const lineTotal = line.qty * line.unitPrice;
    total += lineTotal;
    y -= 45;
    page.drawText(String(line.qty).padStart(2, '0'), { x: cols.qty, y: y + 15, size: 13, font: fontBold, color: BLUE });
    page.drawText(line.description, { x: cols.desc, y: y + 15, size: 10.5, font: fontRegular, color: INK, maxWidth: 200 });
    page.drawText(formatMRU(line.unitPrice), { x: cols.pu, y: y + 15, size: 10.5, font: fontRegular, color: INK });
    page.drawText(formatMRU(lineTotal), { x: cols.total, y: y + 15, size: 10.5, font: fontRegular, color: INK });
    page.drawLine({ start: { x: tableX, y: y }, end: { x: tableX + tableWidth, y: y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
  }

  // Total — barre grise + pastille bleue
  y -= 40;
  const totalLabel = data.kind === 'devis' ? 'MONTANT TOTAL HT' : 'MONTANT TOTAL TTC';
  page.drawRectangle({ x: tableX, y: y - 32, width: tableWidth, height: 32, color: GRAY_BAR });
  page.drawText(totalLabel, { x: tableX + 20, y: y - 21, size: 12, font: fontBold, color: INK });
  const totalStr = formatMRU(total);
  const pillWidth = 120;
  page.drawRectangle({ x: tableX + tableWidth - pillWidth, y: y - 32, width: pillWidth, height: 32, color: BLUE });
  const totalStrWidth = fontBold.widthOfTextAtSize(totalStr, 12);
  page.drawText(totalStr, { x: tableX + tableWidth - pillWidth / 2 - totalStrWidth / 2, y: y - 21, size: 12, font: fontBold, color: rgb(1, 1, 1) });

  // Mention légale en toutes lettres
  y -= 70;
  const legalLabel = data.kind === 'devis' ? 'Arrêtée le présent Devis à la somme de' : 'Arrêtée la présente Facture à la somme de';
  const amountWords = formatAmountInWords(total);
  page.drawText(`${legalLabel} ${amountWords.charAt(0).toUpperCase()}${amountWords.slice(1)}`, {
    x: 40, y, size: 11, font: fontBold, color: INK, maxWidth: tableWidth,
  });

  // Pied de page
  page.drawLine({ start: { x: 40, y: 70 }, end: { x: width - 40, y: 70 }, thickness: 0.5, color: BLUE });
  const footerLine1 = 'DadPrint Nouakchott - Mauritanie  Email : dadprint.mr@gmail.com';
  const footerLine2 = 'Tel : +222 34763421';
  page.drawText(footerLine1, { x: (width - fontRegular.widthOfTextAtSize(footerLine1, 10)) / 2, y: 50, size: 10, font: fontRegular, color: INK });
  page.drawText(footerLine2, { x: (width - fontRegular.widthOfTextAtSize(footerLine2, 10)) / 2, y: 35, size: 10, font: fontRegular, color: INK });

  return pdfDoc.save();
}
