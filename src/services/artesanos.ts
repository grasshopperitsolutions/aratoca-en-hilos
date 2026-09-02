import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import { db } from '../firebase';
import { ascendingBy } from './ordering';
import { EMPTY_LOCALISED, type Artesano, type Localised } from '../types/content';

export const ARTESANOS_COLLECTION = 'artesanos';

/**
 * Read-only artisan access for the public site.
 *
 * Writes live in `artesanosAdmin.ts` so this module never pulls
 * `firebase/storage` into the bundle every visitor downloads.
 */

/** Firestore timestamps are not serialisable — normalise them to ISO strings. */
function toIso(value: unknown): string | null {
  return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

function toLocalised(value: unknown): Localised {
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return {
      es: typeof record.es === 'string' ? record.es : '',
      en: typeof record.en === 'string' ? record.en : '',
    };
  }
  return { ...EMPTY_LOCALISED };
}

export function mapArtesano(snapshot: QueryDocumentSnapshot<DocumentData>): Artesano {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    nombre: typeof data.nombre === 'string' ? data.nombre : '',
    oficio: toLocalised(data.oficio),
    bio: toLocalised(data.bio),
    fotoUrl: typeof data.fotoUrl === 'string' ? data.fotoUrl : '',
    fotoPath: typeof data.fotoPath === 'string' ? data.fotoPath : '',
    orden: typeof data.orden === 'number' ? data.orden : 0,
    publicado: data.publicado === true,
    creadoEn: toIso(data.creadoEn),
    actualizadoEn: toIso(data.actualizadoEn),
  };
}

export type ArtesanoInput = Omit<Artesano, 'id' | 'creadoEn' | 'actualizadoEn'>;

/**
 * Live feed of published artisans.
 *
 * Returns a no-op unsubscribe when Firebase is unavailable (SSR, CI, missing
 * env) so callers never need to branch — they just keep the build-time snapshot.
 */
export function subscribePublishedArtesanos(
  onData: (artesanos: Artesano[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!db) return () => {};

  // Filter only — the sort happens in code (see ./ordering). That also means
  // this query needs no composite index.
  const published = query(collection(db, ARTESANOS_COLLECTION), where('publicado', '==', true));

  return onSnapshot(
    published,
    (snapshot) => onData(snapshot.docs.map(mapArtesano).sort(ascendingBy((a) => a.orden))),
    (error) => onError?.(error),
  );
}
