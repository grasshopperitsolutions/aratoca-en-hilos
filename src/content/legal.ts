import { COMPANY, FULL_ADDRESS } from './company';
import type { Language } from '../i18n/routes';

/**
 * Fixed publication date for the legal documents.
 *
 * Deliberately a constant rather than `new Date()`: the legal pages are
 * prerendered, so a runtime date would differ between the static HTML and the
 * hydrated page. Bump this whenever the wording changes.
 */
export const LEGAL_UPDATED_ISO = '2026-08-24';

const DATE_LOCALES: Record<Language, string> = { es: 'es-CO', en: 'en-GB' };

export function formatLegalDate(language: Language): string {
  return new Date(`${LEGAL_UPDATED_ISO}T00:00:00Z`).toLocaleDateString(
    DATE_LOCALES[language],
    { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' },
  );
}

/** Section order for each legal document, matching the translation keys. */
export const TERMS_SECTIONS = [
  'aceptacion',
  'objeto',
  'propiedad',
  'uso',
  'enlaces',
  'formulario',
  'disponibilidad',
  'responsabilidad',
  'datos',
  'modificaciones',
  'ley',
  'contacto',
] as const;

export const PRIVACY_SECTIONS = [
  'responsable',
  'datos',
  'finalidades',
  'autorizacion',
  'derechos',
  'procedimiento',
  'conservacion',
  'encargados',
  'cookies',
  'seguridad',
  'cambios',
  'contacto',
] as const;

/** Values interpolated into the legal copy, sourced from the company config. */
export const LEGAL_VALUES = {
  company: COMPANY.name,
  legalName: COMPANY.legalName,
  taxId: COMPANY.taxId,
  email: COMPANY.email,
  phone: COMPANY.phone,
  address: FULL_ADDRESS,
  jurisdiction: COMPANY.jurisdiction,
};
