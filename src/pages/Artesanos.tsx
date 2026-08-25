import { Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { useArtesanos } from '../hooks/useArtesanos';
import { useLanguage } from '../i18n/languageContext';
import type { Artesano } from '../types/content';

function ArtesanoCard({ artesano, index }: { artesano: Artesano; index: number }) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Staggered top margin echoes the asymmetric collection grid on the home page.
  const offsets = ['md:mt-0', 'md:mt-16', 'md:mt-8'];

  return (
    <Reveal delay={(index % 3) * 200} className={`group ${offsets[index % 3]}`}>
      <article>
        <div className="relative overflow-hidden rounded-tl-3xl rounded-br-3xl mb-6 bg-earth">
          {artesano.fotoUrl ? (
            <>
              <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors z-10 duration-500" />
              <img
                src={artesano.fotoUrl}
                alt={t('artesanos.photoAlt', { name: artesano.nombre })}
                loading="lazy"
                className="w-full h-96 object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[800ms]"
              />
            </>
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-moss/30">
              <Leaf size={64} className="text-earth/40" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-fraunces text-charcoal mb-1">{artesano.nombre}</h2>
        <span className="text-sm text-penca uppercase tracking-widest">
          {artesano.oficio[language]}
        </span>
        {artesano.bio[language] && (
          <p className="text-charcoal/70 leading-relaxed mt-4 font-light">
            {artesano.bio[language]}
          </p>
        )}
      </article>
    </Reveal>
  );
}

export default function Artesanos() {
  const { t } = useTranslation();
  const { path } = useLanguage();
  const { artesanos } = useArtesanos();

  return (
    <>
      <PageHeader
        accent={t('artesanos.accent')}
        title={t('artesanos.title')}
        intro={t('artesanos.intro')}
        note={t('artesanos.note')}
      />

      <section className="px-6 md:px-12 py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto">
          {artesanos.length === 0 ? (
            <Reveal>
              <p className="text-center text-stone text-lg font-light max-w-xl mx-auto">
                {t('artesanos.empty')}
              </p>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {artesanos.map((artesano, index) => (
                <ArtesanoCard key={artesano.id} artesano={artesano} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <Reveal direction="up">
            <div className="bg-penca rounded-br-[5rem] rounded-tl-[5rem] p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-fraunces text-cream mb-4">
                {t('artesanos.cta.title')}
              </h2>
              <p className="text-cream/80 text-lg mb-8 font-light max-w-xl mx-auto">
                {t('artesanos.cta.text')}
              </p>
              <Button to={path('contacto')} variant="primary">
                {t('artesanos.cta.button')}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
