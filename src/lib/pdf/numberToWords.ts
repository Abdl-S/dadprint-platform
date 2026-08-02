const UNITS = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
const TEENS = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];

function chunkToWords(n: number): string {
  if (n === 0) return '';
  if (n < 10) return UNITS[n];
  if (n < 20) return TEENS[n - 10];
  if (n < 100) {
    const ten = Math.floor(n / 10);
    const unit = n % 10;
    if (ten === 7 || ten === 9) {
      const sep = unit === 1 && ten === 7 ? ' et ' : '-';
      return `${TENS[ten]}${sep}${TEENS[unit]}`;
    }
    const sep = unit === 1 && ten !== 8 ? ' et ' : unit > 0 ? '-' : '';
    return `${TENS[ten]}${sep}${unit > 0 ? UNITS[unit] : ''}${ten === 8 && unit === 0 ? 's' : ''}`;
  }
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  const hPrefix = hundred === 1 ? 'cent' : `${UNITS[hundred]} cent`;
  const hSuffix = hundred > 1 && rest === 0 ? 's' : '';
  return rest === 0 ? `${hPrefix}${hSuffix}` : `${hPrefix} ${chunkToWords(rest)}`;
}

/** Convertit un nombre entier en toutes lettres françaises — pour la mention légale des montants sur devis/factures. */
export function numberToFrenchWords(n: number): string {
  if (n === 0) return 'zéro';
  const abs = Math.floor(Math.abs(n));

  const millions = Math.floor(abs / 1_000_000);
  const thousands = Math.floor((abs % 1_000_000) / 1000);
  const rest = abs % 1000;

  const parts: string[] = [];
  if (millions > 0) parts.push(`${millions === 1 ? 'un million' : `${chunkToWords(millions)} millions`}`);
  if (thousands > 0) parts.push(`${thousands === 1 ? 'mille' : `${chunkToWords(thousands)} mille`}`);
  if (rest > 0) parts.push(chunkToWords(rest));

  return parts.join(' ');
}

/** Formate un montant en MRU avec sa version en toutes lettres, prête pour la mention légale du document. */
export function formatAmountInWords(amount: number): string {
  return `${numberToFrenchWords(amount)} MRU`;
}
