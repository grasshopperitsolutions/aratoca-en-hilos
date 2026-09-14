import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Droplets,
  Layers,
  Leaf,
  MapPin,
  RefreshCw,
  Scissors,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Button from '../components/Button';
import Reveal from '../components/Reveal';
import { ImagenPendiente } from '../components/Pendiente';
import { IMAGES } from '../content/images';
import { useLanguage } from '../i18n/languageContext';

/**
 * The six phases of fique, named as the book names them.
 *
 * This page used to advertise seven steps under names of its own, which put the
 * landing page in direct contradiction with the book the same site publishes.
 * The book is the researched source, so it wins. Ids match the translation keys.
 */
const PROCESS_STEPS: { id: string; icon: LucideIcon; color: string }[] = [
  { id: 'cosecha', icon: Leaf, color: '#4C7A3D' },
  { id: 'desfibrado', icon: Scissors, color: '#6B4226' },
  { id: 'lavadoSecado', icon: Droplets, color: '#8FA878' },
  { id: 'escarmenado', icon: Wind, color: '#A79E8E' },
  { id: 'hilado', icon: RefreshCw, color: '#6B4226' },
  { id: 'acabado', icon: Layers, color: '#B85C38' },
];

const COLLECTION: { id: string; img: string | null; offset: string }[] = [
  { id: 'mochilas', img: IMAGES.collectionBags, offset: 'md:mt-0' },
  { id: 'tapices', img: IMAGES.collectionTapestries, offset: 'md:mt-16' },
  { id: 'calzado', img: IMAGES.collectionFootwear, offset: 'md:mt-8' },
];

