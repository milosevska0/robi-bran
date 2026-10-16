import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import http from 'node:http';

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
  site: 'https://www.pilanatetovo.mk',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/uredi/'),
      i18n: { defaultLocale: 'mk', locales: { mk: 'mk-MK', sq: 'sq-MK' } },
    }),
    localAdmin(),
  ],
});
