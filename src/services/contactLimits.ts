import type { Language } from '../i18n/routes';

/**
 * Contact form shape and limits.
 *
 * Deliberately free of Firebase imports: the contact page needs these for
 * client-side validation on first paint, while the submit path (and the whole
 * Firestore SDK behind it) is loaded only when someone actually submits.
 *
 * These limits are duplicated in `firestore.rules` — the copy here produces
 * useful error messages, the copy there is what actually enforces anything.
 * Keep the two in step.
 */
export const CONTACT_LIMITS = {
  nameMax: 120,
  emailMax: 200,
  phoneMax: 40,
  messageMin: 10,
  messageMax: 2000,
} as const;

export interface ContactoInput {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  idioma: Language;
}

/** Thrown when the same browser submits again too soon. */
export const THROTTLED_ERROR_NAME = 'ThrottledError';
