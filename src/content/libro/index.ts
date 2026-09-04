/**
 * Language-aware access to the book's text.
 *
 * Structure comes from `estructura.ts` and is language-neutral; prose comes from
 * here. Both are plain modules rather than Firestore documents: the book is a
 * finished publication, not admin-editable content, and the chapter pages are
 * prerendered, so a fetch would buy nothing and cost a round trip.
 */

import type { Language } from '../../i18n/routes';
import type { LibroTexto } from '../../types/libro';
import { LIBRO_EN } from './en';
import { LIBRO_ES } from './es';

const TEXTOS: Record<Language, LibroTexto> = { es: LIBRO_ES, en: LIBRO_EN };

export function libroTexto(language: Language): LibroTexto {
  return TEXTOS[language];
}

export { LIBRO_ES, LIBRO_EN };
