import type { AssetTag, LibroTexto } from '../../types/libro';
import { CAPITULOS, capitulosDeParte } from '../../content/libro/estructura';
import { LIBRO_PARTES, LIBRO_CAPITULOS } from '../../types/libro';

/**
 * Turns the book into a sequence of physical pages.
 *
 * The reader draws each page onto a canvas, so unlike the HTML chapter pages
 * there is no reflow: a page holds exactly the lines that fit, and the rest
 * spills onto the next one. Pagination therefore has to measure real text in a
 * real font, which means this runs in the browser only — never during
 * prerender.
 */

export const PAGE_W = 1000;
export const PAGE_H = 1400;
export const MARGIN = 92;

/** Palette, mirroring the tokens in index.css. Canvas cannot read CSS vars. */
export const INK = {
  cream: '#F7F2E9',
  charcoal: '#2E2118',
  earth: '#6B4226',
  penca: '#4C7A3D',
  fique: '#D9C7A3',
  terracotta: '#B85C38',
  stone: '#A79E8E',
} as const;

export type Pagina =
  | { kind: 'portada'; titulo: string; subtitulo: string; editor: string; version: string }
  | { kind: 'parte'; numero: number; titulo: string; subtitulo: string }
  | { kind: 'capitulo'; numero: number; eyebrow: string; titulo: string }
  | { kind: 'texto'; eyebrow: string; lineas: string[] }
  | { kind: 'callout'; eyebrow: string; etiqueta: string; titulo: string; lineas: string[] }
  | { kind: 'figura'; eyebrow: string; tag: AssetTag; titulo: string; pie: string }
  | { kind: 'colofon'; titulo: string; lineas: string[] };

/** Which chapter a page belongs to, for the reader's progress display. */
export interface PaginaConCapitulo {
  pagina: Pagina;
  capitulo: number | null;
}

const BODY_FONT = '30px "Nunito Sans", sans-serif';
const BODY_LEADING = 46;

/** Lines of body text that fit on one page below the running head. */
const LINES_PER_PAGE = Math.floor((PAGE_H - MARGIN * 2 - 70) / BODY_LEADING);

let medidor: CanvasRenderingContext2D | null = null;

function contextoDeMedida(): CanvasRenderingContext2D {
  if (!medidor) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas unavailable');
    medidor = ctx;
  }
  return medidor;
}

