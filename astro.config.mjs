import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.pilanatetovo.mk',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/'),
      i18n: { defaultLocale: 'mk', locales: { mk: 'mk-MK', sq: 'sq-MK' } },
    }),
  ],
});
