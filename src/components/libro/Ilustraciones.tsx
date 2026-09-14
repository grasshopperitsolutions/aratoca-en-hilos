import { useId } from 'react';

import type { IlustracionId } from '../../types/libro';

/**
 * The drawings a slider drives.
 *
 * Each one answers the same question — "what actually changes if I move this?"
 * — for a claim the chapter has just made. They are inline SVG so they scale,
 * follow the theme tokens, cost nothing to load and can be described to a
 * screen reader; and because they are pure functions of the slider value, they
 * redraw smoothly without any animation code at all.
 */

interface IlustracionProps {
  /** Current slider value. */
  valor: number;
  /** Where the correct band sits, so the drawing can agree with the caption. */
  aciertoMin: number;
  aciertoMax: number;
  /** Accessible description; the slider itself carries the label. */
  descripcion: string;
}

const SUAVE = 'transition-all duration-300 ease-out';

/* ------------------------------------------------------------------ */
/* La regla del cogollo — how many pencas you leave                     */
/* ------------------------------------------------------------------ */

function Cogollo({ valor, aciertoMin, descripcion }: IlustracionProps) {
  const id = useId();
  const suficiente = valor >= aciertoMin;

  // Leaves fan out from the crown. Below the threshold the plant is visibly
  // stripped, which is precisely what the text warns about.
  const hojas = Math.max(0, Math.round(valor));

  return (
    <svg viewBox="0 0 320 220" role="img" aria-labelledby={id} className="w-full h-auto">
      <title id={id}>{descripcion}</title>

      <line x1="30" y1="196" x2="290" y2="196" className="stroke-stone" strokeWidth="1.5" />

      {Array.from({ length: hojas }, (_, i) => {
        const mitad = Math.max(1, Math.floor(hojas / 2));
        const lado = i < mitad ? -1 : 1;
        const rango = i < mitad ? i : i - mitad;
        const angulo = 10 + rango * (64 / mitad);
        const largo = 44 + rango * 3.4;
        const rad = (angulo * Math.PI) / 180;

        return (
          <line
            key={i}
            x1="160"
            y1="192"
            x2={160 + lado * Math.sin(rad) * largo}
            y2={192 - Math.cos(rad) * largo}
            strokeWidth="6"
            strokeLinecap="round"
            className={`${SUAVE} ${suficiente ? 'stroke-penca' : 'stroke-terracotta'}`}
            opacity={suficiente ? 1 : 0.75}
          />
        );
      })}

      {/* The cogollo itself: the heart the rule protects. */}
      <circle
        cx="160"
        cy="192"
        r="11"
        className={`${SUAVE} ${suficiente ? 'fill-earth' : 'fill-terracotta'}`}
      />

      {!suficiente && (
        <text x="160" y="30" textAnchor="middle" className="fill-terracotta text-[13px] font-semibold">
          Cogollo comprometido
        </text>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Rendimiento — a proportion of a whole                                */
/* ------------------------------------------------------------------ */

function Rendimiento({ valor, aciertoMin, aciertoMax, descripcion }: IlustracionProps) {
  const id = useId();
  const dentro = valor >= aciertoMin && valor <= aciertoMax;
  const proporcion = Math.max(0, Math.min(100, valor));

  return (
    <svg viewBox="0 0 320 150" role="img" aria-labelledby={id} className="w-full h-auto">
      <title id={id}>{descripcion}</title>

      <rect x="20" y="46" width="280" height="58" rx="10" className="fill-earth/25" />
      <rect
        x="20"
        y="46"
        width={Math.max(2, (280 * proporcion) / 100)}
        height="58"
        rx="10"
        className={`${SUAVE} ${dentro ? 'fill-penca' : 'fill-fique'}`}
      />

      <text
        x="20"
        y="34"
        className={`${SUAVE} text-[15px] font-bold ${dentro ? 'fill-penca' : 'fill-charcoal'}`}
      >
        {Math.round(proporcion)}%
      </text>
      <text x="300" y="34" textAnchor="end" className="fill-stone text-[12px]">
        {Math.round(100 - proporcion)}% restante
      </text>
      <text x="20" y="128" className="fill-stone text-[12px]">
        Una hoja de fique
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* El gesto del varillado — pressure against the bar                    */
/* ------------------------------------------------------------------ */

function Varillado({ valor, aciertoMin, aciertoMax, descripcion }: IlustracionProps) {
  const id = useId();
  const dentro = valor >= aciertoMin && valor <= aciertoMax;
  const demasiada = valor > aciertoMax;

  // Too little pressure leaves pulp on the fibre; too much snaps it into short
  // pieces. Both failures are drawn, because both are what the text describes.
  const filamentos = 7;

  return (
    <svg viewBox="0 0 320 170" role="img" aria-labelledby={id} className="w-full h-auto">
      <title id={id}>{descripcion}</title>

      {/* The bar the penca is dragged against. */}
      <rect x="18" y="72" width="18" height="80" rx="4" className="fill-earth" />

      {Array.from({ length: filamentos }, (_, i) => {
        const y = 40 + i * 15;
        if (demasiada) {
          // Broken into short lengths.
          const corte = 150 + ((i * 37) % 60);
          return (
            <g key={i} className={SUAVE}>
              <line x1="44" y1={y} x2={corte} y2={y} strokeWidth="4" strokeLinecap="round" className="stroke-terracotta" />
              <line x1={corte + 22} y1={y} x2="296" y2={y} strokeWidth="4" strokeLinecap="round" className="stroke-terracotta" opacity="0.55" />
            </g>
          );
        }
        return (
          <line
            key={i}
            x1="44"
            y1={y}
            x2="296"
            y2={y}
            strokeWidth={dentro ? 4 : 7}
            strokeLinecap="round"
            className={`${SUAVE} ${dentro ? 'stroke-fique' : 'stroke-moss'}`}
          />
        );
      })}

      {!dentro && !demasiada && (
        <text x="170" y="164" textAnchor="middle" className="fill-moss text-[12px] font-semibold">
          Queda pulpa adherida
        </text>
      )}
      {demasiada && (
        <text x="170" y="164" textAnchor="middle" className="fill-terracotta text-[12px] font-semibold">
          Filamentos rotos · fibra corta
        </text>
      )}
      {dentro && (
        <text x="170" y="164" textAnchor="middle" className="fill-penca text-[12px] font-semibold">
          Fibra limpia, larga y entera
        </text>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* El remojo — hours in the water                                       */
/* ------------------------------------------------------------------ */

function Remojo({ valor, aciertoMin, aciertoMax, descripcion }: IlustracionProps) {
  const id = useId();
  const dentro = valor >= aciertoMin && valor <= aciertoMax;
  const poco = valor < aciertoMin;

  // The fibre lightens as the pulp washes out, then stops improving.
  const limpieza = Math.min(1, valor / aciertoMin);

  return (
    <svg viewBox="0 0 320 150" role="img" aria-labelledby={id} className="w-full h-auto">
      <title id={id}>{descripcion}</title>

      <rect x="24" y="48" width="272" height="70" rx="8" className="fill-moss/25" />

      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={i}
          x1="40"
          y1={58 + i * 12}
          x2="280"
          y2={58 + i * 12}
          strokeWidth="5"
          strokeLinecap="round"
          className={SUAVE}
          stroke={
            poco
              ? `rgb(${107 + limpieza * 110}, ${66 + limpieza * 120}, ${38 + limpieza * 90})`
              : dentro
                ? '#D9C7A3'
                : '#A79E8E'
          }
        />
      ))}

      <text x="24" y="36" className="fill-stone text-[12px]">
        {Math.round(valor)} h en agua
      </text>
      <text
        x="296"
        y="36"
        textAnchor="end"
        className={`text-[12px] font-semibold ${dentro ? 'fill-penca' : 'fill-stone'}`}
      >
        {poco ? 'Pulpa residual' : dentro ? 'Cabuya clara' : 'Sin ganancia'}
      </text>
    </svg>
  );
}

const ILUSTRACIONES: Record<IlustracionId, (props: IlustracionProps) => React.ReactElement> = {
  cogollo: Cogollo,
  rendimiento: Rendimiento,
  varillado: Varillado,
  remojo: Remojo,
};

export default function Ilustracion({
  ilustracion,
  ...props
}: IlustracionProps & { ilustracion: IlustracionId }) {
  const Componente = ILUSTRACIONES[ilustracion];
  return <Componente {...props} />;
}
