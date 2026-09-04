import i18n from '../i18n/config';
import { COMPANY, SOCIAL_LINKS } from '../content/company';
import { FAQ_IDS } from '../content/faq';
import artesanosSnapshot from '../content/artesanos.generated.json';
import { libroTexto } from '../content/libro';
import {
  buildPath,
  capituloDePageKey,
  pageKeyDeCapitulo,
  type Language,
  type PageKey,
} from '../i18n/routes';
import { LIBRO_CAPITULOS, type LibroCapitulo } from '../types/libro';
import { descripcionCapitulo } from './libroSeo';
import { absoluteUrl } from './origin';
import type { Artesano } from '../types/content';

/**
 * Structured data, built per page and per language.
 *
 * Kept separate from `meta.ts` so the schema markup can grow (products, events,
 * the Phase 2 book) without turning the head builder into a grab bag. The URL
 * helper comes from `origin.ts` rather than `meta.ts`, which imports this file.
 */

type UrlBuilder = (appPath: string) => string;

function organisation(url: UrlBuilder) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url('/')}#organization`,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: url('/'),
    email: COMPANY.email,
    telephone: COMPANY.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.address.street,
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.region,
      addressCountry: COMPANY.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: COMPANY.geo.latitude,
      longitude: COMPANY.geo.longitude,
    },
    ...(SOCIAL_LINKS.length > 0 ? { sameAs: SOCIAL_LINKS.map((link) => link.url) } : {}),
  };
}

function website(url: UrlBuilder, language: Language) {
  const t = i18n.getFixedT(language);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url('/')}#website`,
    name: t('seo.siteName'),
    description: t('seo.home.description'),
    url: url(buildPath('home', language)),
    inLanguage: language === 'es' ? 'es-CO' : 'en',
    publisher: { '@id': `${url('/')}#organization` },
  };
}

/**
 * Breadcrumbs. Chapter pages nest one level deeper (Home › Book › Chapter) and
 * take their name from the book rather than a `nav.*` key, which does not exist
 * for them by design.
 */
function breadcrumbs(url: UrlBuilder, page: PageKey, language: Language) {
  const t = i18n.getFixedT(language);
  const capitulo = capituloDePageKey(page);

  const trail: { name: string; path: string }[] = [
    { name: t('nav.home'), path: buildPath('home', language) },
  ];

  if (capitulo) {
    const libro = libroTexto(language);
    trail.push(
      { name: libro.titulo, path: buildPath('libro', language) },
      { name: libro.capitulos[capitulo].titulo, path: buildPath(page, language) },
    );
  } else {
    trail.push({ name: t(`nav.${page}`), path: buildPath(page, language) });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: url(crumb.path),
    })),
  };
}

/** Stable identifier the chapter Articles point back at. */
function bookId(url: UrlBuilder, language: Language): string {
  return `${url(buildPath('libro', language))}#book`;
}

/**
 * The book itself, with its chapters as parts.
 *
 * `hasPart` is what makes the chapter pages legible to a crawler as one work
 * rather than seven unrelated articles — the reason the chapters are separate
 * URLs in the first place.
 */
function book(url: UrlBuilder, language: Language) {
  const libro = libroTexto(language);

  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': bookId(url, language),
    name: libro.titulo,
    alternateName: libro.subtitulo,
    url: url(buildPath('libro', language)),
    inLanguage: language === 'es' ? 'es-CO' : 'en',
    bookFormat: 'https://schema.org/EBook',
    datePublished: '2026',
    isAccessibleForFree: true,
    author: { '@type': 'Organization', name: libro.editor },
    publisher: { '@id': `${url('/')}#organization` },
    abstract: libro.prologo.parrafos[0],
    hasPart: LIBRO_CAPITULOS.map((numero) => ({
      '@type': 'Chapter',
      position: numero,
      name: libro.capitulos[numero].titulo,
      url: url(buildPath(pageKeyDeCapitulo(numero), language)),
    })),
  };
}

/** One chapter, tied back to the book it belongs to. */
function chapterArticle(url: UrlBuilder, capitulo: LibroCapitulo, language: Language) {
  const libro = libroTexto(language);
  const page = pageKeyDeCapitulo(capitulo);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: libro.capitulos[capitulo].titulo,
    description: descripcionCapitulo(capitulo, language),
    url: url(buildPath(page, language)),
    inLanguage: language === 'es' ? 'es-CO' : 'en',
    isPartOf: { '@id': bookId(url, language) },
    position: capitulo,
    author: { '@type': 'Organization', name: libro.editor },
    publisher: { '@id': `${url('/')}#organization` },
  };
}

function faqPage(language: Language) {
  const t = i18n.getFixedT(language);
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_IDS.map((id) => ({
      '@type': 'Question',
      name: t(`tallerFique.faq.${id}.question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`tallerFique.faq.${id}.answer`),
      },
    })),
  };
}

/**
 * Artisans come from the build-time snapshot, which is exactly what the
 * prerendered HTML shows — so the markup always describes the visible content.
 */
function artisanList(url: UrlBuilder, language: Language) {
  const artesanos = artesanosSnapshot as Artesano[];
  if (artesanos.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: i18n.getFixedT(language)('artesanos.title'),
    itemListElement: artesanos.map((artesano, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: artesano.nombre,
        jobTitle: artesano.oficio[language],
        description: artesano.bio[language],
        ...(artesano.fotoUrl ? { image: artesano.fotoUrl } : {}),
        worksFor: { '@id': `${url('/')}#organization` },
      },
    })),
  };
}

/** Assembles the JSON-LD blocks for a page. Empty entries are dropped. */
export function buildJsonLd(page: PageKey, language: Language): unknown[] {
  const url: UrlBuilder = absoluteUrl;

  const blocks: (object | null)[] = [];

  if (page === 'home') {
    blocks.push(organisation(url), website(url, language));
  } else {
    blocks.push(breadcrumbs(url, page, language));
  }

  if (page === 'contacto') blocks.push(organisation(url));
  if (page === 'tallerFique') blocks.push(faqPage(language));
  if (page === 'artesanos') blocks.push(artisanList(url, language));
  if (page === 'libro') blocks.push(book(url, language));

  // A chapter page carries both the Article and the Book it belongs to, so the
  // work is fully described even when a crawler only ever sees one chapter.
  const capitulo = capituloDePageKey(page);
  if (capitulo) blocks.push(chapterArticle(url, capitulo, language), book(url, language));

  return blocks.filter((block): block is object => block !== null);
}
