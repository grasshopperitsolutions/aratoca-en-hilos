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
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { db, requireDb } from '../firebase';
import { requireStorage } from '../firebaseAdmin';
import type { Archivo } from '../types/content';

export const ARCHIVOS_COLLECTION = 'archivos';
export const ARCHIVOS_PREFIX = 'archivos';

/** Matches the ceiling enforced in storage.rules. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];

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
  };
}

/** Live feed of the media library, newest first. */
export function subscribeArchivos(
  onData: (archivos: Archivo[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!db) return () => {};
  const library = query(collection(db, ARCHIVOS_COLLECTION), orderBy('subidoEn', 'desc'));
  return onSnapshot(
    library,
    (snapshot) => onData(snapshot.docs.map(mapArchivo)),
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
  if (file.size > MAX_FILE_BYTES) throw new FileTooLargeError();
  if (!ACCEPTED_TYPES.includes(file.type)) throw new UnsupportedTypeError();

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
  };
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
