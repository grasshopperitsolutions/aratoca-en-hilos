import { useEffect, useState } from 'react';

import snapshot from '../content/artesanos.generated.json';
import type { Artesano } from '../types/content';

/**
 * Published artisans, seeded from the build-time snapshot and then kept live.
 *
 * The snapshot matters for two reasons: it is what the prerendered HTML
 * contains (so crawlers see real artisan content rather than an empty grid),
 * and it is the initial client state (so hydration matches the server markup).
 *
 * Firestore is pulled in with a dynamic import once the page is interactive.
 * Loading it eagerly would put the whole SDK in the bundle that blocks first
 * paint, to fetch content the page is already displaying.
 */
export function useArtesanos() {
  const [artesanos, setArtesanos] = useState<Artesano[]>(snapshot as Artesano[]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;

    void import('../services/artesanos')
      .then(({ subscribePublishedArtesanos }) => {
        if (cancelled) return;
        unsubscribe = subscribePublishedArtesanos(setArtesanos, setError);
      })
      .catch((caught: Error) => {
        // The snapshot is still on screen, so a failure here is not fatal.
        console.warn('[artesanos] live updates unavailable:', caught.message);
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return { artesanos, error };
}
