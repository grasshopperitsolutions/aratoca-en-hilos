/**
 * Titles and descriptions for the book's pages.
 *
 * Sourced from the book itself rather than from `seo.<page>.title` keys: a
 * chapter's name already exists in `content/libro/{es,en}.ts`, and copying
 * fourteen of them into the locale files would guarantee they eventually drift
 * from the text they describe. The other pages keep using translation keys.
 */

import { libroTexto } from '../content/libro';
import type { Language } from '../i18n/routes';
import type { LibroCapitulo } from '../types/libro';

/** Meta descriptions are truncated by search engines past roughly 160 chars. */
const MAX_DESCRIPTION = 155;

/**
 * Trims prose to a meta-description length, breaking on a word and never
 * mid-word. Returns the text unchanged when it already fits.
 */
export function resumen(texto: string, max = MAX_DESCRIPTION): string {
  const limpio = texto.trim();
  if (limpio.length <= max) return limpio;

  const recortado = limpio.slice(0, max);
  const ultimoEspacio = recortado.lastIndexOf(' ');
  return `${recortado.slice(0, ultimoEspacio > 0 ? ultimoEspacio : max).trimEnd()}…`;
}

export function tituloCapitulo(capitulo: LibroCapitulo, language: Language): string {
  const libro = libroTexto(language);
  return `${libro.capitulos[capitulo].titulo} — ${libro.titulo}`;
}

export function descripcionCapitulo(capitulo: LibroCapitulo, language: Language): string {
  const { parrafos } = libroTexto(language).capitulos[capitulo];
  return resumen(parrafos[0] ?? '');
}
