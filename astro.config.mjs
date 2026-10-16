import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.pilanatetovo.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'mk', locales: { mk: 'mk-MK', sq: 'sq-MK' } },
    }),
  ],
});
