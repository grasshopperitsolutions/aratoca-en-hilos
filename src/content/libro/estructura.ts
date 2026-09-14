/**
 * Where everything sits, and what counts as a correct answer — all of it
 * language-neutral.
 *
 * Mirrors the printed first edition. Photographs are imported rather than
 * referenced by string so Vite fingerprints and bundles them, and so a missing
 * file is a build error rather than a broken image in production.
 */

import escudoAratoca from '../../assets/libro/escudo-aratoca.png';
import logoMinisterio from '../../assets/libro/logo-ministerio-culturas.png';
import cultivoFique from '../../assets/libro/cultivo_fique.webp';
import hombreManipulando from '../../assets/libro/hombre_manipulando_fique.webp';
import hombreTrabajando from '../../assets/libro/hombre_trabajando_fique.webp';
import lavadoArtesanal from '../../assets/libro/lavado_artesanal.webp';
import maguey from '../../assets/libro/maguey.webp';
import pencaCortada from '../../assets/libro/penga_fique_cortada.webp';
import plantaFiqueMaguey from '../../assets/libro/planta_fique_maguey.webp';
import plantaYMontana from '../../assets/libro/planta_y_montana.webp';
import tejedorTrabajando from '../../assets/libro/tejedor_trabajando_fique.webp';
import tomaIglesia from '../../assets/libro/toma_iglesia_aratoca.webp';
import usoArtesanal from '../../assets/libro/uso_artesanal_fique.webp';
import vistaPanoramica from '../../assets/libro/vista_panoramica_aratoca.webp';

import {
  LIBRO_CAPITULOS,
  type ActividadMeta,
  type FotoId,
  type LibroCapitulo,
  type LibroParte,
} from '../../types/libro';

export { LIBRO_CAPITULOS, LIBRO_PARTES } from '../../types/libro';
export type { LibroCapitulo, LibroParte } from '../../types/libro';

export const ESCUDOS = { aratoca: escudoAratoca, ministerio: logoMinisterio } as const;

/** Resolved URL per photograph. */
export const FOTO_SRC: Record<FotoId, string> = {
  planta_fique_maguey: plantaFiqueMaguey,
  vista_panoramica_aratoca: vistaPanoramica,
  cultivo_fique: cultivoFique,
  planta_y_montana: plantaYMontana,
  toma_iglesia_aratoca: tomaIglesia,
  penga_fique_cortada: pencaCortada,
  maguey,
  lavado_artesanal: lavadoArtesanal,
  uso_artesanal_fique: usoArtesanal,
  hombre_manipulando_fique: hombreManipulando,
  hombre_trabajando_fique: hombreTrabajando,
  tejedor_trabajando_fique: tejedorTrabajando,
};

/** Intrinsic size, so every figure can reserve its space and never shift layout. */
export const FOTO_TAMANO: Record<FotoId, { ancho: number; alto: number }> = {
  planta_fique_maguey: { ancho: 900, alto: 1600 },
  vista_panoramica_aratoca: { ancho: 1600, alto: 900 },
  cultivo_fique: { ancho: 1600, alto: 900 },
  planta_y_montana: { ancho: 1600, alto: 1200 },
  toma_iglesia_aratoca: { ancho: 1600, alto: 900 },
  penga_fique_cortada: { ancho: 1600, alto: 900 },
  maguey: { ancho: 900, alto: 1600 },
  lavado_artesanal: { ancho: 1600, alto: 900 },
  uso_artesanal_fique: { ancho: 1600, alto: 900 },
  hombre_manipulando_fique: { ancho: 1600, alto: 900 },
  hombre_trabajando_fique: { ancho: 1600, alto: 900 },
  tejedor_trabajando_fique: { ancho: 1600, alto: 900 },
};

/** Which part each chapter belongs to. */
export const PARTE_DE_CAPITULO: Record<LibroCapitulo, LibroParte> = {
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 2,
  6: 3,
};

/**
 * Full-bleed plates, in the order the printed edition places them: after the
 * front matter, and between chapters as a breath between arguments.
 */
export const LAMINAS = {
  territorio: 'vista_panoramica_aratoca',
  centro: 'toma_iglesia_aratoca',
  lavado: 'lavado_artesanal',
  desfibradora: 'hombre_trabajando_fique',
} as const satisfies Record<string, FotoId>;

/** Chapters of a part, in reading order. */
export function capitulosDeParte(parte: LibroParte): LibroCapitulo[] {
  return LIBRO_CAPITULOS.filter((numero) => PARTE_DE_CAPITULO[numero] === parte);
}

/* ------------------------------------------------------------------ */
/* Activities                                                          */
/* ------------------------------------------------------------------ */

