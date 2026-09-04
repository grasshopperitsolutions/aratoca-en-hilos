import { useEffect, useState } from 'react';

import snapshot from '../content/libro.generated.json';

export interface LibroPdf {
  url: string;
  nombre: string;
  tamano: number;
}

/** The snapshot only counts as a PDF once a URL has actually been baked in. */
function fromSnapshot(): LibroPdf | null {
  return snapshot.url
    ? { url: snapshot.url, nombre: snapshot.nombre ?? '', tamano: snapshot.tamano }
    : null;
}

/**
 * The book's downloadable PDF, if the admin has tagged one.
 *
 * Same three properties as `useArtesanos`: the initial value is the build-time
 * snapshot — which is also what the prerendered HTML shows, so hydration
 * matches — Firestore arrives later through a dynamic import that keeps the SDK
 * out of the first-paint bundle, and a failure is not fatal because the
 * snapshot is already on screen.
 *
 * The book is explicitly still in progress, so the live subscription matters:
 * the client can replace the file from /admin/archivos and visitors get the new
 * edition immediately, while crawlers pick it up on the next build.
 */
export function useLibroPdf(): LibroPdf | null {
  const [pdf, setPdf] = useState<LibroPdf | null>(fromSnapshot);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;

    void import('../services/archivos')
      .then(({ subscribeArchivoPorRol }) => {
        if (cancelled) return;
        unsubscribe = subscribeArchivoPorRol('libro-pdf', (archivo) => {
          setPdf(
            archivo?.url
              ? { url: archivo.url, nombre: archivo.nombre, tamano: archivo.tamano }
              : null,
          );
        });
      })
      .catch((caught: Error) => {
        console.warn('[libro] live PDF lookup unavailable:', caught.message);
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return pdf;
}
