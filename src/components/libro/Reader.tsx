import { useCallback, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, List, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Book3D from './Book3D';
import Encuadre from './Encuadre';
import { construirPaginas, paginaDeCapitulo, type PaginaConCapitulo } from './paginas';
import { liberarTexturas } from './pageTexture';
import { libroTexto } from '../../content/libro';
import { useLanguage } from '../../i18n/languageContext';
import { LIBRO_CAPITULOS, type LibroCapitulo } from '../../types/libro';

/**
 * The interactive reader.
 *
 * Lazy-loaded, and mounted only when the visitor opens it: three.js and its
 * page textures are far heavier than the rest of the site put together, and no
 * one browsing the artisans should pay for them. Everything the crawlers and
 * no-JS visitors need already exists as HTML at /libro and /libro/capitulo-N.
 *
 * Respects `prefers-reduced-motion` by cross-fading instead of turning, and
 * falls back to closing itself if WebGL is unavailable.
 */

function prefiereMenosMovimiento(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function soportaWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ?? canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

export interface ReaderProps {
  /** Chapter to open at, from the `?c=` deep link. */
  capituloInicial: LibroCapitulo | null;
  onClose: () => void;
  /** Called when WebGL is missing, so the page can explain itself. */
  onUnsupported: () => void;
}

export default function Reader({ capituloInicial, onClose, onUnsupported }: ReaderProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const libro = useMemo(() => libroTexto(language), [language]);

  const [paginas, setPaginas] = useState<PaginaConCapitulo[] | null>(null);
  const [posicion, setPosicion] = useState(0);
  const [indiceAbierto, setIndiceAbierto] = useState(false);
  const [reducido] = useState(prefiereMenosMovimiento);

  // One page at a time on a phone: two 1000px pages side by side on a 375px
  // screen would be unreadable, whatever the texture resolution.
  const [spread, setSpread] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 768,
  );

  useEffect(() => {
    const alRedimensionar = () => setSpread(window.innerWidth >= 768);
    window.addEventListener('resize', alRedimensionar);
    return () => window.removeEventListener('resize', alRedimensionar);
  }, []);

  // Pagination measures real glyphs, so it needs fonts to be ready first —
  // otherwise the first spread is laid out against a fallback face and then
  // silently disagrees with every page drawn afterwards.
  useEffect(() => {
    if (!soportaWebGL()) {
      onUnsupported();
      return;
    }

    let cancelado = false;
    void document.fonts.ready.then(() => {
      if (cancelado) return;
      const construidas = construirPaginas(libro);
      setPaginas(construidas);
      if (capituloInicial) setPosicion(paginaDeCapitulo(construidas, capituloInicial));
    });

    return () => {
      cancelado = true;
    };
  }, [libro, capituloInicial, onUnsupported]);

  useEffect(() => liberarTexturas, []);

  const total = paginas?.length ?? 0;

  const paso = spread ? 2 : 1;
  const mover = useCallback(
    (delta: number) => {
      setPosicion((actual) => {
        const siguiente = actual + delta * paso;
        if (siguiente < 0 || siguiente >= total) return actual;
        return siguiente;
      });
    },
    [total, paso],
  );

  useEffect(() => {
    const alPulsar = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') mover(1);
      else if (event.key === 'ArrowLeft') mover(-1);
      else if (event.key === 'Escape') {
        if (indiceAbierto) setIndiceAbierto(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [mover, onClose, indiceAbierto]);

  // Drag to turn. Only fires on release, and only past a threshold, so a stray
  // touch does nothing. use-gesture reports velocity as a magnitude, so the
  // direction has to come from the displacement — testing velocity alone sent a
  // fast backwards flick forwards.
  const bind = useDrag(
    ({ last, movement: [mx], velocity: [vx] }) => {
      if (!last) return;
      const rapido = vx > 0.4;
      if (mx <= -45 || (rapido && mx < 0)) mover(1);
      else if (mx >= 45 || (rapido && mx > 0)) mover(-1);
    },
    { axis: 'x', filterTaps: true },
  );

  const capituloActual = paginas?.[posicion]?.capitulo ?? null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[60] bg-charcoal"
      role="dialog"
      aria-modal="true"
      aria-label={libro.titulo}
    >
      {/* The book */}
      <div className="absolute inset-0 touch-none" {...bind()}>
        {paginas && (
          <Canvas
            shadows
            frameloop="demand"
            dpr={[1, 2]}
            camera={{ position: [0, 0, 4], fov: 42 }}
            gl={{ antialias: true }}
          >
            {/* Plain lights rather than drei's Environment: its presets fetch an
                HDR from a third-party CDN at runtime, and this site does not
                hotlink assets. Paper is diffuse anyway — a key, a fill and a
                little ambient read better here than image-based lighting. */}
            <ambientLight intensity={1.1} />
            <directionalLight position={[2.5, 4, 4]} intensity={1.5} castShadow />
            <directionalLight position={[-3, 1, 2]} intensity={0.35} />
            <Encuadre spread={spread} />
            <Book3D
              paginas={paginas}
              posicion={posicion}
              sinAnimacion={reducido}
              spread={spread}
            />
          </Canvas>
        )}

        {!paginas && (
          <p className="absolute inset-0 flex items-center justify-center text-cream/70 text-sm uppercase tracking-widest">
            {t('libro.cargando')}
          </p>
        )}
      </div>

      {/* Chrome */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 md:p-6 pointer-events-none">
        <button
          onClick={() => setIndiceAbierto((abierto) => !abierto)}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-cream/10 hover:bg-cream/20 text-cream px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors backdrop-blur-sm"
        >
          <List size={15} />
          {t('libro.indice')}
        </button>

        <button
          onClick={onClose}
          aria-label={t('libro.cerrar')}
          className="pointer-events-auto rounded-full bg-cream/10 hover:bg-cream/20 text-cream p-3 transition-colors backdrop-blur-sm"
        >
          <X size={18} />
        </button>
      </div>

      {/* Turn controls */}
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-6 p-6 pointer-events-none">
        <button
          onClick={() => mover(-1)}
          disabled={posicion === 0}
          aria-label={t('libro.anterior')}
          className="pointer-events-auto rounded-full bg-cream/10 hover:bg-cream/20 disabled:opacity-25 text-cream p-3 transition-colors backdrop-blur-sm"
        >
          <ChevronLeft size={20} />
        </button>

        <p className="text-cream/70 text-xs uppercase tracking-widest min-w-32 text-center">
          {capituloActual
            ? t('libro.capituloDe', { numero: capituloActual, total: LIBRO_CAPITULOS.length })
            : libro.titulo}
        </p>

        <button
          onClick={() => mover(1)}
          disabled={posicion >= total - paso}
          aria-label={t('libro.siguiente')}
          className="pointer-events-auto rounded-full bg-cream/10 hover:bg-cream/20 disabled:opacity-25 text-cream p-3 transition-colors backdrop-blur-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Contents */}
      <AnimatePresence>
        {indiceAbierto && paginas && (
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            className="absolute inset-y-0 left-0 w-full max-w-sm bg-cream p-8 overflow-y-auto"
            aria-label={t('libro.indice')}
          >
            <h2 className="font-fraunces text-2xl text-charcoal mb-6">{t('libro.indice')}</h2>
            <ol className="space-y-2">
              {LIBRO_CAPITULOS.map((numero) => (
                <li key={numero}>
                  <button
                    onClick={() => {
                      setPosicion(paginaDeCapitulo(paginas, numero));
                      setIndiceAbierto(false);
                    }}
                    className="w-full text-left flex gap-4 items-baseline py-3 border-b border-stone/25 hover:text-terracotta transition-colors"
                  >
                    <span className="font-fraunces text-fique text-lg shrink-0">
                      {String(numero).padStart(2, '0')}
                    </span>
                    <span className="font-fraunces text-charcoal">
                      {libro.capitulos[numero].titulo}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            {reducido && (
              <p className="text-stone text-xs mt-8">{t('libro.movimientoReducido')}</p>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
