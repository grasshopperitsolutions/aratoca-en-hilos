import i18n from '../i18n/config';
import { COMPANY, SOCIAL_LINKS } from '../content/company';
import { FAQ_IDS } from '../content/faq';
import artesanosSnapshot from '../content/artesanos.generated.json';
import { buildPath, type Language, type PageKey } from '../i18n/routes';
import type { Artesano } from '../types/content';

/**
 * Structured data, built per page and per language.
 *
 * Kept separate from `meta.ts` so the schema markup can grow (products, events,
 * the Phase 2 book) without turning the head builder into a grab bag.
 *
 * Note this module cannot import from `meta.ts` — `meta.ts` imports it — so the
 * absolute-URL helper is passed in by the caller instead.
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

function breadcrumbs(url: UrlBuilder, page: PageKey, language: Language) {
  const t = i18n.getFixedT(language);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('nav.home'),
        item: url(buildPath('home', language)),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t(`nav.${page}`),
        item: url(buildPath(page, language)),
      },
    ],
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
  // Imported lazily to avoid a circular import with meta.ts at module scope.
  const url: UrlBuilder = (appPath) => {
    const origin = (
      import.meta.env.VITE_SITE_ORIGIN || 'https://grasshoppersolutions.online'
    ).replace(/\/+$/, '');
    const basePrefix = import.meta.env.BASE_URL.replace(/\/+$/, '');
    const suffix = appPath === '/' ? '/' : `${appPath}/`;
    return `${origin}${basePrefix}${suffix}`;
  };

  const blocks: (object | null)[] = [];

  if (page === 'home') {
    blocks.push(organisation(url), website(url, language));
  } else {
    blocks.push(breadcrumbs(url, page, language));
  }

  if (page === 'contacto') blocks.push(organisation(url));
  if (page === 'tallerFique') blocks.push(faqPage(language));
  if (page === 'artesanos') blocks.push(artisanList(url, language));

  return blocks.filter((block): block is object => block !== null);
}
