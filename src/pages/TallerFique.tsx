import {
  BookOpen,
  ChevronDown,
  Coins,
  Landmark,
  Palette,
  Recycle,
  Scissors,
  Sprout,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Foto } from '../components/libro/Bloques';
import Button from '../components/Button';
import DescargarPdf from '../components/libro/DescargarPdf';
import IconCircle from '../components/IconCircle';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { FAQ_IDS } from '../content/faq';
import { libroTexto } from '../content/libro';
import { capitulosDeParte } from '../content/libro/estructura';
import { useLanguage } from '../i18n/languageContext';
import { buildPath, pageKeyDeCapitulo } from '../i18n/routes';
import { LIBRO_PARTES, type LibroCapitulo } from '../types/libro';

/**
 * Icon and accent colour per chapter of the book.
 *
 * Raw hex is the documented exception to the design-system rule: `IconCircle`
 * takes a CSS colour string, not a Tailwind class. Values are the theme tokens
 * from index.css.
 */
const CHAPTER_ICONS: Record<LibroCapitulo, { icon: LucideIcon; color: string }> = {
  1: { icon: Landmark, color: '#6B4226' },
  2: { icon: Coins, color: '#A79E8E' },
  3: { icon: Sprout, color: '#4C7A3D' },
  4: { icon: Recycle, color: '#8FA878' },
  5: { icon: Scissors, color: '#B85C38' },
  6: { icon: Palette, color: '#6B4226' },
};

/**
 * Taller Fique — the presentation page for the book.
 *
 * This is the front door: it introduces "Trenzando Saberes", shows what is in
 * it, and hands the visitor to the reader at /libro or to any single chapter.
 * The book's own text is the source for every title here, so this page cannot
 * drift out of step with the publication it advertises.
 */
