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
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

const OUTPUT = path.resolve('src/content/artesanos.generated.json');
const OUTPUT_LIBRO = path.resolve('src/content/libro.generated.json');
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

// Mirrors the runtime mapping in src/services/artesanos.ts — the prerendered
// HTML must show exactly what the hydrated page shows.
const enlaces = (value) =>
  (Array.isArray(value) ? value : [])
    .map((e) => ({ url: typeof e?.url === 'string' ? e.url : '', etiqueta: typeof e?.etiqueta === 'string' ? e.etiqueta : '' }))
    .filter((e) => e.url.length > 0);

const telefonos = (value) =>
  (Array.isArray(value) ? value : [])
    .map((e) => ({ numero: typeof e?.numero === 'string' ? e.numero : '', whatsapp: e?.whatsapp === true }))
    .filter((e) => e.numero.length > 0);

const correos = (value) =>
  (Array.isArray(value) ? value : []).filter((e) => typeof e === 'string' && e.length > 0);

try {
  // Filter only; the sort happens below in code, matching src/services/ordering.ts.
  const snapshot = await getDocs(
    query(collection(getFirestore(app), 'artesanos'), where('publicado', '==', true)),
  );

  const artesanos = snapshot.docs
    .map((document) => {
      const data = document.data();
      return {
        id: document.id,
        nombre: typeof data.nombre === 'string' ? data.nombre : '',
        oficio: localised(data.oficio),
        bio: localised(data.bio),
        fotoUrl: typeof data.fotoUrl === 'string' ? data.fotoUrl : '',
        fotoPath: typeof data.fotoPath === 'string' ? data.fotoPath : '',
        enlaces: enlaces(data.enlaces),
        telefonos: telefonos(data.telefonos),
        correos: correos(data.correos),
        mapaUrl: typeof data.mapaUrl === 'string' ? data.mapaUrl : '',
        orden: typeof data.orden === 'number' ? data.orden : 0,
        publicado: true,
        creadoEn: toIso(data.creadoEn),
        actualizadoEn: toIso(data.actualizadoEn),
      };
    })
    .sort((a, b) => a.orden - b.orden);

  await writeFile(OUTPUT, `${JSON.stringify(artesanos, null, 2)}\n`);
  console.log(`[fetch-content] Wrote ${artesanos.length} published artisan(s) to the snapshot.`);

  // The book's downloadable PDF, resolved by role rather than filename so the
  // client can swap editions from the admin panel. Baking the URL in means the
  // download button is present in the static HTML, with no JavaScript.
  const pdfSnapshot = await getDocs(
    query(collection(getFirestore(app), 'archivos'), where('rol', '==', 'libro-pdf')),
  );

  const pdfDoc = pdfSnapshot.docs[0];
  const pdf = pdfDoc
    ? {
        url: typeof pdfDoc.data().url === 'string' ? pdfDoc.data().url : null,
        nombre: typeof pdfDoc.data().nombre === 'string' ? pdfDoc.data().nombre : null,
        tamano: typeof pdfDoc.data().tamano === 'number' ? pdfDoc.data().tamano : 0,
      }
    : { url: null, nombre: null, tamano: 0 };

  await writeFile(OUTPUT_LIBRO, `${JSON.stringify(pdf, null, 2)}\n`);
  console.log(
    pdf.url
      ? `[fetch-content] Book PDF: ${pdf.nombre}`
      : '[fetch-content] No book PDF tagged — the download button will stay hidden.',
  );
} catch (error) {
  // A build must never fail because Firestore was briefly unreachable — the
  // committed snapshot is a perfectly good fallback.
  console.warn(`[fetch-content] Could not read Firestore (${error.message}). Keeping the existing snapshot.`);
} finally {
  await deleteApp(app);
}
