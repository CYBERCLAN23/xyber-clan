/**
 * Post-build step for build/index.html. Runs after `vite build`.
 *
 * Maintenance ON:
 *   - Renders the maintenance page to HTML and puts it inside #root, with its
 *     CSS and the Geist latin @font-face inlined. The page paints from the first
 *     HTML response: no JavaScript, no external stylesheet, no loader.
 *   - A tiny head script checks the address. On a real page it skips the main
 *     stylesheet, so the images get the bandwidth first and the small
 *     maintenance bundle (which hydrates the markup) follows on its own. On
 *     anything else (404, admin) it hides that markup and loads the full site
 *     and its stylesheet as usual.
 * Maintenance OFF:
 *   - Adds modulepreload hints for the site bundle so it downloads in parallel
 *     with the entry instead of after it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer, loadEnv } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'build');
const indexPath = path.join(out, 'index.html');
const manifestDir = path.join(out, '.vite');
const manifest = JSON.parse(fs.readFileSync(path.join(manifestDir, 'manifest.json'), 'utf8'));

const env = { ...loadEnv('production', root, ''), ...process.env };
const flag = String(env.VITE_MAINTENANCE ?? 'on').toLowerCase();
const maintenance = !['off', 'false', '0', 'no'].includes(flag);

/** All JS and CSS files a manifest chunk needs, minus what the entry already loads. */
function closure(key) {
  const js = [];
  const css = [];
  const seen = new Set(['src/index.jsx', ...(manifest['src/index.jsx']?.imports || [])]);
  const walk = (k) => {
    if (seen.has(k) || !manifest[k]) return;
    seen.add(k);
    const c = manifest[k];
    js.push(`/${c.file}`);
    (c.css || []).forEach((f) => css.push(`/${f}`));
    (c.imports || []).forEach(walk);
  };
  walk(key);
  return { js, css };
}

const app = closure('src/AppRoot.jsx');
const mt = closure('src/pages/maintenance/mount.jsx'); // css is inlined; js loads on its own
let html = fs.readFileSync(indexPath, 'utf8');

const cssLink = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/index-[^"]+\.css)"[^>]*>/);
if (!cssLink) throw new Error('prerender: main stylesheet link not found in build/index.html');
const mainCss = cssLink[1];

if (maintenance) {
  // 1. Render the page exactly as the client will hydrate it.
  const vite = await createServer({
    root,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
  });
  const { default: MaintenancePage } = await vite.ssrLoadModule('/src/pages/maintenance/MaintenancePage.jsx');
  const { PUBLIC_PATHS } = await vite.ssrLoadModule('/src/config/routes.js');
  const React = await import('react');
  const { renderToString } = await import('react-dom/server');
  const shell = renderToString(React.createElement(MaintenancePage));
  await vite.close();

  // 2. Critical CSS: the maintenance styles plus the latin Geist face.
  const read = (f) => fs.readFileSync(path.join(out, f), 'utf8');
  const fontFace = (read(mainCss).match(/@font-face\{[^}]*geist-latin-wght-normal[^}]*\}/) || [''])[0];
  const fontUrl = (fontFace.match(/url\(([^)]+\.woff2)\)/) || [])[1];
  const critical = fontFace + mt.css.map(read).join('');

  // 3. Route guard: shell on real pages, full site everywhere else.
  const guard = `(function(){var d=document,h=d.head,P=${JSON.stringify(PUBLIC_PATHS)},`
    + `p=(location.pathname.replace(/\\/+$/,'')||'/').toLowerCase();`
    + `function m(f){var l=d.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href=f;h.appendChild(l)}`
    // Real page: nothing to preload; images get the bandwidth, the small hydration bundle follows.
    + `if(P.indexOf(p)>-1){}`
    + `else{d.documentElement.setAttribute('data-noshell','');${JSON.stringify(app.js)}.forEach(m);`
    + `d.write('<link rel="stylesheet" crossorigin href="${mainCss}">')}})();`;

  const head = [
    fontUrl ? `<link rel="preload" as="font" type="font/woff2" crossorigin href="${fontUrl}">` : '',
    `<style>[data-noshell] [data-mt-root]{display:none}${critical}</style>`,
    `<script>${guard}</script>`,
    `<noscript><link rel="stylesheet" href="${mainCss}"></noscript>`,
  ].join('\n    ');

  html = html
    .replace(cssLink[0], head)
    .replace('<div id="root"></div>', `<div id="root">${shell}</div>`);
  if (!html.includes('data-mt-root')) throw new Error('prerender: could not inject the maintenance markup');
  console.log(`prerender: maintenance shell injected (${(shell.length / 1024).toFixed(1)} KB markup, ${(critical.length / 1024).toFixed(1)} KB critical CSS)`);
} else {
  const hints = app.js.map((f) => `<link rel="modulepreload" crossorigin href="${f}">`).join('\n    ');
  html = html.replace('</head>', `    ${hints}\n  </head>`);
  console.log(`prerender: maintenance off, ${app.js.length} modulepreload hints added`);
}

fs.writeFileSync(indexPath, html);
fs.rmSync(manifestDir, { recursive: true, force: true });
