import type { Language } from '../i18n/routes';

/** A string that exists in both site languages. */
export type Localised = Record<Language, string>;

/**
 * A link on an artisan profile.
 *
 * One field for every kind of link: the network is detected from the hostname
 * (see content/social.ts), so a social profile renders as an icon and anything
 * else renders as a labelled link. The admin only ever types a URL.
 */
export interface EnlaceArtesano {
  url: string;
  /** Shown for links that are not a recognised social network. */
  etiqueta: string;
}

export interface TelefonoArtesano {
  numero: string;
  /** Adds a wa.me link alongside the tel: one. */
  whatsapp: boolean;
}

/** An artisan profile, managed from /admin/artesanos. */
export interface Artesano {
  id: string;
  /** Required. */
  nombre: string;
  /** Craft or trade, e.g. "Tejedora" / "Weaver". Optional. */
  oficio: Localised;
  /** The description. Required in Spanish; English falls back to it. */
  bio: Localised;
  /** Required. Public download URL of the portrait. */
  fotoUrl: string;
  /** Storage path, kept so the object can be deleted alongside the document. */
  fotoPath: string;
  /** Optional social profiles and websites. */
  enlaces: EnlaceArtesano[];
  /** Optional phone numbers, each flagged for WhatsApp or not. */
  telefonos: TelefonoArtesano[];
  /** Optional email addresses. */
  correos: string[];
  /** Optional Google Maps link. Rendered as a link, not an embedded map. */
  mapaUrl: string;
  /** Sort position, ascending. */
  orden: number;
  publicado: boolean;
  creadoEn: string | null;
  actualizadoEn: string | null;
}

/** Falls back to Spanish, the base language, when a translation is missing. */
export function localised(value: Localised, language: Language): string {
  return value[language]?.trim() || value.es;
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
