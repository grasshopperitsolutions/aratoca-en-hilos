/**
 * Where everything sits in the book — language-neutral.
 *
 * Mirrors "Trenzando Saberes" version 2.0 (Aug 2026), which is the authoritative
 * source. Asset tags and formats are copied verbatim from the client's own
 * "Guía y Catálogo Técnico de Recursos Fotográficos y de Video" so a photo
 * delivery can be dropped into `archivo` without any renaming.
 */

import {
  LIBRO_CAPITULOS,
  type AssetMeta,
  type AssetTag,
  type CapituloMeta,
  type LibroCapitulo,
  type LibroParte,
} from '../../types/libro';

export { LIBRO_CAPITULOS, LIBRO_PARTES } from '../../types/libro';
export type { LibroCapitulo, LibroParte } from '../../types/libro';

/**
 * The catalogued assets.
 *
 * `archivo` is `null` for every entry: the manuscript shipped with placeholders
 * only, and nothing has been delivered yet. Consumers must render a labelled
 * placeholder rather than a broken image — see `AssetFigure`.
 *
 * `widget` covers the media-rich tier only. The source document also describes a
 * bagasse calculator, a weaving simulator, a WhatsApp catalogue and student
 * badges; those are out of scope and are recorded as `null` rather than removed,
 * so the intent is not lost.
 */
export const ASSETS: Record<AssetTag, AssetMeta> = {
  TAG_01_HERO_PANORAMA: { tag: 'TAG_01_HERO_PANORAMA', formato: '16:9', widget: 'parallax', archivo: null },
  TAG_02_GUANE_MUSEUM: { tag: 'TAG_02_GUANE_MUSEUM', formato: '4:3', widget: 'viewer360', archivo: null },
  TAG_03_PORTRAIT_ELDER: { tag: 'TAG_03_PORTRAIT_ELDER', formato: '3:4', widget: 'audioNote', archivo: null },
  TAG_04_LANDSCAPE_FIQUE: { tag: 'TAG_04_LANDSCAPE_FIQUE', formato: '1:1', widget: 'timeline', archivo: null },
  TAG_05_TRADITIONAL_DESFIBRADO: { tag: 'TAG_05_TRADITIONAL_DESFIBRADO', formato: '16:9', widget: null, archivo: null },
  TAG_06_FIBERS_DRYING: { tag: 'TAG_06_FIBERS_DRYING', formato: '16:9', widget: 'video', archivo: null },
  TAG_07_SPINNING_WHEEL: { tag: 'TAG_07_SPINNING_WHEEL', formato: '4:3', widget: 'ambientAudio', archivo: null },
  TAG_08_LOOM_WEAVING: { tag: 'TAG_08_LOOM_WEAVING', formato: '1:1', widget: null, archivo: null },
  TAG_09_BAGAZO_INNOVATION: { tag: 'TAG_09_BAGAZO_INNOVATION', formato: '4:3', widget: null, archivo: null },
  TAG_10_MODERN_PRODUCTS_FLATLAY: { tag: 'TAG_10_MODERN_PRODUCTS_FLATLAY', formato: '1:1', widget: null, archivo: null },
  TAG_11_TALLER_SESSION: { tag: 'TAG_11_TALLER_SESSION', formato: '16:9', widget: null, archivo: null },
  TAG_12_APP_UX_MOCKUP: { tag: 'TAG_12_APP_UX_MOCKUP', formato: '16:9', widget: null, archivo: null },
  TAG_13_ALCALDIA_DELIVERY: { tag: 'TAG_13_ALCALDIA_DELIVERY', formato: '4:3', widget: null, archivo: null },
};

/** Which part each chapter belongs to, plus its assets and structured blocks. */
export const CAPITULOS: Record<LibroCapitulo, CapituloMeta> = {
  1: {
    numero: 1,
    parte: 1,
    // TAG_01 opens Part I in the manuscript and doubles as this chapter's hero.
    assets: ['TAG_01_HERO_PANORAMA', 'TAG_02_GUANE_MUSEUM'],
    bloques: [],
  },
  2: { numero: 2, parte: 1, assets: ['TAG_03_PORTRAIT_ELDER'], bloques: ['datosClave'] },
  3: {
    numero: 3,
    parte: 2,
    assets: ['TAG_04_LANDSCAPE_FIQUE'],
    bloques: ['diagramaFurcraea'],
  },
  4: {
    numero: 4,
    parte: 2,
    assets: ['TAG_05_TRADITIONAL_DESFIBRADO'],
    bloques: ['diagramaBioeconomia'],
  },
  5: {
    numero: 5,
    parte: 2,
    assets: ['TAG_06_FIBERS_DRYING', 'TAG_07_SPINNING_WHEEL', 'TAG_08_LOOM_WEAVING'],
    bloques: ['sietePasos'],
  },
  6: {
    numero: 6,
    parte: 3,
    assets: ['TAG_09_BAGAZO_INNOVATION', 'TAG_10_MODERN_PRODUCTS_FLATLAY'],
    bloques: [],
  },
  7: {
    numero: 7,
    parte: 3,
    assets: ['TAG_11_TALLER_SESSION', 'TAG_12_APP_UX_MOCKUP'],
    bloques: ['modulos7', 'sesion3h', 'modulosWeb'],
  },
};

/**
 * Photograph backing each of the seven steps.
 *
 * Steps 3 (Lavado) and 5 (Escarmenado) are `null`: the client's catalogue has no
 * asset for either, so the step carousel is incomplete until those two are shot.
 * Recorded here rather than in a document so the gap is visible in code and the
 * carousel can render an explicit "missing" slot instead of silently skipping.
 */
export const PASO_ASSETS: Record<number, AssetTag | null> = {
  1: 'TAG_04_LANDSCAPE_FIQUE',
  2: 'TAG_05_TRADITIONAL_DESFIBRADO',
  3: null,
  4: 'TAG_06_FIBERS_DRYING',
  5: null,
  6: 'TAG_07_SPINNING_WHEEL',
  7: 'TAG_08_LOOM_WEAVING',
};

/** Chapters of a part, in reading order. */
export function capitulosDeParte(parte: LibroParte): LibroCapitulo[] {
  return LIBRO_CAPITULOS.filter((numero) => CAPITULOS[numero].parte === parte);
}

/** Aspect ratio as a CSS `aspect-ratio` value, e.g. `'16 / 9'`. */
export function aspectRatio(tag: AssetTag): string {
  return ASSETS[tag].formato.replace(':', ' / ');
}
