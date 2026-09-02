import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import { requireDb } from '../firebase';
import { requireAuth } from '../firebaseAdmin';
import { absoluteUrlWithQuery } from '../seo/origin';
import { ascendingBy, descendingBy } from './ordering';
import type { Admin, Invitacion } from '../types/content';

export const ADMINS_COLLECTION = 'admins';
export const INVITACIONES_COLLECTION = 'invitaciones';

/** Template name resolved by the Trigger Email extension watching `invitaciones`. */
export const INVITE_TEMPLATE = 'invitacion';

/** How long an invitation stays usable. */
export const INVITE_TTL_DAYS = 7;

/** Firebase Auth's own minimum is 6; ours is stricter for an admin account. */
export const MIN_PASSWORD_LENGTH = 10;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class InvalidEmailError extends Error {
  constructor() {
    super('Invalid email address');
    this.name = 'InvalidEmailError';
  }
}

export class WeakPasswordError extends Error {
  constructor() {
    super('Password too short');
    this.name = 'WeakPasswordError';
  }
}

export type InvitationProblem = 'missing' | 'used' | 'expired';

export class InvitationUnusableError extends Error {
  // Written out rather than a constructor parameter property, which the
  // project's `erasableSyntaxOnly` setting forbids.
  readonly reason: InvitationProblem;

  constructor(reason: InvitationProblem) {
    super(`Invitation ${reason}`);
    this.name = 'InvitationUnusableError';
    this.reason = reason;
  }
}

/**
 * Emails are stored and compared lowercased throughout.
 *
 * The security rules compare the invitation's email against
 * `request.auth.token.email.lower()`, so anything written here that is not
 * already lowercase would be rejected at accept time rather than at invite
 * time — a confusing failure a week later.
 */
export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** URL-safe, unguessable invitation token. */
function createToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function toIso(value: unknown): string | null {
  return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

function mapAdmin(snapshot: QueryDocumentSnapshot<DocumentData>): Admin {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    email: typeof data.email === 'string' ? data.email : '',
    creadoEn: toIso(data.creadoEn),
    invitacion: typeof data.invitacion === 'string' ? data.invitacion : undefined,
  };
}

function mapInvitacion(id: string, data: DocumentData): Invitacion {
  return {
    id,
    email: typeof data.email === 'string' ? data.email : '',
    estado: data.estado === 'usada' ? 'usada' : 'pendiente',
    creadaEn: toIso(data.creadaEn),
    expiraEn: toIso(data.expiraEn),
    usadaEn: toIso(data.usadaEn),
    invitadaPor: typeof data.invitadaPor === 'string' ? data.invitadaPor : '',
  };
}

/**
 * Live list of accounts on the allowlist, oldest first.
 *
 * The bootstrap admin is created by hand in the console, where it is easy to
 * omit `creadoEn` — with `orderBy` that entry would silently vanish from the
 * list of admins. See ./ordering.
 */
export function subscribeAdmins(
  onData: (admins: Admin[]) => void,
  onError?: (error: Error) => void,
): () => void {
  return onSnapshot(
    collection(requireDb(), ADMINS_COLLECTION),
    (snapshot) =>
      onData(snapshot.docs.map(mapAdmin).sort(ascendingBy((admin) => admin.creadoEn))),
    (error) => onError?.(error),
  );
}

/** Live list of invitations, newest first. */
export function subscribeInvitaciones(
  onData: (invitaciones: Invitacion[]) => void,
  onError?: (error: Error) => void,
): () => void {
  return onSnapshot(
    collection(requireDb(), INVITACIONES_COLLECTION),
    (snapshot) =>
      onData(
        snapshot.docs
          .map((entry) => mapInvitacion(entry.id, entry.data()))
          .sort(descendingBy((invitacion) => invitacion.creadaEn)),
      ),
    (error) => onError?.(error),
  );
}

/**
 * Creates an invitation. Writing the document is what sends the email: the
 * Trigger Email extension watches this collection.
 *
 * `to` is set to the invited address and the rules require the two to match, so
 * an admin cannot use this collection to mail arbitrary content to arbitrary
 * recipients — only the fixed `invitacion` template, only to the invitee.
 */
