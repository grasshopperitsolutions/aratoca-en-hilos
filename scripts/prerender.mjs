/**
 * Turns the SPA into a set of static HTML pages.
 *
 * Runs after both Vite builds: the client build produces `dist/index.html`
 * (used here as the template, complete with its hashed script and style tags),
 * and the SSR build produces `dist-ssr/entry-server.js`, which knows how to
 * render each route and what its head should contain.
 *
 * The result is a plain folder of real HTML — deployable to GitHub Pages under
 * a sub-path, handed to a client as a zip, or dropped on any static host.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = path.resolve('dist');
const SSR_ENTRY = path.resolve('dist-ssr/entry-server.js');

const {
  getRoutes,
  render,
  renderNotFound,
  getRedirects,
  renderRedirect,
  getShellPages,
  getSitemap,
  getRobots,
  getLlmsTxt,
} = await import(pathToFileURL(SSR_ENTRY).href);

const template = await readFile(path.join(DIST, 'index.html'), 'utf8');

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Injects a rendered route into the client template.
 *
 * The static `<title>` and `<meta name="description">` from index.html are
 * replaced rather than appended to, otherwise every page would ship two of each
 * and crawlers would pick whichever they liked.
 */
function compose({ html, head, title, lang }) {
  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/\n?\s*<meta name="description"[^>]*\/?>/, '')
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

async function emit(relativePath, contents) {
  const target = path.join(DIST, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
  return relativePath;
}

const routes = getRoutes();
for (const route of routes) {
  const html = compose(render(route.appPath));
  await emit(route.outputPath, html);

  // Also emit the flat form (`en/artisans.html` beside `en/artisans/index.html`).
  //
  // Without it, a hard load of the URL *without* a trailing slash depends on the
  // host redirecting to the directory. GitHub Pages does; plenty of static
  // servers do not, and they fall through to the SPA fallback and serve the
  // home page's HTML — which then hydrates against a different page and throws
  // away the server markup. Both files carry the same canonical URL, so the
  // duplication costs nothing in search.
  if (route.outputPath !== 'index.html') {
    await emit(route.outputPath.replace(/\/index\.html$/, '.html'), html);
  }

  console.log(`[prerender] ${route.appPath.padEnd(20)} -> dist/${route.outputPath}`);
}

/**
 * Admin shell: the real app bundle, but an empty root and a noindex tag.
 * Nothing is prerendered into it, so there is no server markup for the client
 * to disagree with and nothing about the panel leaks into the static output.
 */
function composeShell() {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, '<title>Administración — Aratoca en Hilos</title>')
    .replace(/\n?\s*<meta name="description"[^>]*\/?>/, '')
    .replace('</head>', '    <meta name="robots" content="noindex,nofollow" />\n  </head>');
}

for (const shellPath of getShellPages()) {
  const shell = composeShell();
  await emit(`${shellPath}/index.html`, shell);
  await emit(`${shellPath}.html`, shell);
  console.log(`[prerender] /${shellPath.padEnd(19)} -> shell (noindex, empty root)`);
}

// Retired URLs, as standalone stubs that never boot the app.
for (const redirect of getRedirects()) {
  const stub = renderRedirect(redirect);
  await emit(`${redirect.outputPath}/index.html`, stub);
  await emit(`${redirect.outputPath}.html`, stub);
  console.log(`[prerender] /${redirect.outputPath.padEnd(19)} -> ${redirect.target}`);
}

// GitHub Pages serves this for any path that is not a prerendered directory.
await emit('404.html', compose(renderNotFound()));

await emit('sitemap.xml', getSitemap());
await emit('robots.txt', getRobots());
await emit('llms.txt', getLlmsTxt());

// Stops GitHub Pages running the output through Jekyll, which would drop any
// file or directory whose name starts with an underscore.
await emit('.nojekyll', '');

console.log(`[prerender] ${routes.length} routes, plus 404.html, sitemap.xml, robots.txt, llms.txt`);
