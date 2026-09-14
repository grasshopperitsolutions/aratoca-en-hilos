import { useCallback, useSyncExternalStore } from 'react';

/**
 * Remembers how the reader answered each activity.
 *
 * Kept in `localStorage` and nowhere else: it is a private record of someone
 * working through a book, it is worth nothing to anyone else, and storing it
 * server-side would mean accounts, rules and a backend for no gain.
 *
 * Exposed through `useSyncExternalStore` rather than an effect. The server and
 * the first client render both see an empty record, so a reader who already has
 * saved answers cannot produce a tree React never rendered — the saved state
 * arrives on the subscription, one render later. It also keeps the reducer out
 * of an effect, which the project's lint rules rightly forbid.
 */

const CLAVE = 'aratoca.libro.progreso.v1';

export interface Respuesta {
  /** Whether the reader has settled on an answer at all. */
  respondida: boolean;
  /** Whether the very first attempt was right — what the closing summary counts. */
  aciertoPrimera: boolean;
}

export type Progreso = Readonly<Record<string, Respuesta>>;

const VACIO: Progreso = Object.freeze({});

let estado: Progreso = VACIO;
let leido = false;
const oyentes = new Set<() => void>();

function avisar(): void {
  for (const oyente of oyentes) oyente();
}

/** Reads once, lazily, and never throws: a blocked store just means no history. */
function leerAlmacen(): void {
  if (leido || typeof window === 'undefined') return;
  leido = true;
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return;
    const analizado: unknown = JSON.parse(crudo);
    if (analizado && typeof analizado === 'object') {
      estado = Object.freeze({ ...(analizado as Progreso) });
      avisar();
    }
  } catch {
    // Private browsing, blocked cookies, corrupt value — carry on unsaved.
  }
}

function escribirAlmacen(): void {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // The session still works; it simply will not survive a reload.
  }
}

function suscribir(alCambiar: () => void): () => void {
  leerAlmacen();
  oyentes.add(alCambiar);
  return () => {
    oyentes.delete(alCambiar);
  };
}

const instantanea = (): Progreso => estado;
const instantaneaServidor = (): Progreso => VACIO;

/**
 * Records an answer. Only the first attempt counts towards the score, so a
 * reader can retry freely without the summary punishing them for exploring —
 * which is the point of the exercise.
 */
export function registrarRespuesta(id: string, correcta: boolean): void {
  const previa = estado[id];
  estado = Object.freeze({
    ...estado,
    [id]: {
      respondida: true,
      aciertoPrimera: previa?.respondida ? previa.aciertoPrimera : correcta,
    },
  });
  escribirAlmacen();
  avisar();
}

export function reiniciarProgreso(): void {
  estado = VACIO;
  try {
    window.localStorage.removeItem(CLAVE);
  } catch {
    // Nothing to clean up if it was never written.
  }
  avisar();
}

export function useProgresoLibro(): {
  progreso: Progreso;
  registrar: (id: string, correcta: boolean) => void;
  reiniciar: () => void;
} {
  const progreso = useSyncExternalStore(suscribir, instantanea, instantaneaServidor);

  const registrar = useCallback((id: string, correcta: boolean) => {
    registrarRespuesta(id, correcta);
  }, []);

  const reiniciar = useCallback(() => {
    reiniciarProgreso();
  }, []);

  return { progreso, registrar, reiniciar };
}

/** Totals for the closing page. */
export function resumirProgreso(
  progreso: Progreso,
  ids: readonly string[],
): { respondidas: number; aciertos: number; total: number } {
  let respondidas = 0;
  let aciertos = 0;
  for (const id of ids) {
    const respuesta = progreso[id];
    if (!respuesta?.respondida) continue;
    respondidas += 1;
    if (respuesta.aciertoPrimera) aciertos += 1;
  }
  return { respondidas, aciertos, total: ids.length };
}
