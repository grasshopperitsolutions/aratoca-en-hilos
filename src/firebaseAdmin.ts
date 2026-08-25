import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

import { app } from './firebase';

/**
 * Firebase services used only by the admin panel.
 *
 * Split out from `firebase.ts` so `firebase/auth` and `firebase/storage` end up
 * in the lazily loaded admin chunk rather than in the bundle every public
 * visitor downloads. Nothing under `src/pages` (except `pages/admin`) may
 * import this module.
 */
export const auth: Auth | null = app ? getAuth(app) : null;
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;

export function requireAuth(): Auth {
  if (!auth) throw new Error('Firebase Auth is not available — check the VITE_FIREBASE_* variables.');
  return auth;
}

export function requireStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error('Firebase Storage is not available — check the VITE_FIREBASE_* variables.');
  }
  return storage;
}