export default function TallerFique() {
  const { t } = useTranslation();
  const { language, path } = useLanguage();

  const libro = libroTexto(language);

  // The six phases are part of chapter 4, not a separate list: reading them
  // from the chapter is what stops this page drifting from the book.
  const fases =
    libro.capitulos[4].bloques.find((bloque) => bloque.tipo === 'fases')?.items ?? [];
  const chapterPath = (numero: LibroCapitulo) =>
    buildPath(pageKeyDeCapitulo(numero), language);

  return (
    <>
      <PageHeader
        accent={t('tallerFique.accent')}
        title={t('tallerFique.title')}
        intro={t('tallerFique.intro')}
      />

      {/* El libro: portada, panorama y accesos */}
      <section className="px-6 md:px-12 py-16 md:py-20 bg-cream">
        <div className="max-w-4xl mx-auto">
          <Foto
            foto={libro.laminas.territorio.foto}
            titulo={libro.laminas.territorio.titulo}
            pie={libro.laminas.territorio.pie}
            prioridad
            className="!mt-0"
          />

          <Reveal>
            <div className="text-center mt-4">
              <h2 className="font-fraunces text-3xl md:text-4xl text-charcoal">
                {libro.titulo}
              </h2>
              <p className="text-charcoal/70 font-light text-lg mt-3 max-w-2xl mx-auto">
                {libro.subtitulo}
              </p>
              <p className="text-stone text-xs uppercase tracking-widest mt-4">
                {libro.editor}
              </p>

              {/* Three ways in, by decreasing commitment: the chapter-by-chapter
                  reader, the reader opened straight onto page one, and the PDF.
                  `?c=1` is the same entry the chapter pages use. */}
              <div className="flex flex-wrap gap-4 justify-center mt-10">
                <Button to={path('libro')} variant="primary">
                  {t('tallerFique.abrirLibro')}
                </Button>
                <Button to={`${path('libro')}?c=1`} variant="secondary">
                  <BookOpen size={16} />
                  {t('libro.abrir')}
                </Button>
                <DescargarPdf />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capítulos, agrupados por parte */}
      <section className="px-6 md:px-12 py-20 md:py-28 bg-moss/10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-fraunces text-charcoal text-center">
              {t('tallerFique.chaptersTitle')}
            </h2>
            <p className="text-charcoal/70 font-light text-center max-w-2xl mx-auto mt-4 mb-16">
              {t('tallerFique.chaptersIntro')}
            </p>
          </Reveal>

          <div className="space-y-14">
            {LIBRO_PARTES.map((numeroParte) => {
              const parte = libro.partes[numeroParte];
              return (
                <div key={numeroParte}>
                  <Reveal>
                    <div className="flex items-baseline gap-4 mb-8">
                      <span className="text-xs font-bold uppercase tracking-widest text-penca shrink-0">
                        {t('libro.parte', { numero: numeroParte })}
                      </span>
                      <h3 className="font-fraunces text-2xl text-earth">{parte.titulo}</h3>
                    </div>
                  </Reveal>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {capitulosDeParte(numeroParte).map((numero, index) => {
                      const { icon, color } = CHAPTER_ICONS[numero];
                      return (
                        <Reveal key={numero} delay={(index % 3) * 150}>
                          <Link
                            to={chapterPath(numero)}
                            className="group block bg-cream rounded-tl-3xl rounded-br-3xl p-8 h-full border border-stone/20 hover:shadow-xl transition-shadow duration-500"
                          >
                            <div className="mb-6">
                              <IconCircle icon={icon} color={color} />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-stone mb-2">
                              {t('libro.parte', { numero: numeroParte })} ·{' '}
                              {String(numero).padStart(2, '0')}
                            </p>
                            <h4 className="text-xl font-fraunces text-charcoal group-hover:text-terracotta transition-colors">
                              {libro.capitulos[numero].titulo}
                            </h4>
                          </Link>
                        </Reveal>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Las seis fases del proceso */}
      <section className="px-6 md:px-12 py-20 md:py-28 bg-cream">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-fraunces text-charcoal text-center">
              {t('libro.fases')}
            </h2>
            <p className="text-charcoal/70 font-light text-center max-w-2xl mx-auto mt-4 mb-16">
              {t('tallerFique.fasesIntro')}
            </p>
          </Reveal>

          <ol className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {fases.map((fase, index) => (
              <Reveal key={fase.titulo} delay={(index % 3) * 120}>
                <li className="h-full border-t-2 border-fique pt-4">
                  <span
                    className="block font-fraunces text-3xl text-fique leading-none"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-fraunces text-base text-charcoal mt-3">{fase.titulo}</h3>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <div className="text-center mt-14">
              <Button to={chapterPath(4)} variant="outline">
                {t('tallerFique.verPasos')}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Preguntas frecuentes — <details> mantiene las respuestas en el DOM
          para los rastreadores aunque estén plegadas, y no necesita JS. */}
      <section className="px-6 md:px-12 py-20 md:py-28 bg-cream">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-fraunces text-charcoal text-center mb-16">
              {t('tallerFique.faqTitle')}
            </h2>
          </Reveal>

          <div className="space-y-4">
            {FAQ_IDS.map((id) => (
              <Reveal key={id}>
                <details className="group border-t border-stone/30 pt-4">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-lg font-fraunces text-charcoal hover:text-terracotta transition-colors">
                    {t(`tallerFique.faq.${id}.question`)}
                    <ChevronDown
                      size={20}
                      className="shrink-0 text-stone transition-transform duration-300 group-open:rotate-180"
                    />
                  </summary>
                  <p className="text-charcoal/70 leading-relaxed font-light mt-4 pb-2">
                    {t(`tallerFique.faq.${id}.answer`)}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <Reveal direction="up">
            <div className="bg-charcoal rounded-br-[5rem] rounded-tl-[5rem] p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-fraunces text-fique mb-4">
                {t('tallerFique.cta.title')}
              </h2>
              <p className="text-cream/80 text-lg mb-8 font-light max-w-xl mx-auto">
                {t('tallerFique.cta.text')}
              </p>
              <Button to={path('contacto')} variant="primary">
                {t('tallerFique.cta.button')}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