export async function invitarAdmin(email: string, invitadaPor: string): Promise<Invitacion> {
  const normalised = normaliseEmail(email);
  if (!EMAIL_PATTERN.test(normalised)) throw new InvalidEmailError();

  const token = createToken();
  const expiraEn = Timestamp.fromDate(
    new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000),
  );
  const enlace = absoluteUrlWithQuery('/admin/registro', { token });

  await setDoc(doc(requireDb(), INVITACIONES_COLLECTION, token), {
    email: normalised,
    estado: 'pendiente',
    creadaEn: serverTimestamp(),
    expiraEn,
    invitadaPor,
    to: normalised,
    template: {
      name: INVITE_TEMPLATE,
      data: { email: normalised, enlace, invitadaPor, dias: String(INVITE_TTL_DAYS) },
    },
  });

  return {
    id: token,
    email: normalised,
    estado: 'pendiente',
    creadaEn: new Date().toISOString(),
    expiraEn: expiraEn.toDate().toISOString(),
    usadaEn: null,
    invitadaPor,
  };
}

/** Cancels a pending invitation, or clears out a spent one. */
export async function revocarInvitacion(token: string): Promise<void> {
  await deleteDoc(doc(requireDb(), INVITACIONES_COLLECTION, token));
}

/**
 * Removes an account from the allowlist, which revokes panel access immediately.
 *
 * The Firebase Auth account itself survives — deleting a user requires the
 * Admin SDK, which this frontend-only project does not have. That account can
 * still sign in, but lands on the "no access" screen and can touch nothing,
 * because every rule checks the allowlist rather than the session. Delete the
 * leftover account by hand in the Firebase console if you want it gone.
 *
 * The rules also forbid removing yourself, which guarantees at least one admin
 * always remains.
 */
export async function eliminarAdmin(uid: string): Promise<void> {
  await deleteDoc(doc(requireDb(), ADMINS_COLLECTION, uid));
}

/** Reads one invitation by its token. Readable without a session, by design. */
export async function leerInvitacion(token: string): Promise<Invitacion> {
  const snapshot = await getDoc(doc(requireDb(), INVITACIONES_COLLECTION, token));
  if (!snapshot.exists()) throw new InvitationUnusableError('missing');

  const invitacion = mapInvitacion(snapshot.id, snapshot.data());
  if (invitacion.estado === 'usada') throw new InvitationUnusableError('used');
  if (invitacion.expiraEn && new Date(invitacion.expiraEn) < new Date()) {
    throw new InvitationUnusableError('expired');
  }
  return invitacion;
}

/**
 * Adds the signed-in user to the allowlist and marks the invitation spent, in
 * one atomic batch so a half-accepted invitation cannot exist.
 */
async function canjearInvitacion(uid: string, email: string, token: string): Promise<void> {
  const db = requireDb();
  const batch = writeBatch(db);

  batch.set(doc(db, ADMINS_COLLECTION, uid), {
    email,
    creadoEn: serverTimestamp(),
    invitacion: token,
  });
  batch.update(doc(db, INVITACIONES_COLLECTION, token), {
    estado: 'usada',
    usadaEn: serverTimestamp(),
  });

  await batch.commit();
}

/**
 * Accepts an invitation with a brand-new account.
 *
 * If the batch fails the freshly created account is deleted again, so a failed
 * acceptance does not leave an orphaned login behind.
 */
export async function registrarConInvitacion(
  invitacion: Invitacion,
  password: string,
): Promise<void> {
  if (password.length < MIN_PASSWORD_LENGTH) throw new WeakPasswordError();

  const credential = await createUserWithEmailAndPassword(
    requireAuth(),
    invitacion.email,
    password,
  );

  try {
    await canjearInvitacion(credential.user.uid, invitacion.email, invitacion.id);
  } catch (error) {
    await credential.user.delete().catch(() => {});
    throw error;
  }

  // Best effort: the account already works without it, since holding the
  // invitation token proved control of the inbox. Imported lazily to keep
  // `cuenta.ts` out of this module's import cycle.
  const { enviarVerificacion } = await import('./cuenta');
  await enviarVerificacion(credential.user).catch((caught: Error) =>
    console.warn('[registro] could not send the verification email:', caught.message),
  );
}

/**
 * Accepts an invitation for an address that already has an account — which
 * happens whenever someone is removed and later invited back.
 */
export async function aceptarInvitacionConCuentaExistente(
  invitacion: Invitacion,
  password: string,
): Promise<void> {
  const credential = await signInWithEmailAndPassword(
    requireAuth(),
    invitacion.email,
    password,
  );
  await canjearInvitacion(credential.user.uid, invitacion.email, invitacion.id);
}
