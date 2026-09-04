import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Reveal from '../Reveal';
import { libroTexto } from '../../content/libro';
import { useLanguage } from '../../i18n/languageContext';

/**
 * The book's three diagrams, drawn as inline SVG.
 *
 * The manuscript briefs each of these as an illustration to be commissioned,
 * but they are information rather than photography — a botanical cross-section,
 * a mass-balance flow and a course map — so they are authored here instead.
 * That makes them real markup: indexable, theme-aware, sharp at any size, and
 * legible to a screen reader through <title>/<desc>. A commissioned raster
 * would be none of those things, and would cost the client money.
 *
 * Animation is CSS and React state only. Adding Motion here would pull an
 * animation runtime into the main bundle for every visitor, and these public
 * pages are static imports — the reader keeps Motion inside its own chunk.
 */

const TRAZO = 'transition-all duration-[900ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]';

/* ------------------------------------------------------------------ */
/* Chapter 3 — the Furcraea and its fifteen-year productive cycle       */
/* ------------------------------------------------------------------ */

/**
 * The plant's life cycle, driven by a year slider.
 *
 * This is the interactive treatment the client's catalogue assigns to
 * TAG_04: "el usuario desliza una barra de tiempo de 0 a 15 años y observa
 * cuándo y cómo se podan las hojas basales".
 */
