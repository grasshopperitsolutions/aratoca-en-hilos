/**
 * Pulls published artisans out of Firestore into a committed snapshot that the
 * prerender step can bake into static HTML.
 *
 * Without this the Artesanos page would ship an empty grid to every crawler
 * that does not run JavaScript — which is most of them, and all of the AI ones.
 *
 * Degrades gracefully: with no Firebase credentials (CI, a fresh clone) it
 * leaves the existing snapshot in place and exits successfully.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';
import { initializeApp, deleteApp } from 'firebase/app';
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';

const OUTPUT = path.resolve('src/content/artesanos.generated.json');
const env = loadEnv('production', process.cwd(), 'VITE_');

if (!env.VITE_FIREBASE_API_KEY) {
  console.warn(
    '[fetch-content] No VITE_FIREBASE_API_KEY — keeping the committed artisan snapshot.',
  );
  process.exit(0);
}

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});

const toIso = (value) =>
  value && typeof value.toDate === 'function' ? value.toDate().toISOString() : null;

const localised = (value) => ({
  es: typeof value?.es === 'string' ? value.es : '',
  en: typeof value?.en === 'string' ? value.en : '',
});

try {
  const snapshot = await getDocs(
    query(
      collection(getFirestore(app), 'artesanos'),
      where('publicado', '==', true),
      orderBy('orden', 'asc'),
    ),
  );

  const artesanos = snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      nombre: typeof data.nombre === 'string' ? data.nombre : '',
      oficio: localised(data.oficio),
      bio: localised(data.bio),
      fotoUrl: typeof data.fotoUrl === 'string' ? data.fotoUrl : '',
      fotoPath: typeof data.fotoPath === 'string' ? data.fotoPath : '',
      orden: typeof data.orden === 'number' ? data.orden : 0,
      publicado: true,
      creadoEn: toIso(data.creadoEn),
      actualizadoEn: toIso(data.actualizadoEn),
    };
  });

  await writeFile(OUTPUT, `${JSON.stringify(artesanos, null, 2)}\n`);
  console.log(`[fetch-content] Wrote ${artesanos.length} published artisan(s) to the snapshot.`);
} catch (error) {
  // A build must never fail because Firestore was briefly unreachable — the
  // committed snapshot is a perfectly good fallback.
  console.warn(`[fetch-content] Could not read Firestore (${error.message}). Keeping the existing snapshot.`);
} finally {
  await deleteApp(app);
}
