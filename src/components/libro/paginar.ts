import {
  GLOSARIO_ACTIVIDADES,
  LAMINAS,
  LIBRO_CAPITULOS,
  LIBRO_PARTES,
  PARTE_DE_CAPITULO,
  capitulosDeParte,
} from '../../content/libro/estructura';
import type { Bloque, LibroCapitulo, LibroParte, LibroTexto } from '../../types/libro';

/**
 * Turns the book into a sequence of pages for the reader.
 *
 * Pagination is by declared weight rather than by measuring the DOM. That is a
 * deliberate trade: measuring would fit each page perfectly but would need a
 * browser, which rules out prerendering and makes the result depend on the
 * reader's fonts and viewport. Weights are approximate but identical everywhere,
 * which is what a book needs — page 14 should be page 14 for everyone.
 *
 * Some blocks always take a page to themselves: a photograph, an activity, the
 * phase stepper and the timeline are all tall and interactive, and cramming
 * prose alongside them reads badly.
 */

export type PaginaLibro =
  | { tipo: 'portada' }
  | {
      tipo: 'seccion';
      clave: 'presentacion' | 'sinopsis' | 'fuentes' | 'creditos';
      bloques: readonly Bloque[];
      /** True for the first page of the section, which carries the title. */
      inicio: boolean;
    }
  | { tipo: 'parte'; numero: LibroParte }
  | { tipo: 'capitulo'; numero: LibroCapitulo }
  | { tipo: 'contenido'; capitulo: LibroCapitulo; bloques: readonly Bloque[] }
  | { tipo: 'lamina'; clave: keyof typeof LAMINAS }
  | { tipo: 'glosario'; indice: number }
  /** Vocabulary exercises closing the glossary. */
  | { tipo: 'repaso'; bloques: readonly Bloque[]; inicio: boolean }
  | { tipo: 'cierre' }
  | { tipo: 'enhorabuena' }
  | { tipo: 'contracubierta' };

/** Which chapter a page belongs to, for the progress indicator. */
export interface PaginaConCapitulo {
  pagina: PaginaLibro;
  capitulo: LibroCapitulo | null;
}

/** Roughly one page of body copy. Tuned against the printed edition's measure. */
const PRESUPUESTO = 4.6;

/** Blocks that are too tall, or too interactive, to share a page. */
const SOLOS: ReadonlySet<Bloque['tipo']> = new Set([
  'foto',
  'actividad',
  'fases',
  'lineaTiempo',
]);

function peso(bloque: Bloque): number {
  switch (bloque.tipo) {
    case 'parrafo':
      return bloque.texto.length / 210;
    case 'entradilla':
      return bloque.texto.length / 200 + 0.4;
    case 'subtitulo':
      return 0.7;
    case 'caja':
      return bloque.parrafos.reduce((total, p) => total + p.length / 210, 0.9);
    case 'cita':
      return 1.5;
    case 'datos':
      return 1.6;
    case 'lista':
      return bloque.items.reduce((total, i) => total + i.texto.length / 210 + 0.35, 0.2);
    default:
      return PRESUPUESTO;
  }
}

/**
 * True for a page whose artwork runs to the edges of the paper.
 *
 * Such a page has no margin to move within, which matters to the entry
 * animation: a full-bleed photograph that rises into place drags a strip of
 * bare paper across the foot of the page, so it fades instead.
 */
export function esPaginaPlena(pagina: PaginaLibro): boolean {
  switch (pagina.tipo) {
    case 'portada':
    case 'parte':
    case 'lamina':
    case 'contracubierta':
      return true;
    case 'contenido':
      // A photograph always takes a page to itself, and `Pagina` bleeds it.
      return pagina.bloques.length === 1 && pagina.bloques[0].tipo === 'foto';
    default:
      return false;
  }
}

