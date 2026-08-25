import type { Language } from '../i18n/routes';

/** A string that exists in both site languages. */
export type Localised = Record<Language, string>;

/** An artisan profile, managed from /admin/artesanos. */
export interface Artesano {
  id: string;
  nombre: string;
  /** Craft or trade, e.g. "Tejedora" / "Weaver". */
  oficio: Localised;
  bio: Localised;
  /** Public download URL of the portrait, or empty when none has been set. */
  fotoUrl: string;
  /** Storage path, kept so the object can be deleted alongside the document. */
  fotoPath: string;
  /** Sort position, ascending. */
  orden: number;
  publicado: boolean;
  creadoEn: string | null;
  actualizadoEn: string | null;
}

/** A contact form submission. */
export interface Mensaje {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  /** Language the visitor was browsing in, so replies match. */
  idioma: Language;
  leido: boolean;
  creadoEn: string | null;
}

/** A file in the media library, managed from /admin/archivos. */
export interface Archivo {
  id: string;
  nombre: string;
  url: string;
  path: string;
  tipo: string;
  tamano: number;
  subidoEn: string | null;
}

export const EMPTY_LOCALISED: Localised = { es: '', en: '' };
