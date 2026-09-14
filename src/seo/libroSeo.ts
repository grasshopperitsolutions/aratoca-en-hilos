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

/**
 * The chapter's own opening words. The standfirst is written to stand alone, so
 * it makes a better meta description than the first body paragraph.
 */
export function descripcionCapitulo(capitulo: LibroCapitulo, language: Language): string {
  const { bloques } = libroTexto(language).capitulos[capitulo];
  const entradilla = bloques.find((bloque) => bloque.tipo === 'entradilla');
  if (entradilla) return resumen(entradilla.texto);
  const parrafo = bloques.find((bloque) => bloque.tipo === 'parrafo');
  return resumen(parrafo?.texto ?? '');
}
