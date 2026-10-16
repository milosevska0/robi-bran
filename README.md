# Пилана Роби Бран – website

Website for **Пилана Роби Бран** (beech lumber cut to size and A1 pellets), s. Tudence, Tetovo.
Built with [Astro](https://astro.build): plain HTML/CSS output, no database, very fast.

- Macedonian (default) at `/`, Albanian at `/sq/`
- Pages: Почетна, За нас, Производи (+ one page per product), Галерија, Контакт
- Admin panel at `/uredi` ([Decap CMS](https://decapcms.org)) so the owner can edit texts, phones, products and photos
- Contact form via [Web3Forms](https://web3forms.com) (free), Google Map, SEO data for Google (LocalBusiness), sitemap

## Run it on your computer

You need [Node.js](https://nodejs.org) 18.20 or newer (the LTS version is fine).

```bash
npm install
npm run dev
```

Open http://localhost:4321 – the site reloads when you save a file.

`npm run build` creates the final site in `dist/`. `npm run preview` shows that build locally.

## Admin panel (/uredi)

All content the owner can change lives in `src/data/*.json`, and the photos in `src/assets/uploads/`.
The admin panel edits exactly these files; on the live site every "Објави" (Publish) is saved
to GitHub and the hosting rebuilds the site in about a minute.

| What | File |
| --- | --- |
| Phones, e-mail, address, opening hours, Facebook | `src/data/kontakt.json` |
| Notice bar at the top (on/off) | `src/data/izvestuvanje.json` |
| Home page texts and photos | `src/data/pocetna.json` |
| Our values | `src/data/vrednosti.json` |
| Products (each one gets its own page) + Products page | `src/data/proizvodi.json` |
| About, Gallery, Contact pages | `src/data/za-nas.json`, `galerija.json`, `kontakt-strana.json` |
| Admin panel fields and labels | `public/uredi/config.yml` |

Every text is `{ "mk": "...", "sq": "..." }`; if `sq` is empty the Macedonian text is shown.
Write `{телефон}` in a text to insert the first phone number (if there is no phone, that sentence is left out).
Photos are resized to 800/1600 px WebP automatically when the site is built.

**Try the admin panel on your computer:** run `npm run dev`, open http://localhost:4321/uredi/
and click „Најава“. The local admin server starts by itself; changes are written to `src/data/` on your computer.

**On the live site** the panel needs a login. This is set up when the site goes on Netlify
(see "Before going live").

## Where to change the design

| What | File |
| --- | --- |
| Fixed interface texts (menu, buttons, form labels) | `src/i18n/content.ts` |
| Map location | `src/i18n/content.ts` (`business`) |
| Colours, fonts, spacing | `src/styles/global.css` |
| Page layouts | `src/views/*.astro` |
| Header, footer, form, etc. | `src/components/*.astro` |
| Logo, favicon | `public/` |

## Contact form

1. Go to https://web3forms.com, enter the pilana's e-mail and get the free access key.
2. Copy `.env.example` to `.env` and paste the key: `PUBLIC_WEB3FORMS_KEY=...`
3. Restart `npm run dev`. Messages now go to that e-mail. If the visitor wrote an e-mail address, the owner can just press Reply.

On the hosting (Cloudflare Pages / Netlify), add the same `PUBLIC_WEB3FORMS_KEY` as an environment variable.

## Before going live

- [ ] Web3Forms key (see above)
- [ ] Family reads the "За нас" texts and corrects them
- [ ] A native speaker checks the Albanian texts (`sq` in `src/data/*.json` and `content.ts`), incl. the village name "Tudencë"
- [ ] Check the map pin is exactly on the pilana (coordinates in `content.ts`)
- [x] Domain: pilanatetovo.mk
- [ ] Deploy on Netlify (build command `npm run build`, output `dist`) and connect the domain
- [ ] Admin login for the owner (GitHub OAuth on Netlify, or e-mail/password login)
- [ ] Google Search Console + Google Business Profile