/** Splits a run of blocks into page-sized groups. */
function repartir(bloques: readonly Bloque[]): Bloque[][] {
  const paginas: Bloque[][] = [];
  let actual: Bloque[] = [];
  let acumulado = 0;

  const cerrar = () => {
    if (actual.length > 0) {
      paginas.push(actual);
      actual = [];
      acumulado = 0;
    }
  };

  for (const bloque of bloques) {
    if (SOLOS.has(bloque.tipo)) {
      cerrar();
      paginas.push([bloque]);
      continue;
    }

    const p = peso(bloque);
    if (acumulado + p > PRESUPUESTO && actual.length > 0) cerrar();

    // A subheading at the foot of a page is a widow; start the page with it.
    if (bloque.tipo === 'subtitulo' && acumulado > PRESUPUESTO * 0.72) cerrar();

    actual.push(bloque);
    acumulado += p;
  }

  cerrar();
  return paginas;
}

/** Builds the whole book, in reading order. */
export function construirPaginas(libro: LibroTexto): PaginaConCapitulo[] {
  const salida: PaginaConCapitulo[] = [];
  const push = (pagina: PaginaLibro, capitulo: LibroCapitulo | null = null) =>
    salida.push({ pagina, capitulo });

  push({ tipo: 'portada' });

  repartir(libro.presentacion.bloques).forEach((bloques, i) =>
    push({ tipo: 'seccion', clave: 'presentacion', bloques, inicio: i === 0 }),
  );

  push({ tipo: 'lamina', clave: 'territorio' });

  repartir(libro.sinopsis.bloques).forEach((bloques, i) =>
    push({ tipo: 'seccion', clave: 'sinopsis', bloques, inicio: i === 0 }),
  );

  for (const numeroParte of LIBRO_PARTES) {
    push({ tipo: 'parte', numero: numeroParte });

    for (const numero of capitulosDeParte(numeroParte)) {
      push({ tipo: 'capitulo', numero }, numero);
      for (const bloques of repartir(libro.capitulos[numero].bloques)) {
        push({ tipo: 'contenido', capitulo: numero, bloques }, numero);
      }

      // The plates sit where the printed edition places them: after the chapter
      // whose argument they illustrate.
      if (numero === 2) push({ tipo: 'lamina', clave: 'centro' });
      if (numero === 4) push({ tipo: 'lamina', clave: 'lavado' });
      if (numero === 5) push({ tipo: 'lamina', clave: 'desfibradora' });
    }
  }

  libro.glosario.grupos.forEach((_, indice) => push({ tipo: 'glosario', indice }));

  // The vocabulary review closes the glossary. Each activity is in SOLOS, so
  // `repartir` gives one per page, exactly as it does inside a chapter.
  repartir(GLOSARIO_ACTIVIDADES.map((id) => ({ tipo: 'actividad', id }) as const)).forEach(
    (bloques, i) => push({ tipo: 'repaso', bloques, inicio: i === 0 }),
  );

  repartir(libro.fuentes.bloques).forEach((bloques, i) =>
    push({ tipo: 'seccion', clave: 'fuentes', bloques, inicio: i === 0 }),
  );
  repartir(libro.creditos.bloques).forEach((bloques, i) =>
    push({ tipo: 'seccion', clave: 'creditos', bloques, inicio: i === 0 }),
  );

  push({ tipo: 'cierre' });

  // A leaf has two faces, so an odd page count would leave a half leaf at the
  // end. When the back cover is the page that would land on one, the slack goes
  // to a closing page — printers call this a filler, and the book may as well
  // say something with it. It used to be filled with a second copy of the back
  // cover, which read as a fault rather than as a page.
  if ((salida.length + 1) % 2 !== 0) push({ tipo: 'enhorabuena' });

  push({ tipo: 'contracubierta' });

  return salida;
}

/** First page of a chapter, for deep links and the contents menu. */
export function paginaDeCapitulo(
  paginas: readonly PaginaConCapitulo[],
  numero: LibroCapitulo,
): number {
  const indice = paginas.findIndex(
    (entrada) => entrada.pagina.tipo === 'capitulo' && entrada.pagina.numero === numero,
  );
  return indice >= 0 ? indice : 0;
}

export { LIBRO_CAPITULOS, PARTE_DE_CAPITULO };
