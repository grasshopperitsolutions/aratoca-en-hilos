import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

import App from './App';
import { setLanguage } from './i18n/config';
import i18n from './i18n/config';
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  PAGE_KEYS,
  buildPath,
  capituloDePageKey,
  languageFromPath,
  type Language,
  type PageKey,
} from './i18n/routes';
import { SITE_ORIGIN, absoluteUrl, buildHead, renderHeadTags } from './seo/meta';
import { descripcionCapitulo } from './seo/libroSeo';
import { libroTexto } from './content/libro';
import { COMPANY } from './content/company';

const BASE_PATH = import.meta.env.BASE_URL;

/** Prefixes an app-relative path with the deployment base, as the browser sees it. */
function withBase(appPath: string): string {
  const prefix = BASE_PATH.replace(/\/+$/, '');
  return appPath === '/' ? `${prefix}/` : `${prefix}${appPath}`;
}

export interface PrerenderRoute {
  page: PageKey;
  language: Language;
  /** App-relative path, e.g. `/en/artisans`. */
  appPath: string;
  /** Output file relative to dist, e.g. `en/artisans/index.html`. */
  outputPath: string;
}

/** Every public route to prerender. Admin is deliberately absent. */
export function getRoutes(): PrerenderRoute[] {
  return LANGUAGES.flatMap((language) =>
    PAGE_KEYS.map((page) => {
      const appPath = buildPath(page, language);
      const outputPath =
        appPath === '/' ? 'index.html' : `${appPath.replace(/^\//, '')}/index.html`;
      return { page, language, appPath, outputPath };
    }),
  );
}

export interface RenderResult {
  html: string;
  head: string;
  title: string;
  lang: Language;
}

/**
 * Renders one route to static HTML.
 *
 * `StaticRouter` gets the same `basename` the browser router uses, so every
 * `<Link>` in the output already carries the `/aratoca-en-hilos/` prefix —
 * without it the markup would hydrate with mismatched hrefs and every link
 * would be broken for a crawler that does not run JavaScript.
 */
export function render(appPath: string): RenderResult {
  const language = languageFromPath(appPath);
  setLanguage(language);

  const html = renderToString(
    <StrictMode>
      <StaticRouter basename={BASE_PATH} location={withBase(appPath)}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );

  const page = PAGE_KEYS.find((key) => buildPath(key, language) === appPath);
  if (!page) throw new Error(`No page matches the prerender path "${appPath}"`);

  const head = buildHead(page, language);
  return { html, head: renderHeadTags(head), title: head.title, lang: language };
}

/**
 * Renders the 404 page for `dist/404.html`, which GitHub Pages serves for any
 * path that is not a prerendered directory. Explicitly `noindex` — an indexed
 * 404 is worse than no page at all.
 */
export function renderNotFound(): RenderResult {
  setLanguage(DEFAULT_LANGUAGE);

  const html = renderToString(
    <StrictMode>
      <StaticRouter basename={BASE_PATH} location={withBase('/404')}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );

  return {
    html,
    head: '<meta name="robots" content="noindex,nofollow" data-head="1" />',
    title: i18n.getFixedT(DEFAULT_LANGUAGE)('notFound.title'),
    lang: DEFAULT_LANGUAGE,
  };
}

/**
 * Paths emitted as an empty-root shell rather than prerendered content.
 *
 * The admin panel must never be prerendered — its markup would end up in the
 * static output and in the deploy artifact. But it still needs a real file at
 * each URL: without one the host falls back to 404.html (or index.html), the
 * client then renders the admin app over that markup, and React throws the
 * server HTML away with a hydration error. An empty root sidesteps this
 * entirely, because `main.tsx` renders fresh instead of hydrating.
 */
export function getShellPages(): string[] {
  return [
    'admin',
    'admin/artesanos',
    'admin/mensajes',
    'admin/archivos',
    'admin/administradores',
    'admin/registro',
  ];
}

export interface RedirectPage {
  /** Output file relative to dist, without the `/index.html` suffix. */
  outputPath: string;
  /** Absolute destination, used for the canonical link. */
  target: string;
  /** Root-relative destination, used for the actual redirect. */
  href: string;
}

/**
 * Retired URLs that must keep working.
 *
 * These are emitted as standalone HTML stubs that do NOT load the app bundle.
 * Letting the SPA handle the redirect instead would mean the browser first
 * hydrates whatever fallback the host served (the home page, or 404.html)
 * against a completely different tree — a guaranteed hydration mismatch, and a
 * wasted round trip. A static stub with a canonical link also lets crawlers
 * consolidate the old URL into the new one.
 */