export default function Home() {
  const { t } = useTranslation();
  const { path } = useLanguage();

  return (
    <>
      {/* SPLIT HERO SECTION */}
      <section className="min-h-screen flex flex-col md:flex-row pt-20 md:pt-0">
        {/* Columna Texto */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-20 lg:p-24 bg-cream relative">
          <div className="max-w-xl z-10">
            <Reveal direction="up" delay={100}>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-[1px] w-8 bg-penca"></span>
                <span className="text-penca font-bold uppercase tracking-widest text-xs flex items-center gap-1">
                  <MapPin size={14} /> {t('home.hero.location')}
                </span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={300}>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-fraunces font-bold text-charcoal leading-[1.1] mb-6">
                {t('home.hero.titleLine1')} <br />
                <span className="text-terracotta italic font-light">
                  {t('home.hero.titleLine2')}
                </span>{' '}
                <br />
                {t('home.hero.titleLine3')}
              </h1>
            </Reveal>

            <Reveal direction="up" delay={500}>
              <p className="text-lg md:text-xl text-charcoal/80 leading-relaxed mb-10 font-light border-l-2 border-fique pl-6">
                {t('home.hero.intro')}
              </p>
            </Reveal>

            <Reveal direction="up" delay={700}>
              <a
                href="#historia"
                className="inline-flex items-center gap-4 text-charcoal font-bold uppercase tracking-widest text-sm group"
              >
                <span className="w-12 h-12 rounded-full border border-charcoal flex items-center justify-center group-hover:bg-charcoal group-hover:text-cream transition-all">
                  <ArrowDownRight size={20} />
                </span>
                {t('home.hero.cta')}
              </a>
            </Reveal>
          </div>

          {/* Elemento decorativo */}
          <div className="absolute bottom-10 right-10 text-fique opacity-30 rotate-12">
            <Leaf size={120} />
          </div>
        </div>

        {/* Columna Imagen */}
        <div className="w-full md:w-1/2 h-[60vh] md:h-screen relative overflow-hidden">
          <div className="absolute inset-0 bg-earth/20 mix-blend-multiply z-10"></div>
          <img
            src={IMAGES.heroWeaver}
            alt={t('home.hero.imageAlt')}
            className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2000ms]"
          />
        </div>
      </section>

      {/* SECCIÓN HISTORIA (Editorial) */}
      <section id="historia" className="py-24 md:py-32 px-6 md:px-12 bg-moss/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Texto Histórico */}
            <div className="lg:col-span-5 lg:col-start-2 relative z-20">
              <Reveal direction="right">
                <h2 className="text-5xl md:text-6xl font-fraunces text-earth mb-8 relative">
                  <span className="absolute -top-10 -left-6 text-8xl text-fique opacity-50 font-serif">
                    &ldquo;
                  </span>
                  {t('home.historia.title')}
                </h2>
                <div className="space-y-6 text-charcoal/80 text-lg">
                  <p>{t('home.historia.p1')}</p>
                  <p>{t('home.historia.p2')}</p>
                </div>
                <div className="mt-10">
                  <span className="font-caveat text-3xl text-penca block -rotate-2">
                    {t('home.historia.note')}
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Composición Fotográfica Orgánica */}
            <div className="lg:col-span-6 lg:col-start-7 relative mt-10 lg:mt-0">
              <Reveal direction="left" delay={200}>
                <div className="relative w-full aspect-square">
                  <img
                    src={IMAGES.fiquePlant}
                    alt={t('home.historia.imageAltPlant')}
                    loading="lazy"
                    className="absolute top-0 right-0 w-3/4 h-3/4 object-cover rounded-tr-[4rem] rounded-bl-[4rem] rounded-tl-xl rounded-br-xl shadow-2xl z-10"
                  />
                  <img
                    src={IMAGES.fiqueTexture}
                    alt={t('home.historia.imageAltTexture')}
                    loading="lazy"
                    className="absolute bottom-0 left-0 w-2/3 h-2/3 object-cover rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-lg rounded-bl-lg border-8 border-cream shadow-xl z-20"
                  />
                  <div className="absolute top-1/4 -left-4 w-24 h-24 bg-terracotta rounded-full mix-blend-multiply opacity-80 z-0 blur-xl"></div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN PROCESO (Línea de tiempo vertical intercalada) */}
      <section id="proceso" className="py-24 md:py-32 px-6 md:px-12 bg-cream">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-sm font-bold uppercase tracking-widest text-penca mb-4">
                {t('home.proceso.accent')}
              </h2>
              <h3 className="text-4xl md:text-5xl font-fraunces text-charcoal">
                {t('home.proceso.title')}
              </h3>
            </div>
          </Reveal>

          <div className="relative">
            {/* Línea central vertical (solo desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-stone/30 transform -translate-x-1/2"></div>

            {PROCESS_STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={step.id}
                  className="mb-16 md:mb-24 relative flex flex-col md:flex-row items-center justify-between group"
                >
                  {/* Mobile Line */}
                  <div className="md:hidden absolute left-6 top-10 bottom-[-4rem] w-[1px] bg-stone/30 z-0"></div>

                  {/* Desktop Layout Alterno */}
                  <div
                    className={`w-full md:w-5/12 relative z-10 pl-16 md:pl-0 ${
                      isEven ? 'md:text-right md:pr-12' : 'md:order-3 md:text-left md:pl-12'
                    }`}
                  >
                    <Reveal direction={isEven ? 'right' : 'left'} delay={100}>
                      <span className="text-stone font-fraunces text-6xl opacity-20 absolute -top-8 -left-4 md:static md:opacity-100 md:text-4xl md:mb-2 block">
                        0{index + 1}
                      </span>
                      <h4 className="text-2xl font-fraunces text-charcoal mb-3">
                        {t(`home.proceso.steps.${step.id}.title`)}
                      </h4>
                      <p className="text-charcoal/70 text-base leading-relaxed">
                        {t(`home.proceso.steps.${step.id}.desc`)}
                      </p>
                    </Reveal>
                  </div>

                  {/* Círculo Central con Ícono */}
                  <div className="absolute left-0 md:static md:w-2/12 flex justify-center z-20 md:order-2">
                    <Reveal delay={200}>
                      <div
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg text-cream"
                        style={{ backgroundColor: step.color }}
                      >
                        <step.icon size={24} className="md:w-7 md:h-7" />
                      </div>
                    </Reveal>
                  </div>

                  {/* Espaciador para la cuadrícula en desktop */}
                  <div
                    className={`hidden md:block w-5/12 ${isEven ? 'md:order-3' : 'md:order-1'}`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALERÍA / PRODUCTOS (Grid Asimétrico) */}
      <section
        id="coleccion"
        className="py-24 bg-charcoal text-cream rounded-t-[3rem] md:rounded-t-[5rem] mt-[-2rem] relative z-20 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-fraunces text-fique mb-4">
                {t('home.coleccion.titleLine1')} <br /> {t('home.coleccion.titleLine2')}
              </h2>
              <p className="text-stone max-w-md font-light text-lg">
                {t('home.coleccion.subtitle')}
              </p>
            </Reveal>
            <Reveal delay={200}>
              <Button
                to={path('artesanos')}
                variant="ghost"
                className="text-terracotta hover:text-fique pb-2 border-b border-terracotta hover:border-fique rounded-none px-0"
              >
                {t('home.coleccion.cta')} <ArrowRight size={16} />
              </Button>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COLLECTION.map((item, i) => (
              <Reveal key={item.id} delay={i * 200} className={`group ${item.offset}`}>
                <div className="relative overflow-hidden rounded-tl-3xl rounded-br-3xl mb-6 bg-earth">
                  {item.img ? (
                    <>
                      <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                      <img
                        src={item.img}
                        alt={t(`home.coleccion.items.${item.id}.title`)}
                        loading="lazy"
                        className="w-full h-96 object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[800ms]"
                      />
                    </>
                  ) : (
                    <ImagenPendiente
                      detalle={t(`pendiente.fotos.${item.id}`)}
                      tono="contraste"
                      className="h-96"
                    />
                  )}
                </div>
                <h3 className="text-2xl font-fraunces text-cream mb-2">
                  {t(`home.coleccion.items.${item.id}.title`)}
                </h3>
                <span className="text-sm text-moss uppercase tracking-widest">
                  {t('common.handmade')}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA DIGITAL BOOK */}
      <section className="py-24 px-6 md:px-12 bg-cream">
        <div className="max-w-6xl mx-auto">
          <Reveal direction="up">
            <div className="bg-penca rounded-br-[5rem] rounded-tl-[5rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
              {/* Overlay Textura */}
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] mix-blend-overlay"></div>

              <div className="relative z-10 max-w-lg">
                <div className="flex items-center gap-3 mb-4 text-fique">
                  <BookOpen size={24} />
                  <span className="font-bold uppercase tracking-widest text-sm">
                    {t('home.libro.eyebrow')}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-fraunces text-cream mb-6 leading-tight">
                  {t('home.libro.title')}
                </h2>
                <p className="text-cream/80 text-lg mb-8 font-light">{t('home.libro.text')}</p>
                <Button to={path('tallerFique')} variant="primary">
                  {t('home.libro.cta')}
                </Button>
              </div>

              <div className="relative z-10 hidden md:block">
                <div className="w-64 h-64 border-2 border-fique rounded-full flex items-center justify-center p-4 -rotate-[10deg] hover:rotate-0 transition-transform duration-700">
                  <div className="w-full h-full border border-fique rounded-full flex items-center justify-center border-dashed">
                    <span className="font-caveat text-4xl text-cream text-center px-6">
                      {t('home.libro.sealLine1')} <br /> {t('home.libro.sealLine2')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
