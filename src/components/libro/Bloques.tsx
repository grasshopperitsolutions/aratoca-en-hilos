import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Actividad from './Actividad';
import Reveal from '../Reveal';
import { FOTO_SRC, FOTO_TAMANO } from '../../content/libro/estructura';
import type { Bloque, FotoId } from '../../types/libro';

/**
 * Renders the book's editorial furniture.
 *
 * Each block maps to the component the printed edition uses for it — entradilla,
 * capitular, caja, cita, dato, paso, lámina — so the two editions stay legibly
 * the same work. Everything here is ordinary semantic HTML: this is the surface
 * crawlers and screen readers get, and it prerenders without JavaScript.
 */

/* ------------------------------------------------------------------ */

export function Foto({
  foto,
  titulo,
  pie,
  prioridad = false,
  className = '',
}: {
  foto: FotoId;
  titulo: string;
  pie: string;
  prioridad?: boolean;
  className?: string;
}) {
  const { ancho, alto } = FOTO_TAMANO[foto];

  return (
    <Reveal>
      <figure className={`my-10 ${className}`}>
        <img
          src={FOTO_SRC[foto]}
          alt={pie}
          width={ancho}
          height={alto}
          loading={prioridad ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-auto rounded-tl-3xl rounded-br-3xl object-cover"
        />
        <figcaption className="mt-4">
          <span className="block font-fraunces text-lg text-earth">{titulo}</span>
          <span className="block text-stone text-sm font-light mt-1 leading-relaxed">{pie}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* The six phases, stepped through rather than listed                   */
/* ------------------------------------------------------------------ */

function Fases({ items }: { items: readonly { titulo: string; texto: string }[] }) {
  const [activa, setActiva] = useState(0);
  const { t } = useTranslation();

  return (
    <Reveal>
      <section
        className="my-12 rounded-tl-3xl rounded-br-3xl border border-stone/25 bg-cream p-6 md:p-8"
        aria-label={t('libro.fases')}
      >
        <ol className="flex flex-wrap gap-2" role="tablist">
          {items.map((fase, indice) => {
            const seleccionada = indice === activa;
            return (
              <li key={fase.titulo}>
                <button
                  role="tab"
                  aria-selected={seleccionada}
                  onClick={() => setActiva(indice)}
                  className={`w-11 h-11 rounded-full font-fraunces text-lg transition-all duration-300 ${
                    seleccionada
                      ? 'bg-terracotta text-cream scale-110'
                      : 'bg-moss/25 text-charcoal hover:bg-moss/45'
                  }`}
                >
                  {indice + 1}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 min-h-32">
          <h4 className="font-fraunces text-xl md:text-2xl text-charcoal">
            {items[activa].titulo}
          </h4>
          <p className="text-charcoal/75 font-light leading-relaxed mt-3 text-justify hyphens-auto">
            {items[activa].texto}
          </p>
        </div>
      </section>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* A century on a draggable year                                        */
/* ------------------------------------------------------------------ */

function LineaTiempo({
  hitos,
}: {
  hitos: readonly { anio: number; titulo: string; texto: string }[];
}) {
  const id = useId();
  const { t } = useTranslation();
  const [anio, setAnio] = useState(hitos[0].anio);

  const min = hitos[0].anio;
  const max = hitos[hitos.length - 1].anio;

  // The milestone in force at this year: the last one already reached.
  let indice = 0;
  for (let i = 0; i < hitos.length; i += 1) if (anio >= hitos[i].anio) indice = i;
  const hito = hitos[indice];

  return (
    <Reveal>
      <section
        className="my-12 rounded-tl-3xl rounded-br-3xl border border-stone/25 bg-moss/10 p-6 md:p-8"
        aria-label={t('libro.lineaTiempo')}
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-fraunces text-3xl md:text-4xl text-terracotta">{anio}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-stone">
            {t('libro.lineaTiempo')}
          </span>
        </div>

        <label htmlFor={id} className="sr-only">
          {t('libro.lineaTiempo')}
        </label>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={anio}
          onChange={(evento) => setAnio(Number(evento.target.value))}
          className="w-full mt-4 accent-terracotta"
        />

        {/* Milestone ticks, so the shape of the century is visible at a glance. */}
        <div className="relative h-5 mt-1" aria-hidden="true">
          {hitos.map((marca) => (
            <span
              key={marca.anio}
              className={`absolute -translate-x-1/2 text-[11px] transition-colors duration-300 ${
                marca.anio === hito.anio ? 'text-terracotta font-bold' : 'text-stone'
              }`}
              style={{ left: `${((marca.anio - min) / (max - min)) * 100}%` }}
            >
              {marca.anio}
            </span>
          ))}
        </div>

        <div className="mt-6 min-h-36" aria-live="polite">
          <h4 className="font-fraunces text-xl md:text-2xl text-charcoal">{hito.titulo}</h4>
          <p className="text-charcoal/75 font-light leading-relaxed mt-3 text-justify hyphens-auto">
            {hito.texto}
          </p>
        </div>
      </section>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */

function BloqueUno({ bloque, primero }: { bloque: Bloque; primero: boolean }) {
  switch (bloque.tipo) {
    case 'entradilla':
      return (
        <Reveal>
          <p className="text-lg md:text-xl text-charcoal/85 leading-relaxed font-light border-l-2 border-fique pl-6 my-8 text-justify hyphens-auto">
            {bloque.texto}
          </p>
        </Reveal>
      );

    case 'parrafo':
      return (
        <Reveal>
          <p
            className={`text-charcoal/80 leading-relaxed font-light mb-6 text-justify hyphens-auto ${
              bloque.capitular
                ? 'first-letter:font-fraunces first-letter:text-6xl first-letter:font-bold first-letter:text-earth first-letter:float-left first-letter:leading-[0.85] first-letter:mr-3 first-letter:mt-1'
                : ''
            }`}
          >
            {bloque.texto}
          </p>
        </Reveal>
      );

    case 'subtitulo':
      return (
        <Reveal>
          <h3
            className={`font-fraunces text-2xl md:text-3xl text-earth ${primero ? 'mt-0' : 'mt-12'} mb-5`}
          >
            {bloque.texto}
          </h3>
        </Reveal>
      );

    case 'caja':
      return (
        <Reveal>
          <aside className="my-10 rounded-tl-3xl rounded-br-3xl bg-fique/25 border border-fique p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-earth mb-4">
              {bloque.rotulo}
            </p>
            {bloque.parrafos.map((parrafo) => (
              <p
                key={parrafo.slice(0, 40)}
                className="text-charcoal/80 font-light leading-relaxed mb-3 last:mb-0 text-justify hyphens-auto"
              >
                {parrafo}
              </p>
            ))}
          </aside>
        </Reveal>
      );

    case 'cita':
      return (
        <Reveal>
          <blockquote className="my-12 border-l-4 border-terracotta pl-6 md:pl-8">
            <p className="font-fraunces text-2xl md:text-3xl text-charcoal leading-snug">
              {bloque.texto}
            </p>
            <cite className="block not-italic text-xs font-bold uppercase tracking-widest text-stone mt-4">
              {bloque.fuente}
            </cite>
          </blockquote>
        </Reveal>
      );

    case 'datos':
      return (
        <Reveal>
          {/* A container query, not a viewport one: these cards sit in a
              full-width column on a chapter page and in a half-width reader
              page at the same viewport, and the figure has to fit both. */}
          <div className="@container my-10">
            <dl className="grid grid-cols-1 @xs:grid-cols-3 gap-4 @md:gap-6">
              {bloque.items.map((dato) => (
                <div
                  key={dato.cifra}
                  className="rounded-tl-3xl rounded-br-3xl bg-earth text-cream px-4 py-5 @md:px-6 @md:py-6 text-center"
                >
                  <dt className="font-fraunces text-2xl @md:text-3xl @lg:text-4xl leading-none tracking-tight break-words">
                    {dato.cifra}
                  </dt>
                  <dd className="text-cream/75 text-xs @md:text-sm font-light mt-2 leading-snug text-balance">
                    {dato.leyenda}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      );

    case 'lista':
      return (
        <Reveal>
          <dl className="my-8 space-y-5">
            {bloque.items.map((item) => (
              <div key={item.titulo} className="border-t border-stone/30 pt-4">
                <dt className="font-fraunces text-lg text-charcoal">{item.titulo}</dt>
                <dd className="text-charcoal/75 font-light leading-relaxed mt-1 text-justify hyphens-auto">
                  {item.texto}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      );

    case 'fases':
      return <Fases items={bloque.items} />;

    case 'lineaTiempo':
      return <LineaTiempo hitos={bloque.hitos} />;

    case 'foto':
      return <Foto foto={bloque.foto} titulo={bloque.titulo} pie={bloque.pie} />;

    case 'actividad':
      return <Actividad id={bloque.id} />;
  }
}

/** Renders a chapter's blocks in order. */
export default function Bloques({ bloques }: { bloques: readonly Bloque[] }) {
  return (
    <>
      {bloques.map((bloque, indice) => (
        <BloqueUno
          key={`${bloque.tipo}-${indice}`}
          bloque={bloque}
          primero={indice === 0}
        />
      ))}
    </>
  );
}
