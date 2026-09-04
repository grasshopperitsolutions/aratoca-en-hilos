/**
 * Shape of "Trenzando Saberes", the Alcaldía's book.
 *
 * The book is a fixed publication authored in Word, not admin-editable content,
 * so it lives in the repo as typed modules rather than in Firestore: versioned,
 * reviewable, and prerendered with no fetch on the site's heaviest page.
 *
 * Structure (which chapter holds which asset) is language-neutral and lives in
 * `content/libro/estructura.ts`; prose and alt text are localised and live in
 * `content/libro/{es,en}.ts`. Both sides key off the same tags and numbers, so
 * a missing translation is a type error rather than a blank page.
 */

/** Chapters, as numbered in the source document. */
export const LIBRO_CAPITULOS = [1, 2, 3, 4, 5, 6, 7] as const;
export type LibroCapitulo = (typeof LIBRO_CAPITULOS)[number];

/** The book's three parts. */
export const LIBRO_PARTES = [1, 2, 3] as const;
export type LibroParte = (typeof LIBRO_PARTES)[number];

/**
 * Asset tags exactly as the client's "Guía y Catálogo Técnico de Recursos
 * Fotográficos y de Video" names them. Kept verbatim so a photographer's
 * delivery can be matched to a slot without a translation table.
 */
export const ASSET_TAGS = [
  'TAG_01_HERO_PANORAMA',
  'TAG_02_GUANE_MUSEUM',
  'TAG_03_PORTRAIT_ELDER',
  'TAG_04_LANDSCAPE_FIQUE',
  'TAG_05_TRADITIONAL_DESFIBRADO',
  'TAG_06_FIBERS_DRYING',
  'TAG_07_SPINNING_WHEEL',
  'TAG_08_LOOM_WEAVING',
  'TAG_09_BAGAZO_INNOVATION',
  'TAG_10_MODERN_PRODUCTS_FLATLAY',
  'TAG_11_TALLER_SESSION',
  'TAG_12_APP_UX_MOCKUP',
  'TAG_13_ALCALDIA_DELIVERY',
] as const;
export type AssetTag = (typeof ASSET_TAGS)[number];

/**
 * Interactive treatment an asset receives inside the reader.
 *
 * `null` means the asset is presented as a plain figure. Only the media-rich
 * tier is in scope — the calculators, the weaving simulator and the WhatsApp
 * catalogue described in the source document are deliberately absent.
 */
export type WidgetKind =
  | 'parallax'
  | 'viewer360'
  | 'audioNote'
  | 'timeline'
  | 'video'
  | 'ambientAudio';

/** Structured blocks that are not plain prose. */
export type BloqueKind =
  | 'datosClave'
  | 'sietePasos'
  | 'sesion3h'
  | 'modulos7'
  | 'modulosWeb'
  | 'diagramaFurcraea'
  | 'diagramaBioeconomia';

/** Technical, language-neutral description of one catalogued asset. */
export interface AssetMeta {
  tag: AssetTag;
  /** Aspect ratio as specified by the client's catalogue, e.g. `'16:9'`. */
  formato: string;
  /** Interactive treatment in the reader, or `null` for a plain figure. */
  widget: WidgetKind | null;
  /**
   * Resolved image URL — assign a Vite `import` from `src/assets/libro/` so the
   * file is fingerprinted and bundled, matching how `content/images.ts` will
   * work once the client's photography lands.
   *
   * `null` until delivered. Every consumer must handle that: nothing has been
   * shot yet, so `null` is the normal case today, not an edge case.
   */
  archivo: string | null;
}

/** One chapter's language-neutral placement data. */
export interface CapituloMeta {
  numero: LibroCapitulo;
  parte: LibroParte;
  /** Assets shown in this chapter, in reading order. */
  assets: readonly AssetTag[];
  /** Non-prose blocks this chapter renders, in reading order. */
  bloques: readonly BloqueKind[];
}

/** One of the seven traditional steps. */
export interface PasoTexto {
  numero: number;
  titulo: string;
  texto: string;
}

/** One phase of the three-hour workshop session. */
export interface FaseTexto {
  titulo: string;
  duracion: string;
  texto: string;
}

/** A named learning module. */
export interface ModuloTexto {
  titulo: string;
  texto: string;
}

/** Localised text for one asset. */
export interface AssetTexto {
  /** Title from the client's catalogue. */
  titulo: string;
  /** Alt text. Required — every figure must be described. */
  alt: string;
  /** Caption shown under the figure. */
  pie: string;
}

/**
 * A pull-out box. The manuscript uses two kinds, marked with an emoji in Word:
 * "sabias" (💡 ¿Sabías que?) carries a piece of context, and "consejo"
 * (🛠️ Consejo de taller) carries practical advice aimed at a working artisan.
 *
 * Both were dropped from version 2 of the manuscript; they are restored here
 * from version 1 at the client's request.
 */
export interface CalloutTexto {
  tipo: 'sabias' | 'consejo';
  titulo: string;
  texto: string;
}

/** Localised text for one chapter. */
export interface CapituloTexto {
  titulo: string;
  parrafos: readonly string[];
  callouts?: readonly CalloutTexto[];
}

/** Everything the book says, in one language. */
export interface LibroTexto {
  titulo: string;
  subtitulo: string;
  editor: string;
  version: string;
  /** Back-cover summary of the whole work. */
  sinopsis: string;
  prologo: CapituloTexto;
  /** Part titles are the manuscript's own, split at their colon. */
  partes: Record<LibroParte, { titulo: string; subtitulo: string }>;
  capitulos: Record<LibroCapitulo, CapituloTexto>;
  datosClave: { titulo: string; items: readonly string[] };
  pasos: { titulo: string; intro: string; items: readonly PasoTexto[] };
  sesion: { titulo: string; intro: string; items: readonly FaseTexto[] };
  /** The workshop's seven-module curriculum. */
  modulos: { titulo: string; intro: string; items: readonly ModuloTexto[] };
  modulosWeb: { titulo: string; intro: string; items: readonly ModuloTexto[] };
  assets: Record<AssetTag, AssetTexto>;
}
