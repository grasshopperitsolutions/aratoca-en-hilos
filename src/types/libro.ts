/**
 * Shape of "Trenzando Saberes", the Alcaldía's book.
 *
 * Modelled directly on the printed first edition (`Trenzando_Saberes_EDITABLE/`),
 * whose editorial furniture this mirrors term for term — entradilla, capitular,
 * caja, cita, dato, paso, lámina — so the two editions stay recognisably the
 * same work and a change to one can be traced to the other.
 *
 * The split follows the rest of the project: anything language-neutral
 * (placement, photographs, which answer is correct) lives in
 * `content/libro/estructura.ts`; anything a reader reads lives in
 * `content/libro/{es,en}.ts`. Correctness deliberately sits on the neutral side
 * so the two languages cannot disagree about the answer to a question.
 */

/** Chapters, as numbered in the printed edition. */
export const LIBRO_CAPITULOS = [1, 2, 3, 4, 5, 6] as const;
export type LibroCapitulo = (typeof LIBRO_CAPITULOS)[number];

/** The book's three parts. */
export const LIBRO_PARTES = [1, 2, 3] as const;
export type LibroParte = (typeof LIBRO_PARTES)[number];

/**
 * Photographs, keyed by the stem of the file in the printed edition's asset
 * folder. The app keeps its own copies under `src/assets/libro/`, deliberately
 * duplicated so neither folder depends on the other; keeping the stems
 * identical is what makes each copy traceable to its original.
 */
export const FOTOS = [
  'planta_fique_maguey',
  'vista_panoramica_aratoca',
  'cultivo_fique',
  'planta_y_montana',
  'toma_iglesia_aratoca',
  'penga_fique_cortada',
  'maguey',
  'lavado_artesanal',
  'uso_artesanal_fique',
  'hombre_manipulando_fique',
  'hombre_trabajando_fique',
  'tejedor_trabajando_fique',
] as const;
export type FotoId = (typeof FOTOS)[number];

/* ------------------------------------------------------------------ */
/* Activities                                                          */
/* ------------------------------------------------------------------ */

/**
 * The five interaction primitives. One small set, reused throughout, so a
 * reader learns the vocabulary once and then recognises it everywhere.
 */
export type TipoActividad =
  | 'verdaderoFalso'
  | 'siNo'
  | 'opcionMultiple'
  | 'deslizador'
  | 'clasificar';

/** Illustrations a slider can drive. Each is an inline SVG that redraws live. */
export type IlustracionId = 'cogollo' | 'rendimiento' | 'varillado' | 'remojo';

/**
 * Language-neutral definition of one activity: which primitive, and what counts
 * as correct. The wording lives in the locale files, keyed by the same id.
 */
export type ActividadMeta =
  | {
      tipo: 'verdaderoFalso' | 'siNo';
      id: string;
      /** The correct answer. `siNo` reads true as "sí". */
      respuesta: boolean;
    }
  | {
      tipo: 'opcionMultiple';
      id: string;
      /** Indices into the localised `opciones` array that are correct. */
      correctas: readonly number[];
      /** Guards against a locale file drifting out of step with this list. */
      totalOpciones: number;
    }
  | {
      tipo: 'deslizador';
      id: string;
      min: number;
      max: number;
      inicial: number;
      /** Inclusive band that counts as right; the illustration settles inside it. */
      aciertoMin: number;
      aciertoMax: number;
      ilustracion: IlustracionId;
    }
  | {
      tipo: 'clasificar';
      id: string;
      /** Column each item belongs in, by index into the localised `items`. */
      columnas: readonly (0 | 1)[];
    };

/** Localised wording for one activity. */
export interface ActividadTexto {
  pregunta: string;
  /** Shown once answered, whatever the outcome — the point is to teach. */
  explicacion: string;
  /** `opcionMultiple` only, in the order `ActividadMeta.correctas` indexes. */
  opciones?: readonly string[];
  /** `clasificar` only: the two column headings, then the items to sort. */
  grupos?: readonly [string, string];
  items?: readonly string[];
  /** `deslizador` only: unit suffix, and the caption at each stage. */
  unidad?: string;
  /** Caption shown while the value is below, inside, and above the right band. */
  tramos?: readonly [string, string, string];
}

