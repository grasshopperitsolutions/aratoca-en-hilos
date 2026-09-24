import { useCallback, useEffect, useSyncExternalStore } from 'react';

import {
  alternarSilencio,
  detenerAmbiente,
  estaSilenciado,
  iniciarAmbiente,
  reproducir,
  silencioServidor,
  suscribirSilencio,
  type Efecto,
} from '../audio/sonidos';

/**
 * Whether sound is currently off, and a way to flip it.
 *
 * The preference lives in localStorage and is read through
 * `useSyncExternalStore` so every mute button on the page agrees, and so the
 * server render — which has no localStorage — reports "not muted" and matches
 * the hydration pass.
 */
export function useSilencio(): { silenciado: boolean; alternar: () => void } {
  const silenciado = useSyncExternalStore(suscribirSilencio, estaSilenciado, silencioServidor);
  return { silenciado, alternar: alternarSilencio };
}

/** Fires one effect. Stable, so it is safe in dependency arrays. */
export function useEfecto(): (efecto: Efecto) => void {
  return useCallback((efecto: Efecto) => {
    reproducir(efecto);
  }, []);
}

/**
 * Runs the ambient bed for as long as the component is mounted.
 *
 * Also stops it while the tab is hidden: a loop that keeps playing after the
 * visitor has switched away is the fastest way to get a site muted for good.
 */
export function useAmbiente(activo: boolean): void {
  useEffect(() => {
    if (!activo) return;

    iniciarAmbiente();

    const alCambiarVisibilidad = () => {
      if (document.hidden) detenerAmbiente();
      else iniciarAmbiente();
    };
    document.addEventListener('visibilitychange', alCambiarVisibilidad);

    return () => {
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
      detenerAmbiente();
    };
  }, [activo]);
}
