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

/** An account on the admin allowlist. The document id is the Firebase Auth uid. */
export interface Admin {
  /** Firebase Auth uid. */
  id: string;
  email: string;
  creadoEn: string | null;
  /** Token of the invitation this account was created from, when applicable. */
  invitacion?: string;
}

export type EstadoInvitacion = 'pendiente' | 'usada';

/**
 * A pending admin invitation. The document id is an unguessable token, which
 * doubles as the capability in the emailed link.
 */
export interface Invitacion {
  /** The token — also the document id. */
  id: string;
  email: string;
  estado: EstadoInvitacion;
  creadaEn: string | null;
  expiraEn: string | null;
  usadaEn: string | null;
  /** Email of the admin who sent the invitation. */
  invitadaPor: string;
}

export const EMPTY_LOCALISED: Localised = { es: '', en: '' };
