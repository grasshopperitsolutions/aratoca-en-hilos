import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { db, requireDb } from '../firebase';
import { requireStorage } from '../firebaseAdmin';
import { descendingBy } from './ordering';
import type { Archivo, ArchivoRol } from '../types/content';

export const ARCHIVOS_COLLECTION = 'archivos';
export const ARCHIVOS_PREFIX = 'archivos';

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
export const PDF_TYPE = 'application/pdf';

export const ACCEPTED_TYPES = [...IMAGE_TYPES, PDF_TYPE];

/**
 * Size ceilings per kind of file. These MUST stay in step with
 * `isAllowedUpload()` in storage.rules — the rules are the enforcement, this is
 * only the error message.
 */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_PDF_BYTES = 50 * 1024 * 1024;

/** Largest upload allowed for a given content type. */
export function maxBytesFor(tipo: string): number {
  return tipo === PDF_TYPE ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
}

/** Kept for callers that only deal with images; prefer `maxBytesFor`. */
export const MAX_FILE_BYTES = MAX_IMAGE_BYTES;

export class FileTooLargeError extends Error {
  constructor() {
    super('File exceeds the maximum size');
    this.name = 'FileTooLargeError';
  }
}

export class UnsupportedTypeError extends Error {
  constructor() {
    super('Unsupported file type');
    this.name = 'UnsupportedTypeError';
  }
}

/** Strips path separators and accents so Storage keys stay predictable. */
function safeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function mapArchivo(snapshot: QueryDocumentSnapshot<DocumentData>): Archivo {
  const data = snapshot.data();
  const subidoEn = data.subidoEn;
  return {
    id: snapshot.id,
    nombre: typeof data.nombre === 'string' ? data.nombre : '',
    url: typeof data.url === 'string' ? data.url : '',
    path: typeof data.path === 'string' ? data.path : '',
    tipo: typeof data.tipo === 'string' ? data.tipo : '',
    tamano: typeof data.tamano === 'number' ? data.tamano : 0,
    subidoEn: subidoEn instanceof Timestamp ? subidoEn.toDate().toISOString() : null,
    rol: data.rol === 'libro-pdf' ? 'libro-pdf' : null,
  };
}

/** Live feed of the media library, newest first. */
export function subscribeArchivos(
  onData: (archivos: Archivo[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!db) return () => {};
  return onSnapshot(
    collection(db, ARCHIVOS_COLLECTION),
    (snapshot) => onData(snapshot.docs.map(mapArchivo).sort(descendingBy((a) => a.subidoEn))),
    (error) => onError?.(error),
  );
}

/**
 * Uploads a file to Storage and records it in the library.
 *
 * Validation happens here for the error message and again in storage.rules for
 * the enforcement — a client-side check alone would stop nobody.
 */
export async function subirArchivo(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<Archivo> {
  if (!ACCEPTED_TYPES.includes(file.type)) throw new UnsupportedTypeError();
  if (file.size > maxBytesFor(file.type)) throw new FileTooLargeError();

  const path = `${ARCHIVOS_PREFIX}/${Date.now()}-${safeName(file.name)}`;
  const task = uploadBytesResumable(ref(requireStorage(), path), file, {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000, immutable',
  });

  await new Promise<void>((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) =>
        onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      () => resolve(),
    );
  });

  const url = await getDownloadURL(task.snapshot.ref);
  const created = await addDoc(collection(requireDb(), ARCHIVOS_COLLECTION), {
    nombre: file.name,
    url,
    path,
    tipo: file.type,
    tamano: file.size,
    subidoEn: serverTimestamp(),
  });

  return {
    id: created.id,
    nombre: file.name,
    url,
    path,
    tipo: file.type,
    tamano: file.size,
    subidoEn: new Date().toISOString(),
    rol: null,
  };
}

/**
 * Gives one file a role, clearing it from whichever file held it before.
 *
 * Roles are exclusive: exactly one PDF is "the book" at a time. Clearing first
 * means a half-finished run leaves no role rather than two, which is the safer
 * way to fail — a missing download button beats serving last year's edition.
 */
export async function asignarRol(archivoId: string, rol: ArchivoRol): Promise<void> {
  const database = requireDb();
  const anteriores = await getDocs(
    query(collection(database, ARCHIVOS_COLLECTION), where('rol', '==', rol)),
  );

  await Promise.all(
    anteriores.docs
      .filter((previo) => previo.id !== archivoId)
      .map((previo) => updateDoc(previo.ref, { rol: null })),
  );

  await updateDoc(doc(database, ARCHIVOS_COLLECTION, archivoId), { rol });
}

/** Removes a role, leaving no file in it. */
export async function quitarRol(archivoId: string): Promise<void> {
  await updateDoc(doc(requireDb(), ARCHIVOS_COLLECTION, archivoId), { rol: null });
}

/**
 * Live feed of the single file holding a role, or `null` when none does.
 *
 * Public-facing: `archivos` is world-readable, so a visitor can resolve the
 * current book PDF without an admin session.
 */
export function subscribeArchivoPorRol(
  rol: ArchivoRol,
  onData: (archivo: Archivo | null) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, ARCHIVOS_COLLECTION), where('rol', '==', rol)),
    (snapshot) => onData(snapshot.docs.map(mapArchivo)[0] ?? null),
    (error) => onError?.(error),
  );
}

/** Removes the Storage object and its library entry together. */
export async function eliminarArchivo(archivo: Pick<Archivo, 'id' | 'path'>): Promise<void> {
  try {
    await deleteObject(ref(requireStorage(), archivo.path));
  } catch (error) {
    console.warn(`[archivos] could not delete object ${archivo.path}:`, error);
  }
  await deleteDoc(doc(requireDb(), ARCHIVOS_COLLECTION, archivo.id));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
