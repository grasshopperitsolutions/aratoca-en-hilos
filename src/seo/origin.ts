/**
 * Canonical origin and deployment base path.
 *
 * Lives in its own module because both the SEO layer and the admin invitation
 * emails need to build absolute URLs, and `meta.ts` cannot be imported from
 * `jsonld.ts` (which `meta.ts` itself imports).
 *
 * `SITE_ORIGIN` must be the real production origin — a placeholder silently
 * poisons canonical URLs, hreflang, the sitemap and every invitation link.
 */
export const SITE_ORIGIN = (
  import.meta.env.VITE_SITE_ORIGIN || 'https://grasshoppersolutions.online'
).replace(/\/+$/, '');

/** Deployment sub-path, e.g. `/aratoca-en-hilos/`. */
export const BASE_PATH = import.meta.env.BASE_URL;

/**
 * Absolute, canonical URL for an app-relative path.
 *
 * Always ends in a slash, matching the directory-style files the prerender step
 * emits (`dist/artesanos/index.html` → `/aratoca-en-hilos/artesanos/`).
 */
export function absoluteUrl(appPath: string): string {
  const basePrefix = BASE_PATH.replace(/\/+$/, '');
  const suffix = appPath === '/' ? '/' : `${appPath}/`;
  return `${SITE_ORIGIN}${basePrefix}${suffix}`;
}

/**
 * Absolute URL for a path that carries a query string, so no trailing slash is
 * appended. Used for invitation links.
 */
export function absoluteUrlWithQuery(appPath: string, query: Record<string, string>): string {
  const basePrefix = BASE_PATH.replace(/\/+$/, '');
  const search = new URLSearchParams(query).toString();
  return `${SITE_ORIGIN}${basePrefix}${appPath}?${search}`;
}
