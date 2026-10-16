// /llms.txt — a short plain-text summary of the business for AI assistants.
// Built from the same data as the site, so it stays up to date automatically.
import type { APIRoute } from 'astro';
import { t, routes } from '../i18n/content';
import { data, phones, hours, products, productPath, posts, postPath, L } from '../lib/site';

export const GET: APIRoute = ({ site }) => {
  const u = (p: string) => new URL(p, site ?? 'https://pilanatetovo.mk').href;
  const k = data.kontakt;
  const lines = [
    `# ${t.mk.brand} (Pilana Robi Bran) – Pilana Tetovo`,
    '',
    `> ${L(data.pocetna.seo?.opis, 'mk')}`,
    '',
    `Семејна пилана во с. Туденце, Тетово, Северна Македонија. Pilana / sawmill in Tudence, Tetovo, North Macedonia. Albanian: ${t.sq.brand}.`,
    '',
    '## Контакт',
    `- Адреса: ${L(k.adresa, 'mk')}`,
    ...phones.map((p) => `- Телефон: ${p.number}`),
    ...(k.email?.trim() ? [`- Е-пошта: ${k.email.trim()}`] : []),
    ...hours('mk').map((h) => `- Работно време: ${h}`),
    '- Нема достава: производите се подигаат од пиланата.',
    ...(k.facebook?.trim() ? [`- Facebook: ${k.facebook.trim()}`] : []),
    '',
    '## Производи',
    ...products.map((p) => `- [${L(p.ime, 'mk')}](${u(productPath(p, 'mk'))}): ${L(p.kratokOpis, 'mk')}`),
    '',
    '## Често поставувани прашања',
    ...(data.cestiPrasanja.prasanja ?? []).flatMap((q) => [`- ${L(q.prasanje, 'mk')} ${L(q.odgovor, 'mk')}`]),
    '',
    '## Страни',
    `- [Почетна](${u(routes.home.mk)})`,
    `- [За нас](${u(routes.about.mk)})`,
    `- [Производи](${u(routes.products.mk)})`,
    `- [Галерија](${u(routes.gallery.mk)})`,
    `- [Контакт](${u(routes.contact.mk)})`,
    `- [Shqip / Albanian](${u(routes.home.sq)})`,
    ...(posts.length ? ['', '## Блог', ...posts.map((p) => `- [${L(p.naslov, 'mk')}](${u(postPath(p, 'mk'))})`)] : []),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
