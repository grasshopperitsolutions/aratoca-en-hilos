/**
 * Client-supplied business details.
 *
 * These values are interpolated into the legal pages, the contact page, the
 * footer and the JSON-LD structured data, so every one of them is visible to
 * visitors and to crawlers.
 *
 * ⚠️ Every field marked TODO is a placeholder awaiting the client. They must be
 * replaced before handover — the legal pages are not valid without the real
 * entity details required by Ley 1581 de 2012.
 */
export const COMPANY = {
  /** Public-facing brand name. */
  name: 'Aratoca en Hilos',

  /** TODO(client): registered legal name (razón social). */
  legalName: 'Aratoca en Hilos',

  /** TODO(client): NIT / tax identification number. */
  taxId: 'NIT pendiente',

  email: 'grasshopper.it.solutions@gmail.com',

  /** TODO(client): phone in international format. */
  phone: '+57 000 000 0000',

  /** TODO(client): WhatsApp number, digits only, country code first. */
  whatsapp: '570000000000',

  address: {
    /** TODO(client): street address. */
    street: 'Dirección pendiente',
    city: 'Aratoca',
    region: 'Santander',
    country: 'Colombia',
    countryCode: 'CO',
  },

  /** Approximate municipality coordinates — refine once the address is confirmed. */
  geo: { latitude: 6.6947, longitude: -73.0161 },

  /** TODO(client): real profile URLs. Empty entries are not rendered. */
  social: {
    instagram: '',
    facebook: '',
    youtube: '',
  },

  /** Governing law for the terms of service. */
  jurisdiction: 'Colombia',
} as const;

/** Social links that actually have a URL, ready to render. */
export const SOCIAL_LINKS = Object.entries(COMPANY.social)
  .filter(([, url]) => url.length > 0)
  .map(([network, url]) => ({ network, url }));

export const WHATSAPP_URL = `https://wa.me/${COMPANY.whatsapp}`;
export const MAILTO_URL = `mailto:${COMPANY.email}`;
export const TEL_URL = `tel:${COMPANY.phone.replace(/\s+/g, '')}`;

export const FULL_ADDRESS = [
  COMPANY.address.street,
  COMPANY.address.city,
  COMPANY.address.region,
  COMPANY.address.country,
].join(', ');
