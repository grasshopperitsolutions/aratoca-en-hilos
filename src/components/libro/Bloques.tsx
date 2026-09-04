import { DiagramaBioeconomia, DiagramaFurcraea } from './Diagramas';
import Reveal from '../Reveal';
import { libroTexto } from '../../content/libro';
import { useLanguage } from '../../i18n/languageContext';
import type { BloqueKind } from '../../types/libro';

/**
 * The book's non-prose blocks.
 *
 * Each renders real semantic HTML — lists, definition lists, headings — rather
 * than a styled div soup, because these pages are the crawler-facing surface of
 * the book and their structure is the point.
 */

/** Chapter 2's national figures. */
export function DatosClave() {
  const { language } = useLanguage();
  const { datosClave } = libroTexto(language);

  return (
    <Reveal>
      <aside className="my-12 rounded-tl-3xl rounded-br-3xl bg-moss/15 border border-stone/20 p-8 md:p-10">
        <h3 className="font-fraunces text-2xl text-earth mb-6">{datosClave.titulo}</h3>
        <ul className="space-y-3">
          {datosClave.items.map((item) => (
            <li key={item} className="flex gap-3 text-charcoal/80 font-light leading-relaxed">
              <span className="text-penca shrink-0" aria-hidden="true">
                —
              </span>
              {item}
            </li>
          ))}
        </ul>
      </aside>
    </Reveal>
  );
}

/** Chapter 5's seven steps. */
export function SietePasos() {
  const { language } = useLanguage();
  const { pasos } = libroTexto(language);

  return (
    <section className="my-12" aria-labelledby="siete-pasos">
      <Reveal>
        <h3 id="siete-pasos" className="font-fraunces text-2xl md:text-3xl text-earth mb-3">
          {pasos.titulo}
        </h3>
        <p className="text-charcoal/70 font-light leading-relaxed mb-10">{pasos.intro}</p>
      </Reveal>

      <ol className="space-y-8">
        {pasos.items.map((paso, index) => (
          <Reveal key={paso.numero} delay={(index % 3) * 120}>
            <li className="flex gap-6 items-start">
              <span
                className="font-fraunces text-3xl md:text-4xl text-fique shrink-0 leading-none w-14 text-right"
                aria-hidden="true"
              >
                {String(paso.numero).padStart(2, '0')}
              </span>
              <div className="border-l-2 border-fique pl-6">
                <h4 className="font-fraunces text-xl text-charcoal mb-2">{paso.titulo}</h4>
                <p className="text-charcoal/70 font-light leading-relaxed">{paso.texto}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/** Chapter 7's three-hour session structure. */
export function Sesion3h() {
  const { language } = useLanguage();
  const { sesion } = libroTexto(language);

  return (
    <section className="my-12" aria-labelledby="sesion-tipo">
      <Reveal>
        <h3 id="sesion-tipo" className="font-fraunces text-2xl md:text-3xl text-earth mb-3">
          {sesion.titulo}
        </h3>
        <p className="text-charcoal/70 font-light leading-relaxed mb-8">{sesion.intro}</p>
      </Reveal>

      <ol className="space-y-4">
        {sesion.items.map((fase, index) => (
          <Reveal key={fase.titulo} delay={(index % 3) * 120}>
            <li className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border-t border-stone/30 pt-4">
              <span className="text-penca text-xs font-bold uppercase tracking-widest shrink-0 sm:w-28">
                {fase.duracion}
              </span>
              <div>
                <h4 className="font-fraunces text-lg text-charcoal">{fase.titulo}</h4>
                <p className="text-charcoal/70 font-light leading-relaxed mt-1">{fase.texto}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/**
 * Chapter 7's seven-module curriculum.
 *
 * Restored from version 1 of the manuscript: version 2 refers to "siete
 * módulos" but only ever enumerates the three digital ones below.
 */
export function Modulos7() {
  const { language } = useLanguage();
  const { modulos } = libroTexto(language);

  return (
    <section className="my-12" aria-labelledby="modulos-taller">
      <Reveal>
        <h3 id="modulos-taller" className="font-fraunces text-2xl md:text-3xl text-earth mb-3">
          {modulos.titulo}
        </h3>
        <p className="text-charcoal/70 font-light leading-relaxed mb-8">{modulos.intro}</p>
      </Reveal>

      <ol className="space-y-4">
        {modulos.items.map((modulo, index) => (
          <Reveal key={modulo.titulo} delay={(index % 3) * 120}>
            <li className="flex gap-5 items-start border-t border-stone/30 pt-4">
              <span
                className="font-fraunces text-2xl text-fique shrink-0 leading-none w-8 text-right"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div>
                <h4 className="font-fraunces text-lg text-charcoal">{modulo.titulo}</h4>
                <p className="text-charcoal/70 font-light leading-relaxed mt-1">{modulo.texto}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/** Chapter 7's three digital-platform modules. */
export function ModulosWeb() {
  const { language } = useLanguage();
  const { modulosWeb } = libroTexto(language);

  return (
    <section className="my-12" aria-labelledby="modulos-web">
      <Reveal>
        <h3 id="modulos-web" className="font-fraunces text-2xl md:text-3xl text-earth mb-3">
          {modulosWeb.titulo}
        </h3>
        <p className="text-charcoal/70 font-light leading-relaxed mb-8">{modulosWeb.intro}</p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modulosWeb.items.map((modulo, index) => (
          <Reveal key={modulo.titulo} delay={(index % 3) * 150}>
            <article className="h-full rounded-tl-3xl rounded-br-3xl bg-cream border border-stone/20 p-8 hover:shadow-xl transition-shadow duration-500">
              <h4 className="font-fraunces text-xl text-charcoal mb-3">{modulo.titulo}</h4>
              <p className="text-charcoal/70 font-light leading-relaxed">{modulo.texto}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Renders whichever blocks a chapter declares, in the order it declares them. */
export function BloquesDeCapitulo({ bloques }: { bloques: readonly BloqueKind[] }) {
  return (
    <>
      {bloques.map((bloque) => {
        switch (bloque) {
          case 'datosClave':
            return <DatosClave key={bloque} />;
          case 'sietePasos':
            return <SietePasos key={bloque} />;
          case 'modulos7':
            return <Modulos7 key={bloque} />;
          case 'sesion3h':
            return <Sesion3h key={bloque} />;
          case 'modulosWeb':
            return <ModulosWeb key={bloque} />;
          case 'diagramaFurcraea':
            return <DiagramaFurcraea key={bloque} />;
          case 'diagramaBioeconomia':
            return <DiagramaBioeconomia key={bloque} />;
        }
      })}
    </>
  );
}
