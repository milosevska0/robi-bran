import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// After the build: write sitemap-images.xml with every photo on every page (for Google Images).
function imageSitemap() {
  return {
    name: 'image-sitemap',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir);
        const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        const unesc = (t) => t.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
        const pages = [];
        const walk = (d) => {
          for (const f of fs.readdirSync(d, { withFileTypes: true })) {
            const full = path.join(d, f.name);
            if (f.isDirectory()) { if (f.name !== 'uredi' && f.name !== '_astro') walk(full); }
            else if (f.name === 'index.html') pages.push(full);
          }
        };
        walk(root);
        const entries = [];
        for (const file of pages.sort()) {
          const html = fs.readFileSync(file, 'utf8');
          const loc = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
          if (!loc) continue;
          const origin = new URL(loc).origin;
          const seen = new Set();
          const imgs = [];
          for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
            const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
            const alt = tag.match(/\salt="([^"]*)"/)?.[1] ?? '';
            if (!src || !alt || src.endsWith('.svg') || seen.has(src)) continue;
            seen.add(src);
            imgs.push({ loc: new URL(unesc(src), origin).href, alt: unesc(alt) });
          }
          if (imgs.length) entries.push(`  <url>\n    <loc>${esc(loc)}</loc>\n${imgs.map((i) => `    <image:image><image:loc>${esc(i.loc)}</image:loc></image:image>`).join('\n')}\n  </url>`);
        }
        fs.writeFileSync(path.join(root, 'sitemap-images.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.join('\n')}\n</urlset>\n`);
      },
    },
  };
}

// In `npm run dev` the admin panel (/uredi) saves straight to the files on this computer.
// The small Decap server for that is started automatically and reached through /api/v1/
// on the same address as the site, so browsers and ad blockers don't block it.
function localAdmin() {
  return {
    name: 'local-admin',
    hooks: {
      'astro:server:setup': ({ server }) => {
        // Forward /api/v1 to the Decap server
        server.middlewares.use('/api/v1', (req, res) => {
          const fwd = http.request({ host: '127.0.0.1', port: 8081, path: '/api/v1', method: req.method, headers: req.headers }, (r) => {
            res.writeHead(r.statusCode || 502, r.headers);
            r.pipe(res);
          });
          fwd.on('error', () => { res.statusCode = 502; res.end('Admin server not running'); });
          req.pipe(fwd);
        });
        let entry;
        try { entry = createRequire(import.meta.url).resolve('decap-server/dist/index.js'); } catch { return; }
        const child = spawn(process.execPath, [entry], { env: { ...process.env, PORT: '8081' }, stdio: 'ignore' });
        const stop = () => { try { child.kill(); } catch {} };
        process.on('exit', stop);
        process.on('SIGINT', () => { stop(); process.exit(0); });
      },
    },
  };
}

export default defineConfig({
  site: 'https://pilanatetovo.mk',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/uredi/'),
      i18n: { defaultLocale: 'mk', locales: { mk: 'mk-MK', sq: 'sq-MK' } },
    }),
    localAdmin(),
    imageSitemap(),
  ],
});
