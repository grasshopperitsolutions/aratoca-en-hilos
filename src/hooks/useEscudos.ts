import { useEffect, useState } from 'react';

import snapshot from '../content/libro.generated.json';
import { ESCUDOS_IMPRESOS } from '../content/libro/estructura';

export interface Escudos {
  aratoca: string;
  ministerio: string;
}

/**
 * The bundled artwork from the printed first edition. Used until — and unless —
 * an admin uploads a replacement.
 */
function fromBundle(): Escudos {
  return { ...ESCUDOS_IMPRESOS };
}

/**
 * The build-time snapshot, so the prerendered HTML already carries whatever the
 * client had uploaded at build time and hydration matches.
 */
function fromSnapshot(): Escudos {
  const bundle = fromBundle();
  return {
    aratoca: snapshot.escudoAratoca || bundle.aratoca,
    ministerio: snapshot.logoMinisterio || bundle.ministerio,
  };
}

/**
 * The two institutional crests: Aratoca's and the Ministry's.
 *
 * Same three properties as `useLibroPdf`: the initial value is the build-time
 * snapshot, Firestore arrives later through a dynamic import that keeps the SDK
 * out of the first-paint bundle, and a failure is not fatal because the bundled
 * artwork is already on screen.
 *
 * Unlike the PDF this never resolves to null — an empty role falls back to the
 * printed edition's files rather than leaving a gap in the layout.
 */
export function useEscudos(): Escudos {
  const [escudos, setEscudos] = useState<Escudos>(fromSnapshot);

  useEffect(() => {
    let unsubscribes: (() => void)[] = [];
    let cancelled = false;

    void import('../services/archivos')
      .then(({ subscribeArchivoPorRol }) => {
        if (cancelled) return;
        unsubscribes = [
          subscribeArchivoPorRol('escudo-aratoca', (archivo) => {
            setEscudos((previo) => ({
              ...previo,
              aratoca: archivo?.url || fromBundle().aratoca,
            }));
          }),
          subscribeArchivoPorRol('logo-ministerio', (archivo) => {
            setEscudos((previo) => ({
              ...previo,
              ministerio: archivo?.url || fromBundle().ministerio,
            }));
          }),
        ];
      })
      .catch((caught: Error) => {
        console.warn('[libro] live crest lookup unavailable:', caught.message);
      });

    return () => {
      cancelled = true;
      unsubscribes.forEach((off) => {
        off();
      });
    };
  }, []);

  return escudos;
}
