// Writes dist/sitemap.xml + dist/robots.txt after `vite build`.
// The sitemap is only generated when VITE_SITE_URL is set (in .env or the shell).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const routes = ['/', '/gallery', '/custom-sketches', '/about', '/contact'];

function readEnvUrl() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL;
  for (const file of ['.env.production.local', '.env.production', '.env.local', '.env']) {
    if (!existsSync(file)) continue;
    const match = readFileSync(file, 'utf8').match(/^VITE_SITE_URL=(.*)$/m);
    if (match && match[1].trim()) return match[1].trim();
  }
  return '';
}

const site = readEnvUrl().replace(/\/$/, '');
let robots = 'User-agent: *\nAllow: /\n';

if (site) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map((r) => `  <url><loc>${site}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
  writeFileSync(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  robots += `Sitemap: ${site}/sitemap.xml\n`;
  console.log(`sitemap.xml written for ${site}`);
} else {
  console.log('VITE_SITE_URL not set — skipped sitemap.xml (robots.txt still written).');
}
writeFileSync('dist/robots.txt', robots);
