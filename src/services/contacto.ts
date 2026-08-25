import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import { COMPANY } from '../content/company';
import { db, requireDb } from '../firebase';
import { THROTTLED_ERROR_NAME, type ContactoInput } from './contactLimits';
import type { Mensaje } from '../types/content';

export { CONTACT_LIMITS, type ContactoInput } from './contactLimits';

export const CONTACTOS_COLLECTION = 'contactos';

/**
 * Template name resolved by the "Trigger Email from Firestore" extension.
 *
 * The submitted document carries `template.name` rather than raw `message.html`
 * on purpose: the HTML body then comes from the `templates` collection, which
 * the public cannot write. A visitor can only choose the *data*, never the
 * markup that gets emailed.
 */
export const CONTACT_TEMPLATE = 'contacto';

/** Minimum gap between two submissions from the same browser. */
const THROTTLE_MS = 30_000;
const THROTTLE_KEY = 'aratoca:lastContactSubmit';

export class ThrottledError extends Error {
  constructor() {
    super('Contact form submitted too frequently');
    this.name = THROTTLED_ERROR_NAME;
  }
}

function isThrottled(): boolean {
  if (typeof window === 'undefined') return false;
  const last = Number(window.localStorage.getItem(THROTTLE_KEY) ?? 0);
  return Number.isFinite(last) && Date.now() - last < THROTTLE_MS;
}

function markSubmitted(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(THROTTLE_KEY, String(Date.now()));
}

/**
 * Records the enquiry and hands it to the email extension in one write.
 *
 * `to` is pinned to the company address and re-checked in the security rules,
 * so this publicly writable collection cannot be turned into an open relay.
 */
export async function enviarMensaje(input: ContactoInput): Promise<void> {
  if (isThrottled()) throw new ThrottledError();

  const payload = {
    nombre: input.nombre.trim(),
    email: input.email.trim(),
    telefono: input.telefono.trim(),
    mensaje: input.mensaje.trim(),
    idioma: input.idioma,
  };

  await addDoc(collection(requireDb(), CONTACTOS_COLLECTION), {
    ...payload,
    leido: false,
    creadoEn: serverTimestamp(),
    to: COMPANY.email,
    template: { name: CONTACT_TEMPLATE, data: payload },
  });

  markSubmitted();
}

function mapMensaje(snapshot: QueryDocumentSnapshot<DocumentData>): Mensaje {
  const data = snapshot.data();
  const creadoEn = data.creadoEn;
  return {
    id: snapshot.id,
    nombre: typeof data.nombre === 'string' ? data.nombre : '',
    email: typeof data.email === 'string' ? data.email : '',
    telefono: typeof data.telefono === 'string' ? data.telefono : '',
    mensaje: typeof data.mensaje === 'string' ? data.mensaje : '',
    idioma: data.idioma === 'en' ? 'en' : 'es',
    leido: data.leido === true,
    creadoEn: creadoEn instanceof Timestamp ? creadoEn.toDate().toISOString() : null,
  };
}

/** Live inbox feed, newest first — admin only. */
export function subscribeMensajes(
  onData: (mensajes: Mensaje[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!db) return () => {};
  const inbox = query(collection(db, CONTACTOS_COLLECTION), orderBy('creadoEn', 'desc'));
  return onSnapshot(
    inbox,
    (snapshot) => onData(snapshot.docs.map(mapMensaje)),
    (error) => onError?.(error),
  );
}

export async function marcarLeido(id: string, leido: boolean): Promise<void> {
  await updateDoc(doc(requireDb(), CONTACTOS_COLLECTION, id), { leido });
}

export async function eliminarMensaje(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), CONTACTOS_COLLECTION, id));
}
