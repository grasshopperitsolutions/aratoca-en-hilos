import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { ChevronLeft, ChevronRight, List, Volume2, VolumeX, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Pagina from './Pagina';
import {
  construirPaginas,
  esPaginaPlena,
  paginaDeCapitulo,
  type PaginaConCapitulo,
} from './paginar';
import { RevealInerte } from '../revealContexto';
import { libroTexto } from '../../content/libro';
import { useAmbiente, useEfecto, useSilencio } from '../../hooks/useSonido';
import { useLanguage } from '../../i18n/languageContext';
import { LIBRO_CAPITULOS, type LibroCapitulo } from '../../types/libro';

/**
 * The interactive reader.
 *
 * A spread is two pages side by side; turning rotates a single leaf about the
 * spine. The leaf is real DOM, so the pages it carries stay selectable,
 * interactive and readable by a screen reader — which is what makes the
 * activities possible at all.
 *
 * The turn is a CSS animation rather than a JavaScript loop. Nothing is
 * rasterised, nothing is uploaded to the GPU, and the browser animates the
 * transform off the main thread; the previous WebGL reader stuttered because
 * every page face was a multi-megabyte texture created at the moment a turn
 * began.
 *
 * Loaded lazily and mounted from state, never during render, so the page it
 * lives on stays prerenderable.
 */

const DURACION = 620;

/**
 * One face of the book. A `null` index is a blank leaf, not a missing one.
 *
 * `animar` applies to the content, never to the sheet: the paper is already
 * there, and it is what is printed on it that arrives.
 */
function Hoja({
  paginas,
  indice,
  sombra = false,
  animar = false,
  onCerrar,
}: {
  paginas: readonly PaginaConCapitulo[];
  indice: number | null;
  sombra?: boolean;
  animar?: boolean;
  onCerrar?: () => void;
}) {
  const contenido = indice === null ? undefined : paginas[indice]?.pagina;
  const fondo = `h-full w-full bg-cream ${sombra ? 'libro-gutter' : ''}`;
  if (!contenido) return <div className={fondo} />;

  const entrada = !animar
    ? ''
    : esPaginaPlena(contenido)
      ? 'libro-entrada libro-entrada--plana'
      : 'libro-entrada';

  return (
    <div className={fondo}>
      <div className={`h-full w-full ${entrada}`}>
        <Pagina pagina={contenido} onCerrar={onCerrar} />
      </div>
    </div>
  );
}

type Estado =
  | { fase: 'quieto'; spread: number }
  | { fase: 'girando'; spread: number; destino: number; direccion: 1 | -1 };

export interface ReaderProps {
  capituloInicial: LibroCapitulo | null;
  onClose: () => void;
}

export default function Reader({ capituloInicial, onClose }: ReaderProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const libro = useMemo(() => libroTexto(language), [language]);
  const paginas = useMemo<PaginaConCapitulo[]>(() => construirPaginas(libro), [libro]);

  const totalSpreads = Math.ceil(paginas.length / 2);

  const [estado, setEstado] = useState<Estado>(() => ({
    fase: 'quieto',
    spread: capituloInicial
      ? Math.floor(paginaDeCapitulo(paginas, capituloInicial) / 2)
      : 0,
  }));
  const [indiceAbierto, setIndiceAbierto] = useState(false);
  const efecto = useEfecto();
  const { silenciado, alternar } = useSilencio();

  // The bed runs for as long as the reader is open, and stops with it.
  useAmbiente(true);

  // Which half should play its entry animation next time its content changes.
  //
  // A turn only ever exposes one half — the other is delivered by the leaf
  // itself, already at full opacity when it lands, so replaying it there would
  // read as a flash. Opening the book, or jumping from the contents, exposes
  // both.
  const [lado, setLado] = useState<'ambos' | 'izquierda' | 'derecha'>('ambos');

  // One page at a time on a phone: two pages side by side on a 390px screen
  // would be unreadable whatever the typography.
  const [doble, setDoble] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 900,
  );
  useEffect(() => {
    const alRedimensionar = () => setDoble(window.innerWidth >= 900);
    window.addEventListener('resize', alRedimensionar);
    return () => window.removeEventListener('resize', alRedimensionar);
  }, []);

  const spread = estado.spread;

  // The opening thud, once. Closing is handled on the button so it fires
  // before the component unmounts and takes the handler with it.
  useEffect(() => {
    efecto('abrir');
  }, [efecto]);

  const cerrarConSonido = useCallback(() => {
    efecto('cerrar');
    onClose();
  }, [efecto, onClose]);

  const mover = useCallback(
    (direccion: 1 | -1) => {
      setEstado((actual) => {
        if (actual.fase === 'girando') return actual;
        const destino = actual.spread + direccion;
        if (destino < 0 || destino >= totalSpreads) return actual;
        // Played here rather than on commit so the sheet is heard leaving, not
        // landing — and a blocked turn at either end stays silent.
        efecto('pagina');
        return { fase: 'girando', spread: actual.spread, destino, direccion };
      });
    },
    [totalSpreads, efecto],
  );

  // Committing is idempotent, because two things can trigger it.
  const terminar = useCallback(() => {
    if (estado.fase !== 'girando') return;
    // The half that waited blank behind the leaf is the one whose content
    // arrives now; the other half the leaf put down itself.
    setLado(estado.direccion === 1 ? 'derecha' : 'izquierda');
    setEstado({ fase: 'quieto', spread: estado.destino });
  }, [estado]);

  // A backstop for the turn.
  //
  // Browsers pause CSS animations in a hidden tab, and `animationend` then
  // never arrives — so a reader who switches away mid-turn would come back to a
  // book wedged half-open, with the controls dead. The timer guarantees the
  // state machine always leaves `girando`, whichever signal gets there first.
  useEffect(() => {
    if (estado.fase !== 'girando') return;
    const temporizador = window.setTimeout(terminar, DURACION + 150);
    return () => window.clearTimeout(temporizador);
  }, [estado, terminar]);

  useEffect(() => {
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === 'ArrowRight') mover(1);
      else if (evento.key === 'ArrowLeft') mover(-1);
      else if (evento.key === 'Escape') {
        if (indiceAbierto) setIndiceAbierto(false);
        else cerrarConSonido();
      }
    };
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [mover, cerrarConSonido, indiceAbierto]);

  // Drag to turn. Fires on release only, and direction comes from the
  // displacement — @use-gesture reports velocity as a magnitude, so testing it
  // alone would send a fast backwards flick forwards.
  const bind = useDrag(
    ({ last, movement: [mx], velocity: [vx] }) => {
      if (!last) return;
      const rapido = vx > 0.4;
      if (mx <= -45 || (rapido && mx < 0)) mover(1);
      else if (mx >= 45 || (rapido && mx > 0)) mover(-1);
    },
    { axis: 'x', filterTaps: true, pointer: { touch: true } },
  );

  const capituloActual =
    paginas[spread * 2]?.capitulo ?? paginas[spread * 2 + 1]?.capitulo ?? null;

  // Which pages sit where during a turn. The half the turn is about to reveal
  // waits blank: showing the incoming page under the lifting leaf and then
  // animating it in again at the commit is precisely the flicker this avoids.
  const girando = estado.fase === 'girando';
  const adelante = girando && estado.direccion === 1;

  const izquierdaFija = girando && !adelante ? null : spread * 2;
  const derechaFija = adelante ? null : spread * 2 + 1;
  const caraFrente = adelante ? spread * 2 + 1 : girando ? estado.destino * 2 + 1 : 0;
  const caraDorso = adelante ? estado.destino * 2 : girando ? spread * 2 : 0;

  // On a phone the page beneath the cross-fade is already the incoming one.
  const paginaMovil = girando ? estado.destino * 2 : spread * 2;

  const pastilla =
    'pointer-events-auto rounded-full bg-charcoal/90 text-cream ring-1 ring-cream/25 shadow-lg backdrop-blur-sm transition-colors hover:bg-charcoal';

  return (
    <RevealInerte.Provider value={true}>
      <div
        className="fixed inset-0 z-[60] bg-charcoal"
        role="dialog"
        aria-modal="true"
        aria-label={libro.titulo}
      >
        <div
          className="absolute inset-0 flex items-center justify-center px-3 sm:px-8 pt-16 pb-20 sm:pt-20 sm:pb-24 touch-none"
          {...bind()}
        >
          <div
            className="libro-escena w-full max-w-5xl max-h-full"
            style={{ aspectRatio: doble ? '3 / 2' : '3 / 4' }}
          >
            <div className="relative h-full w-full flex shadow-2xl">
              {/* Resting spread */}
              {doble && (
                <div className="relative h-full w-1/2 overflow-hidden rounded-l-sm">
                  {/* Keyed by the page it shows, so the animation restarts when
                      and only when the content actually changes. */}
                  <Hoja
                    key={`izq-${izquierdaFija}`}
                    paginas={paginas}
                    indice={izquierdaFija}
                    sombra
                    animar={lado !== 'derecha'}
                    onCerrar={onClose}
                  />
                </div>
              )}
              <div
                className={`relative h-full overflow-hidden rounded-r-sm ${doble ? 'w-1/2' : 'w-full rounded-l-sm'}`}
              >
                <Hoja
                  key={`der-${doble ? derechaFija : paginaMovil}`}
                  paginas={paginas}
                  indice={doble ? derechaFija : paginaMovil}
                  sombra={doble}
                  animar={!doble || lado !== 'izquierda'}
                  onCerrar={onClose}
                />
              </div>

              {/* The turning leaf, mounted only while it turns */}
              {girando && doble && (
                <div
                  className="libro-hoja absolute top-0 left-1/2 h-full w-1/2 overflow-visible"
                  style={{
                    animation: `${adelante ? 'hoja-adelante' : 'hoja-atras'} ${DURACION}ms cubic-bezier(0.36, 0.05, 0.25, 1) forwards`,
                  }}
                  onAnimationEnd={terminar}
                  aria-hidden="true"
                >
                  <div className="libro-cara bg-cream">
                    <Hoja paginas={paginas} indice={caraFrente} sombra={false} onCerrar={onClose} />
                    <span
                      className="libro-velo"
                      style={{
                        animation: `${adelante ? 'velo-entra' : 'velo-sale'} ${DURACION}ms ease-in-out forwards`,
                      }}
                    />
                  </div>
                  <div className="libro-cara libro-cara--dorso bg-cream">
                    <Hoja paginas={paginas} indice={caraDorso} sombra={false} onCerrar={onClose} />
                    <span
                      className="libro-velo"
                      style={{
                        animation: `${adelante ? 'velo-sale' : 'velo-entra'} ${DURACION}ms ease-in-out forwards`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* On a phone there is no spine to fold about, so the outgoing
                  page cross-fades away over the incoming one. */}
              {girando && !doble && (
                <div
                  className="absolute inset-0 bg-cream overflow-hidden"
                  style={{ animation: `velo-sale ${DURACION / 2}ms ease-out forwards` }}
                  onAnimationEnd={terminar}
                  aria-hidden="true"
                >
                  <Hoja paginas={paginas} indice={spread * 2} sombra={false} onCerrar={onClose} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chrome. Solid charcoal pills rather than translucent ones: these sit
            over the cream page as often as over the backdrop, and a
            cream-on-cream control is an invisible control. */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 md:p-6 pointer-events-none">
          <button
            onClick={() => {
              efecto('clic');
              setIndiceAbierto((abierto) => !abierto);
            }}
            className={`${pastilla} inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest`}
          >
            <List size={15} />
            {t('libro.indice')}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={alternar}
              aria-pressed={silenciado}
              aria-label={silenciado ? t('libro.activarSonido') : t('libro.silenciar')}
              title={silenciado ? t('libro.activarSonido') : t('libro.silenciar')}
              className={`${pastilla} p-3`}
            >
              {silenciado ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              onClick={cerrarConSonido}
              aria-label={t('libro.cerrar')}
              className={`${pastilla} p-3`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-3 sm:gap-5 p-4 sm:p-6 pointer-events-none">
          <button
            onClick={() => mover(-1)}
            disabled={spread === 0}
            aria-label={t('libro.anterior')}
            className={`${pastilla} p-3 disabled:opacity-40`}
          >
            <ChevronLeft size={20} />
          </button>
          <p className="rounded-full bg-charcoal/90 ring-1 ring-cream/25 shadow-lg backdrop-blur-sm text-cream/85 text-xs uppercase tracking-widest px-5 py-3 min-w-36 text-center">
            {capituloActual
              ? t('libro.capituloDe', { numero: capituloActual, total: LIBRO_CAPITULOS.length })
              : libro.titulo}
          </p>
          <button
            onClick={() => mover(1)}
            disabled={spread >= totalSpreads - 1}
            aria-label={t('libro.siguiente')}
            className={`${pastilla} p-3 disabled:opacity-40`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {indiceAbierto && (
          <>
            {/* A scrim, so a click anywhere outside the drawer closes it. It
                covers the chrome as well as the book: while the contents are
                open they are the only thing being asked about. */}
            <button
              type="button"
              aria-label={t('libro.cerrarIndice')}
              onClick={() => setIndiceAbierto(false)}
              className="libro-indice-velo absolute inset-0 cursor-default bg-charcoal/50"
            />
            <nav
              // Never the full width: on a phone the drawer would cover the scrim
              // entirely and there would be no outside left to tap.
              className="libro-indice absolute inset-y-0 left-0 w-[86%] max-w-sm bg-cream p-8 overflow-y-auto shadow-2xl"
              aria-label={t('libro.indice')}
            >
              <h2 className="font-fraunces text-2xl text-charcoal mb-6">{t('libro.indice')}</h2>
              <ol>
                {LIBRO_CAPITULOS.map((numero) => {
                  const aqui = numero === capituloActual;
                  return (
                    <li key={numero} className="border-b border-stone/25 last:border-0">
                      <button
                        onClick={() => {
                          setLado('ambos');
                          setEstado({
                            fase: 'quieto',
                            spread: Math.floor(paginaDeCapitulo(paginas, numero) / 2),
                          });
                          setIndiceAbierto(false);
                        }}
                        aria-current={aqui ? 'true' : undefined}
                        className={`group w-full cursor-pointer text-left flex gap-4 items-center rounded-md px-3 py-3.5 transition-colors hover:bg-fique/35 focus-visible:bg-fique/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                          aqui ? 'bg-fique/20' : ''
                        }`}
                      >
                        <span
                          className={`font-fraunces text-lg shrink-0 w-7 transition-colors group-hover:text-terracotta ${
                            aqui ? 'text-terracotta' : 'text-stone'
                          }`}
                        >
                          {String(numero).padStart(2, '0')}
                        </span>
                        <span className="font-fraunces text-charcoal flex-1 transition-transform duration-300 motion-safe:group-hover:translate-x-1">
                          {libro.capitulos[numero].titulo}
                        </span>
                        <ChevronRight
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-terracotta opacity-0 transition-all duration-300 motion-safe:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </>
        )}
      </div>
    </RevealInerte.Provider>
  );
}