export function getRedirects(): RedirectPage[] {
  return [
    // The About page was replaced by Artesanos when the site was built out.
    {
      outputPath: 'acerca-de',
      target: absoluteUrl(buildPath('artesanos', 'es')),
      href: `${withBase(buildPath('artesanos', 'es'))}/`,
    },
    // The book was rebuilt on the printed first edition, which has six
    // chapters rather than seven. The retired seventh sends readers to the
    // contents rather than to a 404.
    {
      outputPath: 'libro/capitulo-7',
      target: absoluteUrl(buildPath('libro', 'es')),
      href: `${withBase(buildPath('libro', 'es'))}/`,
    },
    {
      outputPath: 'en/book/chapter-7',
      target: absoluteUrl(buildPath('libro', 'en')),
      href: `${withBase(buildPath('libro', 'en'))}/`,
    },
  ];
}

/**
 * The redirect itself is root-relative so the stub also works on localhost and
 * on the client's own domain; only the canonical is absolute, as it must be.
 */
export function renderRedirect(redirect: RedirectPage): string {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Redirigiendo…</title>
    <link rel="canonical" href="${redirect.target}" />
    <meta http-equiv="refresh" content="0; url=${redirect.href}" />
    <meta name="robots" content="noindex, follow" />
  </head>
  <body>
    <p>Esta página se ha movido. <a href="${redirect.href}">Continuar</a>.</p>
  </body>
</html>
`;
}

/**
 * Crawl hints per page. Artisans change whenever the admin publishes one; the
 * book is a finished publication and will not change between editions.
 */
function crawlHints(page: PageKey): { changefreq: string; priority: string } {
  if (page === 'home') return { changefreq: 'weekly', priority: '1.0' };
  if (page === 'artesanos') return { changefreq: 'weekly', priority: '0.8' };
  if (page === 'libro') return { changefreq: 'monthly', priority: '0.9' };
  if (capituloDePageKey(page)) return { changefreq: 'yearly', priority: '0.7' };
  return { changefreq: 'monthly', priority: '0.8' };
}

/** Sitemap with reciprocal hreflang alternates on every entry. */
export function getSitemap(): string {
  const entries = getRoutes()
    .map(({ page, language }) => {
      const { changefreq, priority } = crawlHints(page);
      const alternates = LANGUAGES.map(
        (code) =>
          `    <xhtml:link rel="alternate" hreflang="${code === 'es' ? 'es-CO' : 'en'}" href="${absoluteUrl(buildPath(page, code))}" />`,
      )
        .concat(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(buildPath(page, DEFAULT_LANGUAGE))}" />`,
        )
        .join('\n');

      return [
        '  <url>',
        `    <loc>${absoluteUrl(buildPath(page, language))}</loc>`,
        alternates,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
}

export function getRobots(): string {
  const base = BASE_PATH.replace(/\/+$/, '');
  return `User-agent: *
Allow: /
Disallow: ${base}/admin

Sitemap: ${SITE_ORIGIN}${base}/sitemap.xml
`;
}

/**
 * `llms.txt` — a plain-language site summary for AI crawlers, most of which do
 * not execute JavaScript. Half of the "GEO" side of the SEO deliverable.
 */
export function getLlmsTxt(): string {
  const t = i18n.getFixedT('en');
  const libro = libroTexto('en');

  // Chapters have no `nav.*` or `seo.*` keys by design — their names and
  // summaries come from the book, exactly as `buildHead` resolves them.
  const label = (page: PageKey): string => {
    const capitulo = capituloDePageKey(page);
    return capitulo ? libro.capitulos[capitulo].titulo : t(`nav.${page}`);
  };

  const summary = (page: PageKey): string => {
    const capitulo = capituloDePageKey(page);
    return capitulo ? descripcionCapitulo(capitulo, 'en') : t(`seo.${page}.description`);
  };

  const links = PAGE_KEYS.filter((page) => page !== 'home')
    .map(
      (page) =>
        `- [${label(page)}](${absoluteUrl(buildPath(page, 'en'))}): ${summary(page)}`,
    )
    .join('\n');

  return `# ${COMPANY.name}

> ${t('seo.home.description')}

${COMPANY.name} documents the craft of fique (Furcraea, a natural agave fibre) in
Aratoca, Santander, Colombia. The site covers the seven-stage process that turns
the plant into thread, profiles the artisans who practise it, and publishes
"${libro.titulo}" — a free illustrated book on the history, transformation and
future of fique in Santander, issued by the ${libro.editor}. Each of its seven
chapters is a separate page, listed below.

The site is published in Spanish (at the root) and English (under /en/).

## Pages

${links}

## Contact

- Email: ${COMPANY.email}
- Location: ${COMPANY.address.city}, ${COMPANY.address.region}, ${COMPANY.address.country}
`;
}
