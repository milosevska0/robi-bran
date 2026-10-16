# Пилана Роби Бран – website

Website for **Пилана Роби Бран** (beech lumber cut to size and A1 pellets), s. Tudence, Tetovo.
Built with [Astro](https://astro.build): plain HTML/CSS output, no database, very fast.

- Macedonian (default) at `/`, Albanian at `/sq/`
- Pages: Почетна, За нас, Производи, Букова граѓа, А1 пелет, Галерија, Контакт
- Contact form via [Web3Forms](https://web3forms.com) (free), Google Map, SEO data for Google (LocalBusiness), sitemap

## Run it on your computer

You need [Node.js](https://nodejs.org) 18.20 or newer (the LTS version is fine).

```bash
npm install
npm run dev
```

Open http://localhost:4321 – the site reloads when you save a file.

`npm run build` creates the final site in `dist/`. `npm run preview` shows that build locally.

## Where to change things

| What | File |
| --- | --- |
| All texts (MK + SQ), phones, address, e-mail, Facebook, map | `src/i18n/content.ts` |
| Colours, fonts, spacing | `src/styles/global.css` |
| Page layouts | `src/views/*.astro` |
| Header, footer, form, etc. | `src/components/*.astro` |
| Photos | `public/images/` (each photo has an `-800` and `-1600` version) |
| Logo, favicon | `public/` |

## Contact form

1. Go to https://web3forms.com, enter the pilana's e-mail and get the free access key.
2. Copy `.env.example` to `.env` and paste the key: `PUBLIC_WEB3FORMS_KEY=...`
3. Restart `npm run dev`. Messages now go to that e-mail. If the visitor wrote an e-mail address, the owner can just press Reply.

On the hosting (Cloudflare Pages / Netlify), add the same `PUBLIC_WEB3FORMS_KEY` as an environment variable.

## Before going live

- [ ] Add the business e-mail in `src/i18n/content.ts` (`business.email`)
- [ ] Web3Forms key (see above)
- [ ] Family reads the "За нас" texts and corrects them
- [ ] A native speaker checks the Albanian texts (`sq` in `content.ts`), incl. the village name "Tudencë"
- [ ] Check the map pin is exactly on the pilana (coordinates in `content.ts`)
- [ ] Buy the domain, deploy (Cloudflare Pages or Netlify, build command `npm run build`, output `dist`)
- [ ] Google Search Console + Google Business Profile
