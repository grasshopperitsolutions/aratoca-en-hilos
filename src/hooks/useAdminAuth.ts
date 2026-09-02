import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase';
import { auth } from '../firebaseAdmin';
import { ADMINS_COLLECTION } from '../services/admins';
import { sincronizarEmailAdmin } from '../services/cuenta';

export type AdminStatus =
  /** Still resolving the Firebase session. */
  | 'loading'
  /** No session — show the login form. */
  | 'anonymous'
  /** Signed in, but not on the admin allowlist. */
  | 'unauthorised'
  | 'admin';

/**
 * Resolves whether the current visitor may use the admin panel.
 *
 * Being signed in is not enough: the uid must also have a document in
 * `admins/`, which is the same allowlist the Firestore and Storage rules check.
 * The UI check is only for routing — the rules are what actually protect data.
 */
export function useAdminAuth() {
  // Without Firebase there is no session to wait for, so start settled rather
  // than flipping the state from inside an effect.
  const [status, setStatus] = useState<AdminStatus>(() =>
    auth && db ? 'loading' : 'anonymous',
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authRef = auth;
    const dbRef = db;
    if (!authRef || !dbRef) return;

    return onAuthStateChanged(authRef, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setStatus('anonymous');
        return;
      }

      try {
        const allowlisted = await getDoc(doc(dbRef, ADMINS_COLLECTION, nextUser.uid));
        setStatus(allowlisted.exists() ? 'admin' : 'unauthorised');

        if (allowlisted.exists()) {
          // An email change completes whenever the user opens the link Firebase
          // sent — possibly in a different browser, with this app nowhere in
          // sight. Realign the allowlist entry on the next sign-in so the admin
          // list never shows a stale address. Failure here is cosmetic only.
          const stored = allowlisted.data().email;
          void sincronizarEmailAdmin(
            nextUser,
            typeof stored === 'string' ? stored : '',
          ).catch((error: Error) =>
            console.warn('[admin] could not sync the stored email:', error.message),
          );
        }
      } catch (error) {
        console.error('[admin] could not verify the allowlist:', error);
        setStatus('unauthorised');
      }
    });
  }, []);

  return { status, user };
}