/* ------------------------------------------------------------------ */
/* Prose                                                               */
/* ------------------------------------------------------------------ */

/**
 * One block of a chapter. A chapter is a flat sequence of these, which is how
 * the printed edition is laid out and what lets the same content drive both the
 * scrolling chapter page and the paginated reader.
 */
export type Bloque =
  /** Standfirst under the chapter title. */
  | { tipo: 'entradilla'; texto: string }
  /** Body paragraph. The first of a chapter carries the drop cap. */
  | { tipo: 'parrafo'; texto: string; capitular?: boolean }
  /** Subheading within a chapter. */
  | { tipo: 'subtitulo'; texto: string }
  /** Tinted pull-out box, e.g. "Punto crítico del proceso". */
  | { tipo: 'caja'; rotulo: string; parrafos: readonly string[] }
  /** Display quotation with its attribution line. */
  | { tipo: 'cita'; texto: string; fuente: string }
  /** Row of figures, e.g. 18.000 / 95% / 5. */
  | { tipo: 'datos'; items: readonly { cifra: string; leyenda: string }[] }
  /** Definition-style list, e.g. the products, the four fronts. */
  | { tipo: 'lista'; items: readonly { titulo: string; texto: string }[] }
  /** The six phases of transformation, stepped through rather than scored. */
  | { tipo: 'fases'; items: readonly { titulo: string; texto: string }[] }
  /**
   * The century of fique in Aratoca, on a draggable year. Exploratory: a
   * timeline has no right answer, so it is an illustration you operate rather
   * than a question, and it stays out of the score.
   */
  | { tipo: 'lineaTiempo'; hitos: readonly { anio: number; titulo: string; texto: string }[] }
  /** An inline photograph with its caption. */
  | { tipo: 'foto'; foto: FotoId; titulo: string; pie: string }
  /** An activity, placed by id; its definition lives in `estructura.ts`. */
  | { tipo: 'actividad'; id: string };

/** A full-bleed photographic plate between chapters. */
export interface LaminaTexto {
  foto: FotoId;
  titulo: string;
  pie: string;
}

export interface CapituloTexto {
  /** "Capítulo uno" — spelled out, as the printed edition does. */
  ordinal: string;
  titulo: string;
  bloques: readonly Bloque[];
}

export interface ParteTexto {
  titulo: string;
  subtitulo: string;
  foto: FotoId;
}

export interface TerminoGlosario {
  termino: string;
  definicion: string;
}

export interface GrupoGlosario {
  titulo: string;
  terminos: readonly TerminoGlosario[];
}

/** Everything the book says, in one language. */
export interface LibroTexto {
  titulo: string;
  subtitulo: string;
  editor: string;
  lugar: string;
  edicion: string;
  presentacion: { ordinal: string; titulo: string; bloques: readonly Bloque[]; firma: string };
  sinopsis: { ordinal: string; titulo: string; bloques: readonly Bloque[] };
  partes: Record<LibroParte, ParteTexto>;
  capitulos: Record<LibroCapitulo, CapituloTexto>;
  /** Plates keyed by the photograph they show. */
  laminas: Record<string, LaminaTexto>;
  glosario: { titulo: string; intro: string; grupos: readonly GrupoGlosario[] };
  fuentes: { titulo: string; bloques: readonly Bloque[] };
  creditos: { titulo: string; bloques: readonly Bloque[] };
  colofon: { parrafos: readonly string[] };
  contracubierta: { parrafos: readonly string[] };
  actividades: Record<string, ActividadTexto>;
  /** Reader chrome that is part of the book rather than the site. */
  cierre: {
    titulo: string;
    intro: string;
    resumen: string;
    sinRespuestas: string;
    reiniciar: string;
  };
  /** The parity page. Only printed when the book would otherwise end odd. */
  enhorabuena: { titulo: string; texto: string; boton: string };
}
