// Everything the owner can change in the admin panel (/admin) lives in src/data/*.json.
// This file reads those files and turns them into ready-to-use values for the pages.
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import kontakt from '../data/kontakt.json';
import izvestuvanje from '../data/izvestuvanje.json';
import pocetna from '../data/pocetna.json';
import vrednosti from '../data/vrednosti.json';
import proizvodi from '../data/proizvodi.json';
import zaNas from '../data/za-nas.json';
import galerija from '../data/galerija.json';
import kontaktStrana from '../data/kontakt-strana.json';
import type { Lang } from '../i18n/content';

export type Pair = { mk: string; sq: string };
export type Photo = { slika: string; opis: Pair };

export const data = { kontakt, izvestuvanje, pocetna, vrednosti, proizvodi, zaNas, galerija, kontaktStrana };

// ---- Phones ---------------------------------------------------------------
// "070 395 033" -> "+38970395033"
const toTel = (n: string) => {
  const d = n.replace(/[^\d+]/g, '');
  if (d.startsWith('+')) return d;
  if (d.startsWith('00')) return '+' + d.slice(2);
  return '+389' + d.replace(/^0/, '');
};
export const phones = (kontakt.telefoni ?? []).filter((p) => p.broj?.trim()).map((p) => ({ number: p.broj.trim(), tel: toTel(p.broj) }));
export const mainPhone = phones[0];

// Texts may contain {телефон}: it becomes the first phone number.
// If there is no phone at all, the sentence with {телефон} is left out.
const TOKEN = /\{(телефон|telefon)\}/gi;
export function fill(text: string): string {
  if (!text) return '';
  if (!TOKEN.test(text)) return text;
  TOKEN.lastIndex = 0;
  if (mainPhone) return text.replace(TOKEN, mainPhone.number);
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => !/\{(телефон|telefon)\}/i.test(s))
    .join(' ')
    .trim();
}

// Pick the language from a { mk, sq } pair (falls back to Macedonian).
export const L = (p: Pair | undefined, lang: Lang) => fill((p?.[lang] || p?.mk || '').trim());

// ---- Opening hours --------------------------------------------------------
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const dayName = {
  mk: ['Понеделник', 'Вторник', 'Среда', 'Четврток', 'Петок', 'Сабота', 'Недела'],
  mkTo: ['понеделник', 'вторник', 'среда', 'четврток', 'петок', 'сабота', 'недела'],
  sq: ['E hënë', 'E martë', 'E mërkurë', 'E enjte', 'E premte', 'E shtunë', 'E diel'],
  sqTo: ['të hënën', 'të martën', 'të mërkurën', 'të enjten', 'të premten', 'të shtunën', 'të dielën'],
};
const schemaDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type HoursRow = { denovi?: string[]; od?: string; do?: string };
const rows: HoursRow[] = (kontakt.rabotnoVreme ?? []).filter((r: HoursRow) => r.denovi?.length && r.od && r.do);
const idx = (r: HoursRow) => DAYS.map((d, i) => (r.denovi!.includes(d) ? i : -1)).filter((i) => i >= 0);

// Groups the chosen days into runs: [Mon..Fri] -> "Понеделник до петок", [Sat] -> "Сабота"
function daysText(ix: number[], lang: Lang) {
  const runs: number[][] = [];
  for (const i of ix) {
    const last = runs[runs.length - 1];
    if (last && last[last.length - 1] === i - 1) last.push(i);
    else runs.push([i]);
  }
  const part = (run: number[], first: boolean) => {
    const a = run[0], b = run[run.length - 1];
    const startName = first ? dayName[lang][a] : dayName[lang === 'mk' ? 'mkTo' : 'sq'][a].toLowerCase();
    if (run.length === 1) return startName;
    if (run.length === 2) return lang === 'mk' ? `${startName} и ${dayName.mkTo[b]}` : `${startName} dhe ${dayName.sq[b].toLowerCase()}`;
    return lang === 'mk' ? `${startName} до ${dayName.mkTo[b]}` : `${startName} deri ${dayName.sqTo[b]}`;
  };
  return runs.map((r, i) => part(r, i === 0)).join(', ');
}
export const hours = (lang: Lang) =>
  rows.map((r) => `${daysText(idx(r), lang)}, ${r.od} ${lang === 'mk' ? 'до' : 'deri'} ${r.do}`);
export const hoursSchema = rows.map((r) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: idx(r).map((i) => schemaDay[i]),
  opens: r.od,
  closes: r.do,
}));

// ---- Products -------------------------------------------------------------
export type Product = (typeof proizvodi.proizvodi)[number];
export const products: Product[] = proizvodi.proizvodi ?? [];
export const productPath = (p: Product, lang: Lang) =>
  lang === 'mk' ? `/proizvodi/${p.adresa.mk}/` : `/sq/produkte/${p.adresa.sq}/`;
export const productAlt = (p: Product) => ({ mk: productPath(p, 'mk'), sq: productPath(p, 'sq') });

// ---- Images ---------------------------------------------------------------
// Uploaded photos (src/assets/uploads) are resized to 800 and 1600 px WebP at build time.
const files = import.meta.glob<ImageMetadata>('/src/assets/uploads/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' });
export function findImage(path: string | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  const key = '/' + path.replace(/^\/+/, '');
  return files[key] ?? files[decodeURI(key)];
}
export async function responsive(path: string | undefined) {
  const meta = findImage(path);
  if (!meta) return undefined;
  const widths = [800, 1600].filter((w) => w < meta.width);
  if (!widths.includes(Math.min(meta.width, 1600))) widths.push(Math.min(meta.width, 1600));
  const out = await Promise.all(widths.map((w) => getImage({ src: meta, width: w, format: 'webp', quality: 80 })));
  return {
    src: out[out.length - 1].src,
    srcset: out.map((o, i) => `${o.src} ${widths[i]}w`).join(', '),
    width: widths[widths.length - 1],
    height: Math.round((meta.height / meta.width) * widths[widths.length - 1]),
  };
}