/**
 * The seventeen scored activities, keyed by id. Correctness lives here rather than in
 * the locale files so Spanish and English cannot end up disagreeing about the
 * answer — the one kind of drift that would actually mislead a reader.
 *
 * Every question is answerable from the chapter it sits in.
 */
export const ACTIVIDADES: Record<string, ActividadMeta> = {
  /* --- Capítulo 1 · El legado del pueblo Guane --- */
  'c1-algodon-o-fique': {
    tipo: 'clasificar',
    id: 'c1-algodon-o-fique',
    // mantas finas · mochilas · prendas de abrigo · tocados · bolsas
    columnas: [0, 1, 0, 1, 1],
  },
  'c1-gremio': { tipo: 'verdaderoFalso', id: 'c1-gremio', respuesta: false },
  'c1-vestigios': { tipo: 'siNo', id: 'c1-vestigios', respuesta: false },

  /* --- Capítulo 2 · Panorama socioeconómico --- */
  'c2-porcentaje-familias': {
    tipo: 'deslizador',
    id: 'c2-porcentaje-familias',
    min: 0,
    max: 100,
    inicial: 50,
    aciertoMin: 90,
    aciertoMax: 100,
    ilustracion: 'rendimiento',
  },
  'c2-limitaciones': {
    tipo: 'opcionMultiple',
    id: 'c2-limitaciones',
    correctas: [0, 1, 2],
    totalOpciones: 5,
  },

  /* --- Capítulo 3 · La Furcraea --- */
  'c3-cogollo': {
    tipo: 'deslizador',
    id: 'c3-cogollo',
    min: 0,
    max: 25,
    inicial: 4,
    aciertoMin: 15,
    aciertoMax: 20,
    ilustracion: 'cogollo',
  },
  'c3-floracion': { tipo: 'verdaderoFalso', id: 'c3-floracion', respuesta: false },
  'c3-riego': { tipo: 'siNo', id: 'c3-riego', respuesta: false },

  /* --- Capítulo 4 · Extracción y bagazo --- */
  'c4-rendimiento': {
    tipo: 'deslizador',
    id: 'c4-rendimiento',
    min: 0,
    max: 50,
    inicial: 25,
    aciertoMin: 3,
    aciertoMax: 6,
    ilustracion: 'rendimiento',
  },
  'c4-bagazo-usos': {
    tipo: 'opcionMultiple',
    id: 'c4-bagazo-usos',
    correctas: [0, 1, 2, 3],
    totalOpciones: 5,
  },
  'c4-remojo': {
    tipo: 'deslizador',
    id: 'c4-remojo',
    min: 0,
    max: 30,
    inicial: 2,
    aciertoMin: 12,
    aciertoMax: 15,
    ilustracion: 'remojo',
  },

  /* --- Capítulo 5 · El oficio artesanal --- */
  'c5-varillado': {
    tipo: 'deslizador',
    id: 'c5-varillado',
    min: 0,
    max: 100,
    inicial: 10,
    aciertoMin: 42,
    aciertoMax: 62,
    ilustracion: 'varillado',
  },
  'c5-asociatividad': {
    tipo: 'opcionMultiple',
    id: 'c5-asociatividad',
    correctas: [0, 1, 2, 3],
    totalOpciones: 5,
  },
  'c5-ganchillo': { tipo: 'siNo', id: 'c5-ganchillo', respuesta: false },

  /* --- Capítulo 6 · Reflexiones finales --- */
  'c6-frentes': {
    tipo: 'opcionMultiple',
    id: 'c6-frentes',
    correctas: [0, 1, 2, 3],
    totalOpciones: 4,
  },
  'c6-desafio': { tipo: 'verdaderoFalso', id: 'c6-desafio', respuesta: false },
  'c6-quien-aporta': {
    tipo: 'clasificar',
    id: 'c6-quien-aporta',
    // criterio técnico · memoria · lenguaje visual · herramientas digitales · canales de venta
    columnas: [0, 0, 1, 1, 1],
  },
};

/** Activity ids in reading order, for progress and the closing summary. */
export const ACTIVIDADES_EN_ORDEN: readonly string[] = [
  'c1-algodon-o-fique',
  'c1-gremio',
  'c1-vestigios',
  'c2-porcentaje-familias',
  'c2-limitaciones',
  'c3-cogollo',
  'c3-floracion',
  'c3-riego',
  'c4-rendimiento',
  'c4-bagazo-usos',
  'c4-remojo',
  'c5-varillado',
  'c5-asociatividad',
  'c5-ganchillo',
  'c6-frentes',
  'c6-desafio',
  'c6-quien-aporta',
];
