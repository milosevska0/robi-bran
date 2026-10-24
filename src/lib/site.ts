// Everything the owner can change in the admin panel (/uredi) lives in src/data/*.json.
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
import cestiPrasanja from '../data/cesti-prasanja.json';
import type { Lang } from '../i18n/content';

export type Pair = { mk: string; sq: string };
export type Photo = { slika: string; opis: Pair };

export const data = { kontakt, izvestuvanje, pocetna, vrednosti, proizvodi, zaNas, galerija, kontaktStrana, cestiPrasanja };

// ---- Phones ---------------------------------------------------------------
// "075 353 919" -> "+38970395033"
const toTel = (n: string) => {
  const d = n.replace(/[^\d+]/g, '');
  if (d.startsWith('+')) return d;
  if (d.startsWith('00')) return '+' + d.slice(2);
  return '+389' + d.replace(/^0/, '');
};
export const phones = (kontakt.telefoni ?? []).filter((p) => p.broj?.trim()).map((p) => ({ number: p.broj.trim(), tel: toTel(p.broj) }));
export const mainPhone = phones[0];

// Texts may contain placeholders that are filled from the contact data:
//   {телефон} -> first phone number, {адреса} -> address, {работно време} -> opening hours.
// If the value is missing (e.g. no phone at all), the sentence with it is left out.
const TOKEN = /\{(телефон|telefon|адреса|adresa|работно време|rabotno vreme)\}/gi;
export function fill(text: string, lang: Lang = 'mk'): string {
  if (!text) return '';
  if (!/\{(телефон|telefon|адреса|adresa|работно време|rabotno vreme)\}/i.test(text)) return text;
  const value = (key: string) => {
    const k = key.toLowerCase();
    if (k === 'телефон' || k === 'telefon') return mainPhone?.number ?? '';
    if (k === 'адреса' || k === 'adresa') return (kontakt.adresa?.[lang] || kontakt.adresa?.mk || '').trim();
    return hours(lang).map((h, i) => (i ? h.charAt(0).toLowerCase() + h.slice(1) : h)).join('; ');
  };
  // Split into sentences but keep the original spaces/new lines between them (Markdown needs them).
  const parts = text.split(/((?<=[.!?])\s+)/);
  let out = '';
  for (let i = 0; i < parts.length; i += 2) {
    const sentence = parts[i];
    const gap = parts[i + 1] ?? '';
    if (![...sentence.matchAll(TOKEN)].every((m) => value(m[1]))) continue;
    out += sentence.replace(TOKEN, (_, k) => value(k)) + gap;
  }
  return out.trim();
}

// Pick the language from a { mk, sq } pair (falls back to Macedonian).
export const L = (p: Pair | undefined, lang: Lang) => fill((p?.[lang] || p?.mk || '').trim(), lang);

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

// ---- Blog -----------------------------------------------------------------
// Posts live in src/data/blog/*.json (one file per post). Only "objaveno: true" posts are shown.
export type Post = {
  slug: string; objaveno?: boolean; datum: string; slika?: string;
  naslov: Pair; opis?: Pair; tekst: Pair;
};
const postFiles = import.meta.glob<Post>('../data/blog/*.json', { eager: true, import: 'default' });
export const posts: Post[] = Object.values(postFiles)
  .filter((p) => p && p.objaveno && p.slug && p.naslov?.mk && p.tekst?.mk)
  .sort((a, b) => String(b.datum).localeCompare(String(a.datum)));
export const hasLang = (p: Post, lang: Lang) => lang === 'mk' || Boolean(p.naslov?.sq?.trim() && p.tekst?.sq?.trim());
export const postPath = (p: Post, lang: Lang) => (lang === 'mk' ? `/blog/${p.slug}/` : `/sq/blog/${p.slug}/`);
export const postAlt = (p: Post) => ({ mk: postPath(p, 'mk'), sq: hasLang(p, 'sq') ? postPath(p, 'sq') : '' });
export const formatDate = (d: string, lang: Lang) => {
  const dt = new Date(d);
  if (isNaN(+dt)) return d;
  return dt.toLocaleDateString(lang === 'mk' ? 'mk-MK' : 'sq-AL', { day: 'numeric', month: 'long', year: 'numeric' });
};