/** Greedy word wrap against the real font metrics. */
export function envolver(texto: string, maxAncho: number, font = BODY_FONT): string[] {
  const ctx = contextoDeMedida();
  ctx.font = font;

  const lineas: string[] = [];
  let actual = '';

  for (const palabra of texto.split(/\s+/)) {
    const tentativa = actual ? `${actual} ${palabra}` : palabra;
    if (ctx.measureText(tentativa).width <= maxAncho) {
      actual = tentativa;
    } else {
      if (actual) lineas.push(actual);
      actual = palabra;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

/** Splits wrapped lines into page-sized chunks, keeping a blank line between paragraphs. */
function repartir(parrafos: readonly string[], maxAncho: number): string[][] {
  const todas: string[] = [];
  parrafos.forEach((parrafo, index) => {
    if (index > 0) todas.push('');
    todas.push(...envolver(parrafo, maxAncho));
  });

  const paginas: string[][] = [];
  for (let i = 0; i < todas.length; i += LINES_PER_PAGE) {
    // Never open a page with a blank spacer line.
    const trozo = todas.slice(i, i + LINES_PER_PAGE);
    while (trozo[0] === '') trozo.shift();
    if (trozo.length > 0) paginas.push(trozo);
  }
  return paginas.length > 0 ? paginas : [[]];
}

/**
 * Builds the whole book as pages.
 *
 * Order follows the printed book: cover, foreword, then each part opener
 * followed by its chapters. Figures get a page of their own — they are the
 * reason the client wanted a book rather than a scrolling page.
 */
export function construirPaginas(libro: LibroTexto): PaginaConCapitulo[] {
  const ancho = PAGE_W - MARGIN * 2;
  const salida: PaginaConCapitulo[] = [];
  const push = (pagina: Pagina, capitulo: number | null = null) =>
    salida.push({ pagina, capitulo });

  push({
    kind: 'portada',
    titulo: libro.titulo,
    subtitulo: libro.subtitulo,
    editor: libro.editor,
    version: libro.version,
  });

  // Foreword.
  push({ kind: 'capitulo', numero: 0, eyebrow: libro.editor, titulo: libro.prologo.titulo });
  for (const lineas of repartir(libro.prologo.parrafos, ancho)) {
    push({ kind: 'texto', eyebrow: libro.prologo.titulo, lineas });
  }
  for (const callout of libro.prologo.callouts ?? []) {
    push({
      kind: 'callout',
      eyebrow: libro.prologo.titulo,
      etiqueta: callout.tipo,
      titulo: callout.titulo,
      lineas: envolver(callout.texto, ancho),
    });
  }

  for (const numeroParte of LIBRO_PARTES) {
    const parte = libro.partes[numeroParte];
    push({
      kind: 'parte',
      numero: numeroParte,
      titulo: parte.titulo,
      subtitulo: parte.subtitulo,
    });

    for (const numero of capitulosDeParte(numeroParte)) {
      const capitulo = libro.capitulos[numero];
      const eyebrow = `${parte.titulo} · ${numero}`;

      push({ kind: 'capitulo', numero, eyebrow, titulo: capitulo.titulo }, numero);

      for (const lineas of repartir(capitulo.parrafos, ancho)) {
        push({ kind: 'texto', eyebrow: capitulo.titulo, lineas }, numero);
      }

      for (const callout of capitulo.callouts ?? []) {
        push(
          {
            kind: 'callout',
            eyebrow: capitulo.titulo,
            etiqueta: callout.tipo,
            titulo: callout.titulo,
            lineas: envolver(callout.texto, ancho),
          },
          numero,
        );
      }

      // The seven steps and the curriculum are long lists; give each a page.
      if (CAPITULOS[numero].bloques.includes('sietePasos')) {
        for (const paso of libro.pasos.items) {
          push(
            {
              kind: 'callout',
              eyebrow: libro.pasos.titulo,
              etiqueta: 'paso',
              titulo: `${String(paso.numero).padStart(2, '0')} · ${paso.titulo}`,
              lineas: envolver(paso.texto, ancho),
            },
            numero,
          );
        }
      }

      if (CAPITULOS[numero].bloques.includes('modulos7')) {
        libro.modulos.items.forEach((modulo, index) => {
          push(
            {
              kind: 'callout',
              eyebrow: libro.modulos.titulo,
              etiqueta: 'modulo',
              titulo: `${index + 1} · ${modulo.titulo}`,
              lineas: envolver(modulo.texto, ancho),
            },
            numero,
          );
        });
      }

      for (const tag of CAPITULOS[numero].assets) {
        push(
          {
            kind: 'figura',
            eyebrow: capitulo.titulo,
            tag,
            titulo: libro.assets[tag].titulo,
            pie: libro.assets[tag].pie,
          },
          numero,
        );
      }
    }
  }

  push({
    kind: 'colofon',
    titulo: libro.editor,
    lineas: envolver(libro.sinopsis, ancho),
  });

  // A book has two faces per leaf, so an odd count would leave a half leaf.
  if (salida.length % 2 !== 0) {
    push({ kind: 'texto', eyebrow: '', lineas: [] });
  }

  return salida;
}

/** First page index belonging to a chapter, for deep links and the contents menu. */
export function paginaDeCapitulo(paginas: PaginaConCapitulo[], numero: number): number {
  const indice = paginas.findIndex(
    (entrada) => entrada.capitulo === numero && entrada.pagina.kind === 'capitulo',
  );
  return indice >= 0 ? indice : 0;
}

export { LIBRO_CAPITULOS };
