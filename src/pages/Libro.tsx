import { Suspense, lazy, useState, useSyncExternalStore } from 'react';
import { BookOpen } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Button from '../components/Button';
import Bloques, { Foto } from '../components/libro/Bloques';
import DescargarPdf from '../components/libro/DescargarPdf';
import Reveal from '../components/Reveal';
import { libroTexto } from '../content/libro';
import { ESCUDOS, capitulosDeParte } from '../content/libro/estructura';
import { useLanguage } from '../i18n/languageContext';
import { buildPath, pageKeyDeCapitulo } from '../i18n/routes';
import { LIBRO_CAPITULOS, LIBRO_PARTES, type LibroCapitulo } from '../types/libro';

/**
 * The book's front door: cover, foreword and contents.
 *
 * Everything here is prerendered and stays in the static HTML. The reader opens
 * over it on request; until then — and for anyone without JavaScript — this is a
 * complete, navigable table of contents rather than an empty frame.
 */
const Reader = lazy(() => import('../components/libro/Reader'));

/**
 * False on the server and through the hydration pass, true afterwards.
 *
 * The prerendered HTML carries no query string, so deciding whether to open the
 * reader from `?c=` during the first client render would build a tree the server
 * never sent, and React would tear it down with a hydration error.
 */
const suscribirNada = () => () => {};
function useHidratado(): boolean {
  return useSyncExternalStore(
    suscribirNada,
    () => true,
    () => false,
  );
}

export default function Libro() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const libro = libroTexto(language);
  const rutaCapitulo = (numero: LibroCapitulo) =>
    buildPath(pageKeyDeCapitulo(numero), language);

  const solicitado = Number(searchParams.get('c'));
  const capituloInicial = (LIBRO_CAPITULOS as readonly number[]).includes(solicitado)
    ? (solicitado as LibroCapitulo)
    : null;

  const hidratado = useHidratado();
  const [abiertoManual, setAbiertoManual] = useState(false);
  const lectorAbierto = abiertoManual || (hidratado && capituloInicial !== null);

  function cerrarLector() {
    setAbiertoManual(false);
    if (searchParams.has('c')) {
      searchParams.delete('c');
      setSearchParams(searchParams, { replace: true });
    }
  }

  return (
    <>
      {/* Portada. Fique beige rather than charcoal: the fixed header's links are
          text-charcoal until the visitor scrolls, so a dark band here would
          render the whole navigation invisible on arrival. */}
      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-20 bg-fique">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <BookOpen size={32} className="mx-auto text-earth mb-8" aria-hidden="true" />
          </Reveal>
          <Reveal delay={100}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-earth/80">
              {libro.editor}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-fraunces font-bold text-charcoal leading-[1.1] mt-6">
              {libro.titulo}
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="text-charcoal/75 text-lg md:text-xl font-light max-w-2xl mx-auto mt-6">
              {libro.subtitulo}
            </p>
          </Reveal>
          <Reveal delay={400}>
            <p className="text-charcoal/55 text-xs uppercase tracking-widest mt-10">
              {libro.lugar} · {libro.edicion}
            </p>
          </Reveal>
          <Reveal delay={500}>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button onClick={() => setAbiertoManual(true)} variant="secondary">
                <BookOpen size={16} />
                {t('libro.abrir')}
              </Button>
              <DescargarPdf variant="outline" />
            </div>
          </Reveal>
          <Reveal delay={600}>
            <div className="flex items-center justify-center gap-5 mt-12">
              <img src={ESCUDOS.aratoca} alt="" className="h-12 w-auto" />
              <span className="w-px h-10 bg-charcoal/20" />
              <img src={ESCUDOS.ministerio} alt="" className="h-11 w-auto" />
            </div>
          </Reveal>
        </div>
      </header>

      {/* Presentación */}
      <section className="px-6 md:px-12 py-20 md:py-24 bg-cream">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-penca">
              {libro.presentacion.ordinal}
            </p>
            <h2 className="font-fraunces text-3xl md:text-4xl text-charcoal mt-2 mb-8">
              {libro.presentacion.titulo}
            </h2>
          </Reveal>
          <Bloques bloques={libro.presentacion.bloques} />
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-stone mt-8">
              {libro.presentacion.firma}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Lámina del territorio */}
      <section className="px-6 md:px-12 pb-4 bg-cream">
        <div className="max-w-4xl mx-auto">
          <Foto
            foto={libro.laminas.territorio.foto}
            titulo={libro.laminas.territorio.titulo}
            pie={libro.laminas.territorio.pie}
            prioridad
          />
        </div>
      </section>

      {/* Índice */}
      <section className="px-6 md:px-12 py-20 md:py-28 bg-moss/10">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="font-fraunces text-3xl md:text-4xl text-charcoal text-center mb-16">
              {t('libro.indice')}
            </h2>
          </Reveal>

          <div className="space-y-16">
            {LIBRO_PARTES.map((numeroParte) => {
              const parte = libro.partes[numeroParte];
              return (
                <div key={numeroParte}>
                  <Reveal>
                    <div className="mb-8">
                      <p className="text-xs font-bold uppercase tracking-widest text-penca">
                        {t('libro.parte', { numero: numeroParte })}
                      </p>
                      <h3 className="font-fraunces text-2xl md:text-3xl text-earth mt-2">
                        {parte.titulo}
                      </h3>
                      <p className="text-stone font-light mt-1">{parte.subtitulo}</p>
                    </div>
                  </Reveal>

                  <ol className="space-y-3">
                    {capitulosDeParte(numeroParte).map((numero, index) => (
                      <Reveal key={numero} delay={(index % 3) * 120}>
                        <li>
                          <Link
                            to={rutaCapitulo(numero)}
                            className="group flex items-baseline gap-5 bg-cream border border-stone/20 rounded-tl-3xl rounded-br-3xl px-6 py-5 hover:border-stone hover:shadow-lg transition-all duration-500"
                          >
                            <span
                              className="font-fraunces text-2xl text-fique shrink-0"
                              aria-hidden="true"
                            >
                              {String(numero).padStart(2, '0')}
                            </span>
                            <span className="font-fraunces text-lg md:text-xl text-charcoal group-hover:text-terracotta transition-colors">
                              {libro.capitulos[numero].titulo}
                            </span>
                          </Link>
                        </li>
                      </Reveal>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {lectorAbierto && (
        <Suspense fallback={null}>
          <Reader capituloInicial={capituloInicial} onClose={cerrarLector} />
        </Suspense>
      )}
    </>
  );
}