export function DiagramaFurcraea() {
  const { t } = useTranslation();
  const [anio, setAnio] = useState(8);
  const id = useId();

  // Leaves fan out as the plant matures; the flower stalk only appears once the
  // plant reaches biological maturity, between years five and ten.
  const hojas = Math.min(18, 3 + Math.round(anio * 1.1));
  const escapo = anio >= 7;
  const cosechando = anio >= 4;

  return (
    <Reveal>
      <figure className="my-12 rounded-tl-3xl rounded-br-3xl border border-stone/25 bg-moss/10 p-8">
        <svg
          viewBox="0 0 420 320"
          role="img"
          aria-labelledby={`${id}-t ${id}-d`}
          className="w-full h-auto max-w-xl mx-auto"
        >
          <title id={`${id}-t`}>{t('libro.diagramas.furcraea.titulo')}</title>
          <desc id={`${id}-d`}>{t('libro.diagramas.furcraea.desc')}</desc>

          {/* Ground */}
          <line x1="40" y1="272" x2="380" y2="272" className="stroke-stone" strokeWidth="1.5" />

          {/* Flower stalk — the escapo, up to eight metres */}
          {escapo && (
            <g className={TRAZO}>
              <line
                x1="210"
                y1="268"
                x2="210"
                y2={Math.max(30, 150 - (anio - 7) * 14)}
                className="stroke-penca"
                strokeWidth="4"
              />
              <circle
                cx="210"
                cy={Math.max(30, 150 - (anio - 7) * 14)}
                r="9"
                className="fill-fique stroke-penca"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Leaves, fanning symmetrically from the crown */}
          {Array.from({ length: hojas }, (_, i) => {
            const mitad = Math.floor(hojas / 2);
            const lado = i < mitad ? -1 : 1;
            const rango = i < mitad ? i : i - mitad;
            const angulo = 12 + rango * (62 / Math.max(1, mitad));
            const largo = 60 + rango * 5;
            const basal = rango >= mitad - 2;

            const x2 = 210 + lado * Math.sin((angulo * Math.PI) / 180) * largo;
            const y2 = 268 - Math.cos((angulo * Math.PI) / 180) * largo;

            return (
              <line
                key={i}
                x1="210"
                y1="268"
                x2={x2}
                y2={y2}
                strokeWidth={basal ? 7 : 5}
                strokeLinecap="round"
                className={`${TRAZO} ${
                  basal && cosechando ? 'stroke-terracotta' : 'stroke-penca'
                }`}
                opacity={basal && cosechando ? 0.55 : 1}
              />
            );
          })}

          {/* The cogollo: the protected heart of the plant */}
          <circle cx="210" cy="268" r="13" className="fill-earth" />

          <text x="240" y="252" className="fill-charcoal text-[11px] font-semibold">
            {t('libro.diagramas.furcraea.cogollo')}
          </text>
          {cosechando && (
            <text x="40" y="300" className="fill-terracotta text-[11px] font-semibold">
              {t('libro.diagramas.furcraea.corte')}
            </text>
          )}
        </svg>

        <label className="block mt-8">
          <span className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-charcoal">
            {t('libro.diagramas.furcraea.anio', { numero: anio })}
            <span className="text-stone">
              {escapo
                ? t('libro.diagramas.furcraea.maduro')
                : t('libro.diagramas.furcraea.creciendo')}
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={15}
            value={anio}
            onChange={(event) => setAnio(Number(event.target.value))}
            className="w-full mt-3 accent-penca"
            aria-label={t('libro.diagramas.furcraea.control')}
          />
        </label>

        <figcaption className="text-stone text-sm mt-4 font-light italic">
          {t('libro.diagramas.furcraea.pie')}
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter 4 — where the mass of a fique leaf actually goes             */
/* ------------------------------------------------------------------ */

/** The 4% / 96% split, and what the circular economy does with the remainder. */
export function DiagramaBioeconomia() {
  const { t } = useTranslation();
  const id = useId();

  return (
    <Reveal>
      <figure className="my-12 rounded-tl-3xl rounded-br-3xl border border-stone/25 bg-cream p-8">
        <svg
          viewBox="0 0 460 300"
          role="img"
          aria-labelledby={`${id}-t ${id}-d`}
          className="w-full h-auto max-w-2xl mx-auto"
        >
          <title id={`${id}-t`}>{t('libro.diagramas.bioeconomia.titulo')}</title>
          <desc id={`${id}-d`}>{t('libro.diagramas.bioeconomia.desc')}</desc>

          {/* The harvested leaf */}
          <rect x="18" y="120" width="104" height="60" rx="10" className="fill-penca" />
          <text x="70" y="147" textAnchor="middle" className="fill-cream text-[12px] font-semibold">
            {t('libro.diagramas.bioeconomia.hoja')}
          </text>
          <text x="70" y="165" textAnchor="middle" className="fill-cream text-[11px]">
            100%
          </text>

          {/* Split */}
          <path d="M122 140 C 160 140, 165 70, 200 70" className="stroke-fique fill-none" strokeWidth="3" />
          <path d="M122 160 C 160 160, 165 230, 200 230" className="stroke-earth fill-none" strokeWidth="10" />

          {/* 4% — the usable fibre */}
          <rect x="200" y="44" width="112" height="52" rx="10" className="fill-fique" />
          <text x="256" y="66" textAnchor="middle" className="fill-charcoal text-[12px] font-semibold">
            {t('libro.diagramas.bioeconomia.fibra')}
          </text>
          <text x="256" y="84" textAnchor="middle" className="fill-charcoal text-[13px] font-bold">
            4%
          </text>

          <path d="M312 70 H 356" className="stroke-stone fill-none" strokeWidth="2" />
          <rect x="356" y="44" width="90" height="52" rx="10" className="fill-terracotta" />
          <text x="401" y="75" textAnchor="middle" className="fill-cream text-[11px] font-semibold">
            {t('libro.diagramas.bioeconomia.artesania')}
          </text>

          {/* 96% — the bagazo */}
          <rect x="200" y="204" width="112" height="52" rx="10" className="fill-earth" />
          <text x="256" y="226" textAnchor="middle" className="fill-cream text-[12px] font-semibold">
            {t('libro.diagramas.bioeconomia.bagazo')}
          </text>
          <text x="256" y="244" textAnchor="middle" className="fill-cream text-[13px] font-bold">
            96%
          </text>

          <path d="M312 230 H 356" className="stroke-stone fill-none" strokeWidth="2" />
          <rect x="356" y="204" width="90" height="52" rx="10" className="fill-moss" />
          <text x="401" y="228" textAnchor="middle" className="fill-charcoal text-[11px] font-semibold">
            {t('libro.diagramas.bioeconomia.abono')}
          </text>
          <text x="401" y="243" textAnchor="middle" className="fill-charcoal text-[10px]">
            {t('libro.diagramas.bioeconomia.biopesticida')}
          </text>

          {/* The loop back into the soil — what makes it circular */}
          <path
            d="M401 256 C 401 292, 70 292, 70 186"
            className="stroke-moss fill-none"
            strokeWidth="2"
            strokeDasharray="7 6"
          />
          <text x="236" y="288" textAnchor="middle" className="fill-moss text-[10px] font-semibold">
            {t('libro.diagramas.bioeconomia.ciclo')}
          </text>
        </svg>

        <figcaption className="text-stone text-sm mt-4 font-light italic">
          {t('libro.diagramas.bioeconomia.pie')}
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter 7 — the seven-module course, as a route                      */
/* ------------------------------------------------------------------ */

/** The curriculum drawn as a path, one node per module. */
export function MapaAprendizaje() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [activo, setActivo] = useState(0);
  const id = useId();

  const { modulos } = libroTexto(language);

  return (
    <Reveal>
      <figure className="my-12 rounded-tl-3xl rounded-br-3xl border border-stone/25 bg-moss/10 p-8">
        <svg
          viewBox="0 0 700 120"
          role="img"
          aria-labelledby={`${id}-t`}
          className="w-full h-auto"
        >
          <title id={`${id}-t`}>{t('libro.diagramas.ruta.titulo')}</title>

          <path
            d="M40 70 C 150 20, 250 110, 350 60 S 560 20, 660 70"
            className="stroke-fique fill-none"
            strokeWidth="3"
          />

          {modulos.items.map((modulo, i) => {
            const x = 40 + (i * 620) / (modulos.items.length - 1);
            const y = 70 + Math.sin(i * 1.1) * 18;
            const seleccionado = i === activo;

            return (
              <g
                key={modulo.titulo}
                onClick={() => setActivo(i)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={modulo.titulo}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') setActivo(i);
                }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={seleccionado ? 20 : 14}
                  className={`${TRAZO} ${seleccionado ? 'fill-terracotta' : 'fill-penca'}`}
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  className="fill-cream text-[13px] font-bold pointer-events-none"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-6 min-h-24">
          <h4 className="font-fraunces text-lg text-charcoal">
            {modulos.items[activo].titulo}
          </h4>
          <p className="text-charcoal/70 font-light leading-relaxed mt-2">
            {modulos.items[activo].texto}
          </p>
        </div>
      </figure>
    </Reveal>
  );
}
