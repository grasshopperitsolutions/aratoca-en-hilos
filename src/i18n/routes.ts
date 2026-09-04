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

import { LIBRO_CAPITULOS, type LibroCapitulo } from '../types/libro';

export const LANGUAGES = ['es', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

/** Spanish is the primary audience: it sits at the root and is the x-default. */
export const DEFAULT_LANGUAGE: Language = 'es';

/**
 * One page key per book chapter, e.g. `libroCap3`.
 *
 * Generated rather than hand-listed so adding a chapter to the book is a single
 * edit in `types/libro.ts` — the router, sitemap, hreflang and prerender
 * manifest all follow from `PAGE_KEYS`.
 */
export type LibroCapituloKey = `libroCap${LibroCapitulo}`;

export const LIBRO_CAPITULO_KEYS: readonly LibroCapituloKey[] = LIBRO_CAPITULOS.map(
  (numero) => `libroCap${numero}` as LibroCapituloKey,
);

export type PageKey =
  | 'home'
  | 'artesanos'
  | 'tallerFique'
  | 'libro'
  | LibroCapituloKey
  | 'contacto'
  | 'terminos'
  | 'privacidad';

/** Ordered so that generated route lists and the sitemap follow site hierarchy. */
export const PAGE_KEYS: readonly PageKey[] = [
  'home',
  'artesanos',
  'tallerFique',
  'libro',
  ...LIBRO_CAPITULO_KEYS,
  'contacto',
  'terminos',
  'privacidad',
];

const CAPITULO_SLUGS = Object.fromEntries(
  LIBRO_CAPITULOS.map((numero) => [
    `libroCap${numero}`,
    { es: `libro/capitulo-${numero}`, en: `book/chapter-${numero}` },
  ]),
) as Record<LibroCapituloKey, Record<Language, string>>;

/** Slug per page per language. The home page is the empty slug. */
export const ROUTE_SLUGS: Record<PageKey, Record<Language, string>> = {
  home: { es: '', en: '' },
  artesanos: { es: 'artesanos', en: 'artisans' },
  tallerFique: { es: 'taller-fique', en: 'fique-workshop' },
  libro: { es: 'libro', en: 'book' },
  ...CAPITULO_SLUGS,
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
 * Chapter number behind a page key, or `null` for any other page.
 *
 * Lets the SEO layer and the chapter component source their titles from the book
 * itself rather than duplicating fourteen chapter names into the locale files.
 */
export function capituloDePageKey(page: PageKey): LibroCapitulo | null {
  const match = /^libroCap(\d+)$/.exec(page);
  if (!match) return null;
  const numero = Number(match[1]);
  return (LIBRO_CAPITULOS as readonly number[]).includes(numero)
    ? (numero as LibroCapitulo)
    : null;
}

/** Page key for a chapter number. */
export function pageKeyDeCapitulo(numero: LibroCapitulo): LibroCapituloKey {
  return `libroCap${numero}` as LibroCapituloKey;
}

/**
 * Same page, other language — used by the header switcher so the visitor keeps
 * their place instead of being dumped on the home page.
 */
export function alternatePath(pathname: string, target: Language): string {
  const page = pageFromPath(pathname);
  return page ? buildPath(page, target) : buildPath('home', target);
}
