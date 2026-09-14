import { COMPANY, SOCIAL_LINKS } from './company';

/**
 * TEMPORARY — pre-handover scaffolding. Delete this module and its call sites
 * before the site goes public.
 *
 * The client has not yet supplied several details that the contact page, the
 * footer and the legal pages all publish, and a few photographs the home page
 * is designed around. Rather than hide the gaps, every one of them is marked in
 * the page with a visible badge and a tooltip naming what is missing, so the
 * client can walk the site and see exactly what is still owed.
 *
 * Every flag below is DERIVED from the placeholder value itself rather than
 * declared by hand. Fill the real value into `company.ts` and the badge
 * disappears on its own — a hand-kept list would eventually mark a field that
 * had already been answered, which is worse than no badge at all.
 *
 * `MOSTRAR_PENDIENTES` is the single switch. Setting it to false silences every
 * badge without touching a call site, for a screenshot or a client demo.
 */

export const MOSTRAR_PENDIENTES = true;

/** The exact placeholders currently sitting in `company.ts`. */
const MARCADORES = {
  nit: 'NIT pendiente',
  direccion: 'Dirección pendiente',
  telefono: '+57 000 000 0000',
  whatsapp: '570000000000',
} as const;

export const FALTA = {
  /** No razón social yet, so the legal name is standing in as the brand name. */
  razonSocial: COMPANY.legalName === COMPANY.name,
  nit: COMPANY.taxId === MARCADORES.nit,
  telefono: COMPANY.phone === MARCADORES.telefono,
  whatsapp: COMPANY.whatsapp === MARCADORES.whatsapp,
  direccion: COMPANY.address.street === MARCADORES.direccion,
  redes: SOCIAL_LINKS.length === 0,
} as const;

export type CampoPendiente = keyof typeof FALTA;

/** True while anything at all is still outstanding, for the legal-page notice. */
export const HAY_PENDIENTES = Object.values(FALTA).some(Boolean);

/** Which entity details the legal pages publish, so the notice can name them. */
export const PENDIENTES_LEGALES = (
  ['razonSocial', 'nit', 'telefono', 'direccion'] as const
).filter((campo) => FALTA[campo]);
