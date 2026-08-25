import {
  BookOpen,
  ChevronDown,
  Layers,
  NotebookPen,
  Palette,
  Recycle,
  Scissors,
  Sprout,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Button from '../components/Button';
import IconCircle from '../components/IconCircle';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { FAQ_IDS } from '../content/faq';
import { useLanguage } from '../i18n/languageContext';

/** Chapter ids match the translation keys; icon and accent colour live here. */
const CHAPTERS: { id: string; icon: LucideIcon; color: string }[] = [
  { id: 'planta', icon: Sprout, color: '#4C7A3D' },
  { id: 'fibra', icon: Scissors, color: '#6B4226' },
  { id: 'color', icon: Palette, color: '#B85C38' },
  { id: 'telar', icon: Layers, color: '#8FA878' },
  { id: 'diarios', icon: NotebookPen, color: '#A79E8E' },
  { id: 'futuro', icon: Recycle, color: '#4C7A3D' },
];

export default function TallerFique() {
  const { t } = useTranslation();
  const { path } = useLanguage();

  return (
    <>
      <PageHeader
        accent={t('tallerFique.accent')}
        title={t('tallerFique.title')}
        intro={t('tallerFique.intro')}
      />

      {/* Estado del libro: la experiencia interactiva llega en la Fase 2 */}
      <section className="px-6 md:px-12 py-16 bg-cream">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="border border-dashed border-stone rounded-tl-3xl rounded-br-3xl p-8 md:p-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-4 text-penca">
                <BookOpen size={24} />
                <span className="font-bold uppercase tracking-widest text-sm">
                  {t('tallerFique.comingSoon')}
                </span>
              </div>
              <p className="text-charcoal/70 text-lg font-light">
                {t('tallerFique.comingSoonText')}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capítulos */}
      <section className="px-6 md:px-12 py-20 md:py-28 bg-moss/10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-fraunces text-charcoal text-center mb-16">
              {t('tallerFique.chaptersTitle')}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CHAPTERS.map((chapter, index) => (
              <Reveal key={chapter.id} delay={(index % 3) * 150}>
                <div className="bg-cream rounded-tl-3xl rounded-br-3xl p-8 h-full border border-stone/20 hover:shadow-xl transition-shadow duration-500">
                  <div className="mb-6">
                    <IconCircle icon={chapter.icon} color={chapter.color} />
                  </div>
                  <h3 className="text-2xl font-fraunces text-charcoal mb-3">
                    {t(`tallerFique.chapters.${chapter.id}.title`)}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed font-light">
                    {t(`tallerFique.chapters.${chapter.id}.desc`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
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
