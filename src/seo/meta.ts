import i18n from '../i18n/config';
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  buildPath,
  type Language,
  type PageKey,
} from '../i18n/routes';
import { OG_IMAGE } from '../content/images';
import { buildJsonLd } from './jsonld';
import { absoluteUrl } from './origin';

export { SITE_ORIGIN, BASE_PATH, absoluteUrl } from './origin';

/** BCP-47 tags for `hreflang` and `og:locale`. */
const LOCALE_TAGS: Record<Language, string> = { es: 'es-CO', en: 'en' };

export interface HeadAlternate {
  hreflang: string;
  href: string;
}

export interface HeadData {
  lang: Language;
  locale: string;
  title: string;
  description: string;
  canonical: string;
  alternates: HeadAlternate[];
  ogImage: string;
  jsonLd: unknown[];
}

/** Metadata for one page in one language. */
export function buildHead(page: PageKey, language: Language): HeadData {
  const t = i18n.getFixedT(language);

  const alternates: HeadAlternate[] = LANGUAGES.map((code) => ({
    hreflang: LOCALE_TAGS[code],
    href: absoluteUrl(buildPath(page, code)),
  }));

  // Spanish is the primary audience, so it is what unmatched locales get.
  alternates.push({
    hreflang: 'x-default',
    href: absoluteUrl(buildPath(page, DEFAULT_LANGUAGE)),
  });

  return {
    lang: language,
    locale: LOCALE_TAGS[language],
    title: t(`seo.${page}.title`),
    description: t(`seo.${page}.description`),
    canonical: absoluteUrl(buildPath(page, language)),
    alternates,
    ogImage: OG_IMAGE,
    jsonLd: buildJsonLd(page, language),
  };
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Serialises head data to HTML for the prerender step.
 *
 * Every tag carries `data-head="1"` so `useDocumentHead` can find and replace
 * exactly these on client-side navigation, leaving the hand-written tags in
 * index.html alone. The `<title>` is handled separately by the prerender script,
 * which swaps the one index.html already ships.
 *
 * Inside the JSON-LD block, `<` becomes its `<` escape so a value can never
 * close the script tag early.
 */
export function renderHeadTags(head: HeadData): string {
  const tags = [
    `<meta name="description" content="${escapeAttribute(head.description)}" data-head="1" />`,
    `<link rel="canonical" href="${head.canonical}" data-head="1" />`,
    ...head.alternates.map(
      (alternate) =>
        `<link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" data-head="1" />`,
    ),
    `<meta property="og:type" content="website" data-head="1" />`,
    `<meta property="og:site_name" content="${escapeAttribute(i18n.getFixedT(head.lang)('seo.siteName'))}" data-head="1" />`,
    `<meta property="og:locale" content="${head.locale}" data-head="1" />`,
    `<meta property="og:title" content="${escapeAttribute(head.title)}" data-head="1" />`,
    `<meta property="og:description" content="${escapeAttribute(head.description)}" data-head="1" />`,
    `<meta property="og:url" content="${head.canonical}" data-head="1" />`,
    `<meta property="og:image" content="${escapeAttribute(head.ogImage)}" data-head="1" />`,
    `<meta name="twitter:card" content="summary_large_image" data-head="1" />`,
    `<meta name="twitter:title" content="${escapeAttribute(head.title)}" data-head="1" />`,
    `<meta name="twitter:description" content="${escapeAttribute(head.description)}" data-head="1" />`,
    `<meta name="twitter:image" content="${escapeAttribute(head.ogImage)}" data-head="1" />`,
    ...head.jsonLd.map(
      (entry) =>
        `<script type="application/ld+json" data-head="1">${JSON.stringify(entry).replace(/</g, '\\u003c')}</script>`,
    ),
  ];

  return tags.join('\n    ');
}
