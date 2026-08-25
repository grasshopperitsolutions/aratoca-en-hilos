import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

import { requireDb } from '../firebase';
import { requireStorage } from '../firebaseAdmin';
import { ARTESANOS_COLLECTION, mapArtesano, type ArtesanoInput } from './artesanos';
import type { Artesano } from '../types/content';

/**
 * Artisan writes — admin only.
 *
 * Kept apart from `artesanos.ts` so `firebase/storage` stays inside the lazily
 * loaded admin chunk. The Firestore rules enforce the same split server-side.
 */

/** Live feed of every artisan, published or not. */
export function subscribeAllArtesanos(
  onData: (artesanos: Artesano[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const all = query(collection(requireDb(), ARTESANOS_COLLECTION), orderBy('orden', 'asc'));
  return onSnapshot(
    all,
    (snapshot) => onData(snapshot.docs.map(mapArtesano)),
    (error) => onError?.(error),
  );
}

export async function createArtesano(input: ArtesanoInput): Promise<string> {
  const created = await addDoc(collection(requireDb(), ARTESANOS_COLLECTION), {
    ...input,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  });
  return created.id;
}

export async function updateArtesano(id: string, input: Partial<ArtesanoInput>): Promise<void> {
  await updateDoc(doc(requireDb(), ARTESANOS_COLLECTION, id), {
    ...input,
    actualizadoEn: serverTimestamp(),
  });
}

/**
 * Deletes the profile and its portrait together, so the media library never
 * accumulates orphaned files. A missing storage object is not an error —
 * the document still has to go.
 */
export async function deleteArtesano(artesano: Pick<Artesano, 'id' | 'fotoPath'>): Promise<void> {
  if (artesano.fotoPath) {
    try {
      await deleteObject(ref(requireStorage(), artesano.fotoPath));
    } catch (error) {
      console.warn(`[artesanos] could not delete portrait ${artesano.fotoPath}:`, error);
    }
  }
  await deleteDoc(doc(requireDb(), ARTESANOS_COLLECTION, artesano.id));
}
