import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Bloques from '../components/libro/Bloques';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import { libroTexto } from '../content/libro';
import { PARTE_DE_CAPITULO } from '../content/libro/estructura';
import { useLanguage } from '../i18n/languageContext';
import { buildPath, pageKeyDeCapitulo } from '../i18n/routes';
import { LIBRO_CAPITULOS, type LibroCapitulo as Numero } from '../types/libro';

/**
 * One chapter of "Trenzando Saberes", as a readable article.
 *
 * This is the indexable surface of the book: fully prerendered, semantic, and
 * worth reading on its own. The activities render here too — they are ordinary
 * form controls, and an unanswered one is identical on the server and on the
 * first client render, so nothing about them costs determinism. Saved answers
 * arrive a render later, from `useProgresoLibro`.
 */
export default function LibroCapitulo({ numero }: { numero: Numero }) {
  const { t } = useTranslation();
  const { language, path } = useLanguage();

  const libro = libroTexto(language);
  const capitulo = libro.capitulos[numero];
  const numeroParte = PARTE_DE_CAPITULO[numero];
  const parte = libro.partes[numeroParte];

  const anterior = numero > 1 ? ((numero - 1) as Numero) : null;
  const siguiente = numero < LIBRO_CAPITULOS.length ? ((numero + 1) as Numero) : null;

  const rutaCapitulo = (n: Numero) => buildPath(pageKeyDeCapitulo(n), language);

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
              {t('libro.parte', { numero: numeroParte })} · {parte.titulo} — {capitulo.ordinal}
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
          <Bloques bloques={capitulo.bloques} />
        </div>
      </article>

      {/* Into the reader, at the chapter the visitor is already in. */}
      <section className="px-6 md:px-12 pb-16">
        <div className="max-w-3xl mx-auto">
          <Reveal direction="up">
            <div className="rounded-tl-3xl rounded-br-3xl bg-penca p-10 md:p-12 text-center">
              <BookOpen size={28} className="mx-auto text-cream/80 mb-4" aria-hidden="true" />
              <h2 className="text-2xl md:text-3xl font-fraunces text-cream mb-6">
                {t('libro.abrir')}
              </h2>
              <Button to={`${path('libro')}?c=${numero}`} variant="primary">
                {t('libro.abrir')}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <nav className="px-6 md:px-12 pb-24" aria-label={t('libro.navegacionCapitulos')}>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {anterior ? (
            <Link
              to={rutaCapitulo(anterior)}
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
              to={rutaCapitulo(siguiente)}
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
