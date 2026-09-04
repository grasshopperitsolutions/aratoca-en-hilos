import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AssetFigure from '../components/libro/AssetFigure';
import { BloquesDeCapitulo } from '../components/libro/Bloques';
import Callouts from '../components/libro/Callouts';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import { libroTexto } from '../content/libro';
import { CAPITULOS } from '../content/libro/estructura';
import { useLanguage } from '../i18n/languageContext';
import { buildPath, pageKeyDeCapitulo } from '../i18n/routes';
import { LIBRO_CAPITULOS, type LibroCapitulo as Numero } from '../types/libro';

/**
 * One chapter of "Trenzando Saberes", as a readable article.
 *
 * This is the crawler-facing half of the book: fully prerendered, semantic, and
 * useful on its own. The 3D reader at `/libro` is the experience; these pages
 * are what Google, the AI crawlers, screen readers and anyone on a slow phone
 * actually get, and what a person links to when they share a chapter.
 */
export default function LibroCapitulo({ numero }: { numero: Numero }) {
  const { t } = useTranslation();
  const { language, path } = useLanguage();

  const libro = libroTexto(language);
  const meta = CAPITULOS[numero];
  const capitulo = libro.capitulos[numero];
  const parte = libro.partes[meta.parte];

  const [hero, ...restoAssets] = meta.assets;
  const [lead, ...restoParrafos] = capitulo.parrafos;

  const anterior = numero > 1 ? ((numero - 1) as Numero) : null;
  const siguiente = numero < LIBRO_CAPITULOS.length ? ((numero + 1) as Numero) : null;

  const chapterPath = (n: Numero) => buildPath(pageKeyDeCapitulo(n), language);

  return (
    <>
      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-12 bg-moss/10">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <Link
              to={path('libro')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-penca hover:text-terracotta transition-colors"
            >
              <ArrowLeft size={14} />
              {libro.titulo}
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-xs font-bold uppercase tracking-widest text-stone mt-8">
              {t('libro.parteCapitulo', {
                parte: meta.parte,
                capitulo: numero,
                titulo: parte.titulo,
              })}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-fraunces font-bold text-charcoal leading-[1.1] mt-4">
              {capitulo.titulo}
            </h1>
          </Reveal>
        </div>
      </header>

      <article className="px-6 md:px-12 py-12 md:py-16 bg-cream">
        <div className="max-w-3xl mx-auto">
          {lead && (
            <Reveal>
              <p className="text-lg md:text-xl text-charcoal/80 leading-relaxed font-light border-l-2 border-fique pl-6">
                {lead}
              </p>
            </Reveal>
          )}

          {hero && <AssetFigure tag={hero} priority />}

          {restoParrafos.map((parrafo) => (
            <Reveal key={parrafo.slice(0, 48)}>
              <p className="text-charcoal/70 leading-relaxed font-light mb-6">{parrafo}</p>
            </Reveal>
          ))}

          <Callouts callouts={capitulo.callouts} language={language} />

          <BloquesDeCapitulo bloques={meta.bloques} />

          {restoAssets.map((tag) => (
            <AssetFigure key={tag} tag={tag} />
          ))}
        </div>
      </article>

      {/* Into the reader, from the chapter the visitor is already in. */}
      <section className="px-6 md:px-12 pb-16">
        <div className="max-w-3xl mx-auto">
          <Reveal direction="up">
            <div className="rounded-tl-3xl rounded-br-3xl bg-penca p-10 md:p-12 text-center">
              <BookOpen size={28} className="mx-auto text-cream/80 mb-4" aria-hidden="true" />
              <h2 className="text-2xl md:text-3xl font-fraunces text-cream mb-6">
                {t('libro.leerInteractivoTitulo')}
              </h2>
              <Button to={`${path('libro')}?c=${numero}`} variant="primary">
                {t('libro.leerInteractivo')}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Chapter-to-chapter navigation. */}
      <nav
        className="px-6 md:px-12 pb-24"
        aria-label={t('libro.navegacionCapitulos')}
      >
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {anterior ? (
            <Link
              to={chapterPath(anterior)}
              className="group border border-stone/30 rounded-tl-3xl rounded-br-3xl p-6 hover:border-stone transition-colors"
            >
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone mb-2">
                <ArrowLeft size={14} />
                {t('libro.anterior')}
              </span>
              <span className="font-fraunces text-lg text-charcoal group-hover:text-terracotta transition-colors">
                {libro.capitulos[anterior].titulo}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {siguiente && (
            <Link
              to={chapterPath(siguiente)}
              className="group border border-stone/30 rounded-tl-3xl rounded-br-3xl p-6 hover:border-stone transition-colors sm:text-right"
            >
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone mb-2 sm:justify-end">
                {t('libro.siguiente')}
                <ArrowRight size={14} />
              </span>
              <span className="font-fraunces text-lg text-charcoal group-hover:text-terracotta transition-colors">
                {libro.capitulos[siguiente].titulo}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
