import { useMemo } from 'react';

/**
 * The drifting layer behind the site: fique leaves, seeds and fibres carried on
 * the canyon wind.
 *
 * Fixed to the viewport and sitting at z-0, under everything the visitor reads.
 * Three rules keep it from becoming a nuisance:
 *
 * - `pointer-events-none` and `aria-hidden`, so it is invisible to the mouse
 *   and to a screen reader alike.
 * - Only `transform` and `opacity` are animated, so the whole layer stays on
 *   the compositor and never triggers layout.
 * - It is removed outright under `prefers-reduced-motion` (see index.css);
 *   slowing drifting debris down does not make it less distracting.
 *
 * The shapes are inline SVG rather than images: a handful of paths weighs
 * nothing and recolours with the palette.
 */

type FormaId = 'hoja' | 'penca' | 'semilla' | 'fibra';

interface Mota {
  forma: FormaId;
  /** Viewport width percentage where the drift starts. */
  izquierda: number;
  /** Seconds for one full fall. */
  duracion: number;
  /** Negative, so the field is already in motion on arrival. */
  retraso: number;
  escala: number;
  opacidad: number;
  /** Which of the two sway keyframes this one uses, so they desynchronise. */
  vaiven: 1 | 2;
}

/**
 * Fixed rather than random: a random field would differ between the server
 * render and hydration, and React would throw the whole layer away and rebuild
 * it. These were placed by eye to avoid clumps.
 */
const MOTAS: readonly Mota[] = [
  { forma: 'hoja', izquierda: 6, duracion: 34, retraso: -2, escala: 1, opacidad: 0.16, vaiven: 1 },
  { forma: 'semilla', izquierda: 17, duracion: 26, retraso: -13, escala: 0.6, opacidad: 0.2, vaiven: 2 },
  { forma: 'fibra', izquierda: 28, duracion: 41, retraso: -25, escala: 1.1, opacidad: 0.12, vaiven: 1 },
  { forma: 'penca', izquierda: 39, duracion: 38, retraso: -7, escala: 0.9, opacidad: 0.1, vaiven: 2 },
  { forma: 'hoja', izquierda: 52, duracion: 29, retraso: -19, escala: 0.75, opacidad: 0.18, vaiven: 2 },
  { forma: 'semilla', izquierda: 63, duracion: 45, retraso: -31, escala: 0.5, opacidad: 0.22, vaiven: 1 },
  { forma: 'hoja', izquierda: 74, duracion: 31, retraso: -5, escala: 1.15, opacidad: 0.14, vaiven: 1 },
  { forma: 'fibra', izquierda: 85, duracion: 36, retraso: -22, escala: 0.85, opacidad: 0.13, vaiven: 2 },
  { forma: 'penca', izquierda: 93, duracion: 43, retraso: -11, escala: 0.7, opacidad: 0.11, vaiven: 1 },
];

function Forma({ forma }: { forma: FormaId }) {
  switch (forma) {
    // A fique leaf: long, keeled down the middle, toothed along one edge.
    case 'penca':
      return (
        <svg viewBox="0 0 24 64" className="w-5 h-14 text-penca" fill="none" aria-hidden="true">
          <path
            d="M12 2c5 14 7 28 5 43-1 9-3 15-5 17-2-2-4-8-5-17C5 30 7 16 12 2Z"
            fill="currentColor"
          />
          <path d="M12 6v54" stroke="var(--color-cream, #fff)" strokeOpacity=".35" strokeWidth="1" />
        </svg>
      );

    // A broadleaf, for the trees on the slope.
    case 'hoja':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6 text-moss" fill="none" aria-hidden="true">
          <path
            d="M28 4C16 4 4 11 4 22c0 3 1 5 2 6 7 1 22-3 22-24Z"
            fill="currentColor"
          />
          <path
            d="M27 5C20 12 13 19 6 27"
            stroke="var(--color-cream, #fff)"
            strokeOpacity=".4"
            strokeWidth="1.2"
          />
        </svg>
      );

    case 'semilla':
      return (
        <svg viewBox="0 0 12 12" className="w-2 h-2 text-earth" aria-hidden="true">
          <circle cx="6" cy="6" r="5" fill="currentColor" />
        </svg>
      );

    // A loose strand of cabuya.
    case 'fibra':
      return (
        <svg viewBox="0 0 40 10" className="w-10 h-2.5 text-stone" fill="none" aria-hidden="true">
          <path
            d="M1 5c6-4 12 4 19 0s13-4 19 1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export default function FondoVivo() {
  // Static data, but memoised so the array identity is stable across renders.
  const motas = useMemo(() => MOTAS, []);

  return (
    <div className="fondo-vivo pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {motas.map((mota, indice) => (
        // Three nested elements, one motion each: they compose without
        // fighting over a single `transform`, and all three are
        // compositor-only.
        <span
          key={`${mota.forma}-${indice}`}
          className="fondo-vivo__caida"
          style={{
            left: `${mota.izquierda}%`,
            opacity: mota.opacidad,
            animationDuration: `${mota.duracion}s`,
            animationDelay: `${mota.retraso}s`,
          }}
        >
          <span
            className="fondo-vivo__vaiven"
            style={{
              animationDuration: `${mota.vaiven === 1 ? 9 : 13}s`,
              animationDirection: mota.vaiven === 1 ? 'alternate' : 'alternate-reverse',
            }}
          >
            <span
              className="fondo-vivo__giro"
              style={{
                animationDuration: `${mota.vaiven === 1 ? 17 : 23}s`,
                ['--escala' as string]: mota.escala,
              }}
            >
              <Forma forma={mota.forma} />
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
