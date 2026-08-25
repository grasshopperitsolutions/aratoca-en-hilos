/**
 * Single source of truth for the site's bilingual URL structure.
 *
 * Spanish lives at the root (`/artesanos`) and is the hreflang x-default;
 * English lives under `/en/` with English slugs (`/en/artisans`) because
 * translated slugs rank better than transliterated ones.
 *
 * The router (`App.tsx`), the language switcher and the SEO manifest
 * (`src/seo/manifest.ts`) all derive from this map, so they can never drift.
 */

export const LANGUAGES = ['es', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

/** Spanish is the primary audience: it sits at the root and is the x-default. */
export const DEFAULT_LANGUAGE: Language = 'es';

export type PageKey =
  | 'home'
  | 'artesanos'
  | 'tallerFique'
  | 'contacto'
  | 'terminos'
  | 'privacidad';

/** Ordered so that generated route lists and the sitemap follow site hierarchy. */
export const PAGE_KEYS: readonly PageKey[] = [
  'home',
  'artesanos',
  'tallerFique',
  'contacto',
  'terminos',
  'privacidad',
];

/** Slug per page per language. The home page is the empty slug. */
export const ROUTE_SLUGS: Record<PageKey, Record<Language, string>> = {
  home: { es: '', en: '' },
  artesanos: { es: 'artesanos', en: 'artisans' },
  tallerFique: { es: 'taller-fique', en: 'fique-workshop' },
  contacto: { es: 'contacto', en: 'contact' },
  terminos: { es: 'terminos', en: 'terms' },
  privacidad: { es: 'privacidad', en: 'privacy' },
};

/** Pages that appear in the main navigation, in display order. */
export const NAV_PAGES: readonly PageKey[] = [
  'home',
  'artesanos',
  'tallerFique',
  'contacto',
];

/** Pages linked from the footer's legal column. */
export const LEGAL_PAGES: readonly PageKey[] = ['privacidad', 'terminos'];

/**
 * App-relative path for a page in a language, e.g. `/artesanos`, `/en/artisans`.
 * Never includes the deployment base path — react-router's `basename` adds that.
 */
export function buildPath(page: PageKey, language: Language): string {
  const prefix = language === DEFAULT_LANGUAGE ? '' : `/${language}`;
  const slug = ROUTE_SLUGS[page][language];
  if (!slug) return prefix || '/';
  return `${prefix}/${slug}`;
}

/** Reads the language out of an app-relative pathname. */
export function languageFromPath(pathname: string): Language {
  const segment = pathname.replace(/^\/+/, '').split('/')[0];
  return (LANGUAGES as readonly string[]).includes(segment)
    ? (segment as Language)
    : DEFAULT_LANGUAGE;
}

/** Reverse lookup: which page a pathname points at, or `null` if unrecognised. */
export function pageFromPath(pathname: string): PageKey | null {
  const language = languageFromPath(pathname);
  const normalised = `/${pathname.replace(/^\/+|\/+$/g, '')}`;
  const match = PAGE_KEYS.find((page) => buildPath(page, language) === normalised);
  return match ?? null;
}

/**
 * Same page, other language — used by the header switcher so the visitor keeps
 * their place instead of being dumped on the home page.
 */
export function alternatePath(pathname: string, target: Language): string {
  const page = pageFromPath(pathname);
  return page ? buildPath(page, target) : buildPath('home', target);
}
