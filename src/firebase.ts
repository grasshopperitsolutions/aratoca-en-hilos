import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { ReCaptchaV3Provider, initializeAppCheck } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isBrowser = typeof window !== 'undefined';

/** False in CI and in the SSR/prerender pass, where no credentials are present. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

// Browser-only on purpose. The prerender pass runs this module in Node, where
// initialising the client SDK would be pointless and noisy — the static build
// reads its content from the generated snapshot instead
// (see scripts/fetch-content.mjs).
//
// Auth and Storage deliberately live in `firebaseAdmin.ts`: only the admin
// panel needs them, and keeping them out of this module lets the bundler drop
// both from the chunk every public page loads.
if (isBrowser && isFirebaseConfigured) {
  appInstance = initializeApp(firebaseConfig);
  dbInstance = getFirestore(appInstance);

  // App Check gates the publicly writable `contactos` collection against bots.
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (recaptchaSiteKey) {
    initializeAppCheck(appInstance, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } else {
    console.warn(
      '[firebase] VITE_RECAPTCHA_SITE_KEY missing — App Check is disabled, so the contact form is unprotected against automated submissions.',
    );
  }
}

export const app = appInstance;
export const db = dbInstance;

/** Firestore handle for code paths that cannot proceed without it. */
export function requireDb(): Firestore {
  if (!dbInstance) {
    throw new Error('Firestore is not available — check the VITE_FIREBASE_* variables.');
  }
  return dbInstance;
}

/** App handle for the lazily loaded admin modules. */
export function requireApp(): FirebaseApp {
  if (!appInstance) {
    throw new Error('Firebase is not available — check the VITE_FIREBASE_* variables.');
  }
  return appInstance;
}
