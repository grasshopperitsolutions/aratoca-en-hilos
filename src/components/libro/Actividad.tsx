import { useEffect, useId, useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useEfecto } from '../../hooks/useSonido';

import Ilustracion from './Ilustraciones';
import Reveal from '../Reveal';
import { ACTIVIDADES } from '../../content/libro/estructura';
import { libroTexto } from '../../content/libro';
import { useLanguage } from '../../i18n/languageContext';
import { useProgresoLibro } from '../../hooks/useProgresoLibro';
import type { ActividadMeta, ActividadTexto } from '../../types/libro';

/**
 * The five interaction primitives, and the dispatcher that picks one.
 *
 * Deliberately ordinary form controls — real buttons, real checkboxes, a real
 * range input — so they are focusable, keyboard-operable and announced properly,
 * and so the browser does the hard parts. The feedback is the only decoration,
 * and it is always re-answerable: this is a reading activity, not an exam, so a
 * wrong answer explains itself and lets you try again.
 *
 * Only the first attempt counts towards the closing summary; see
 * `useProgresoLibro`.
 */

const CAJA =
  'my-10 rounded-tl-3xl rounded-br-3xl border border-stone/30 bg-moss/10 p-6 md:p-8';
const BOTON =
  'inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300';

type Estado = 'sin-responder' | 'acierto' | 'fallo';

function Envoltura({
  children,
  estado,
  explicacion,
  onReintentar,
}: {
  children: React.ReactNode;
  estado: Estado;
  explicacion: string;
  onReintentar?: () => void;
}) {
  const { t } = useTranslation();
  const efecto = useEfecto();

  // Every activity type funnels its outcome through this wrapper, so sounding
  // the answer here covers all five without touching each one.
  useEffect(() => {
    if (estado === 'sin-responder') return;
    efecto(estado === 'acierto' ? 'acierto' : 'fallo');
  }, [estado, efecto]);

  return (
    <div
      className={`${CAJA} ${
        estado === 'fallo' ? 'motion-safe:animate-[sacudir_360ms_ease-in-out]' : ''
      }`}
    >
      {children}

      {/* One live region per activity: the outcome is announced, not just shown. */}
      <div aria-live="polite" className="mt-5">
        {estado !== 'sin-responder' && (
          <div
            className={`flex items-start gap-3 text-sm leading-relaxed ${
              estado === 'acierto' ? 'text-penca' : 'text-terracotta'
            }`}
          >
            <span
              className={`mt-0.5 shrink-0 rounded-full p-1 ${
                estado === 'acierto' ? 'bg-penca text-cream' : 'bg-terracotta text-cream'
              }`}
            >
              {estado === 'acierto' ? <Check size={13} /> : <X size={13} />}
            </span>
            <p className="text-charcoal/80 font-light">{explicacion}</p>
          </div>
        )}
      </div>

      {estado === 'fallo' && onReintentar && (
        <button
          onClick={onReintentar}
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-penca hover:text-terracotta transition-colors"
        >
          <RotateCcw size={13} />
          {t('libro.reintentar')}
        </button>
      )}
    </div>
  );
}

function Pregunta({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-fraunces text-lg md:text-xl text-charcoal leading-snug">{children}</p>
  );
}

/* ------------------------------------------------------------------ */
/* Verdadero / falso · Sí / no                                          */
/* ------------------------------------------------------------------ */

function DosBotones({
  meta,
  texto,
  etiquetas,
  onResponder,
}: {
  meta: Extract<ActividadMeta, { tipo: 'verdaderoFalso' | 'siNo' }>;
  texto: ActividadTexto;
  etiquetas: readonly [string, string];
  onResponder: (correcta: boolean) => void;
}) {
  const [elegida, setElegida] = useState<boolean | null>(null);
  const estado: Estado =
    elegida === null ? 'sin-responder' : elegida === meta.respuesta ? 'acierto' : 'fallo';

  function elegir(valor: boolean) {
    if (elegida !== null) return;
    setElegida(valor);
    onResponder(valor === meta.respuesta);
  }

  return (
    <Envoltura
      estado={estado}
      explicacion={texto.explicacion}
      onReintentar={() => setElegida(null)}
    >
      <Pregunta>{texto.pregunta}</Pregunta>

      <div className="flex flex-wrap gap-3 mt-5">
        {([true, false] as const).map((valor, indice) => {
          const elegidaEsta = elegida === valor;
          const correcta = valor === meta.respuesta;
          const revelar = elegida !== null && correcta;

          return (
            <button
              key={String(valor)}
              onClick={() => elegir(valor)}
              disabled={elegida !== null}
              aria-pressed={elegidaEsta}
              className={`${BOTON} ${
                revelar
                  ? 'bg-penca text-cream border-penca'
                  : elegidaEsta
                    ? 'bg-terracotta text-cream border-terracotta'
                    : 'bg-cream text-charcoal border-charcoal/40 hover:border-charcoal disabled:opacity-45'
              }`}
            >
              {revelar && <Check size={15} />}
              {etiquetas[indice]}
            </button>
          );
        })}
      </div>
    </Envoltura>
  );
}

/* ------------------------------------------------------------------ */
/* Opción múltiple                                                      */
/* ------------------------------------------------------------------ */

function OpcionMultiple({
  meta,
  texto,
  onResponder,
}: {
  meta: Extract<ActividadMeta, { tipo: 'opcionMultiple' }>;
  texto: ActividadTexto;
  onResponder: (correcta: boolean) => void;
}) {
  const { t } = useTranslation();
  const id = useId();
  const [marcadas, setMarcadas] = useState<readonly number[]>([]);
  const [enviada, setEnviada] = useState(false);

  const opciones = texto.opciones ?? [];
  const correctas = new Set(meta.correctas);
  const acierto =
    marcadas.length === correctas.size && marcadas.every((i) => correctas.has(i));
  const estado: Estado = !enviada ? 'sin-responder' : acierto ? 'acierto' : 'fallo';

  function alternar(indice: number) {
    if (enviada) return;
    setMarcadas((previas) =>
      previas.includes(indice) ? previas.filter((i) => i !== indice) : [...previas, indice],
    );
  }

  function enviar() {
    setEnviada(true);
    onResponder(acierto);
  }

  return (
    <Envoltura
      estado={estado}
      explicacion={texto.explicacion}
      onReintentar={() => {
        setEnviada(false);
        setMarcadas([]);
      }}
    >
      <Pregunta>{texto.pregunta}</Pregunta>

      <ul className="mt-5 space-y-2">
        {opciones.map((opcion, indice) => {
          const marcada = marcadas.includes(indice);
          const esCorrecta = correctas.has(indice);
          // After submitting, show what the right answer was — including the
          // ones that were missed, which is where the learning happens.
          const tono = !enviada
            ? 'border-stone/30'
            : esCorrecta
              ? 'border-penca bg-penca/10'
              : marcada
                ? 'border-terracotta bg-terracotta/10'
                : 'border-stone/20 opacity-60';

          return (
            <li key={opcion}>
              <label
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${tono} ${
                  enviada ? '' : 'cursor-pointer hover:border-stone'
                }`}
              >
                <input
                  type="checkbox"
                  name={`${id}-opcion`}
                  checked={marcada}
                  disabled={enviada}
                  onChange={() => alternar(indice)}
                  className="w-4 h-4 accent-penca shrink-0"
                />
                <span className="text-charcoal/85 font-light">{opcion}</span>
                {enviada && esCorrecta && (
                  <Check size={15} className="ml-auto shrink-0 text-penca" />
                )}
              </label>
            </li>
          );
        })}
      </ul>

      {!enviada && (
        <button
          onClick={enviar}
          disabled={marcadas.length === 0}
          className={`${BOTON} mt-5 bg-charcoal text-cream border-charcoal hover:bg-earth disabled:opacity-40`}
        >
          {t('libro.comprobar')}
        </button>
      )}
    </Envoltura>
  );
}

/* ------------------------------------------------------------------ */
/* Deslizador                                                           */
/* ------------------------------------------------------------------ */

function Deslizador({
  meta,
  texto,
  onResponder,
}: {
  meta: Extract<ActividadMeta, { tipo: 'deslizador' }>;
  texto: ActividadTexto;
  onResponder: (correcta: boolean) => void;
}) {
  const id = useId();
  const [valor, setValor] = useState(meta.inicial);
  const [confirmado, setConfirmado] = useState(false);

  const dentro = valor >= meta.aciertoMin && valor <= meta.aciertoMax;
  const tramo = valor < meta.aciertoMin ? 0 : dentro ? 1 : 2;
  const leyenda = texto.tramos?.[tramo] ?? '';
  const estado: Estado = !confirmado ? 'sin-responder' : dentro ? 'acierto' : 'fallo';

  // The slider is continuous, so it settles rather than being submitted: land
  // inside the band and it confirms itself.
  function mover(nuevo: number) {
    setValor(nuevo);
    if (!confirmado && nuevo >= meta.aciertoMin && nuevo <= meta.aciertoMax) {
      setConfirmado(true);
      onResponder(true);
    }
  }

  return (
    <Envoltura estado={estado} explicacion={confirmado ? texto.explicacion : ''}>
      <Pregunta>{texto.pregunta}</Pregunta>

      <div className="mt-6">
        <Ilustracion
          ilustracion={meta.ilustracion}
          valor={valor}
          aciertoMin={meta.aciertoMin}
          aciertoMax={meta.aciertoMax}
          descripcion={texto.pregunta}
        />
      </div>

      <label htmlFor={id} className="sr-only">
        {texto.pregunta}
      </label>
      <input
        id={id}
        type="range"
        min={meta.min}
        max={meta.max}
        value={valor}
        onChange={(evento) => mover(Number(evento.target.value))}
        className="w-full mt-6 accent-penca"
      />

      <div className="flex items-baseline justify-between gap-4 mt-3">
        <span
          className={`font-fraunces text-2xl transition-colors duration-300 ${
            dentro ? 'text-penca' : 'text-charcoal'
          }`}
        >
          {valor}
          {texto.unidad ? ` ${texto.unidad}` : ''}
        </span>
        <span className="text-stone text-sm font-light text-right max-w-sm">{leyenda}</span>
      </div>
    </Envoltura>
  );
}

/* ------------------------------------------------------------------ */
/* Clasificar                                                           */
/* ------------------------------------------------------------------ */

function Clasificar({
  meta,
  texto,
  onResponder,
}: {
  meta: Extract<ActividadMeta, { tipo: 'clasificar' }>;
  texto: ActividadTexto;
  onResponder: (correcta: boolean) => void;
}) {
  const { t } = useTranslation();
  const [asignadas, setAsignadas] = useState<readonly (0 | 1 | null)[]>(
    () => meta.columnas.map(() => null),
  );
  const [enviada, setEnviada] = useState(false);

  const items = texto.items ?? [];
  const grupos = texto.grupos ?? ['', ''];
  const completa = asignadas.every((valor) => valor !== null);
  const acierto = asignadas.every((valor, i) => valor === meta.columnas[i]);
  const estado: Estado = !enviada ? 'sin-responder' : acierto ? 'acierto' : 'fallo';

  function asignar(indice: number, columna: 0 | 1) {
    if (enviada) return;
    setAsignadas((previas) => previas.map((valor, i) => (i === indice ? columna : valor)));
  }

  return (
    <Envoltura
      estado={estado}
      explicacion={texto.explicacion}
      onReintentar={() => {
        setEnviada(false);
        setAsignadas(meta.columnas.map(() => null));
      }}
    >
      <Pregunta>{texto.pregunta}</Pregunta>

      <ul className="mt-5 space-y-2">
        {items.map((item, indice) => {
          const elegida = asignadas[indice];
          const correcta = enviada && elegida === meta.columnas[indice];

          return (
            <li
              key={item}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                !enviada
                  ? 'border-stone/30'
                  : correcta
                    ? 'border-penca bg-penca/10'
                    : 'border-terracotta bg-terracotta/10'
              }`}
            >
              <span className="text-charcoal/85 font-light flex-1">{item}</span>

              <span className="flex gap-2 shrink-0">
                {([0, 1] as const).map((columna) => {
                  const activa = elegida === columna;
                  const debiaSer = enviada && meta.columnas[indice] === columna;

                  return (
                    <button
                      key={columna}
                      onClick={() => asignar(indice, columna)}
                      disabled={enviada}
                      aria-pressed={activa}
                      aria-label={`${item}: ${grupos[columna]}`}
                      className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${
                        debiaSer
                          ? 'bg-penca text-cream border-penca'
                          : activa
                            ? 'bg-charcoal text-cream border-charcoal'
                            : 'bg-cream text-charcoal/70 border-stone/40 hover:border-charcoal disabled:opacity-50'
                      }`}
                    >
                      {grupos[columna]}
                    </button>
                  );
                })}
              </span>
            </li>
          );
        })}
      </ul>

      {!enviada && (
        <button
          onClick={() => {
            setEnviada(true);
            onResponder(acierto);
          }}
          disabled={!completa}
          className={`${BOTON} mt-5 bg-charcoal text-cream border-charcoal hover:bg-earth disabled:opacity-40`}
        >
          {t('libro.comprobar')}
        </button>
      )}
    </Envoltura>
  );
}

/* ------------------------------------------------------------------ */
/* Dispatcher                                                           */
/* ------------------------------------------------------------------ */

export default function Actividad({ id }: { id: string }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { registrar } = useProgresoLibro();

  const meta = ACTIVIDADES[id];
  const texto = libroTexto(language).actividades[id];

  if (!meta || !texto) return null;

  const responder = (correcta: boolean) => registrar(id, correcta);

  return (
    <Reveal>
      <section aria-label={t('libro.actividad')}>
        {(meta.tipo === 'verdaderoFalso' || meta.tipo === 'siNo') && (
          <DosBotones
            meta={meta}
            texto={texto}
            etiquetas={
              meta.tipo === 'verdaderoFalso'
                ? [t('libro.verdadero'), t('libro.falso')]
                : [t('libro.si'), t('libro.no')]
            }
            onResponder={responder}
          />
        )}
        {meta.tipo === 'opcionMultiple' && (
          <OpcionMultiple meta={meta} texto={texto} onResponder={responder} />
        )}
        {meta.tipo === 'deslizador' && (
          <Deslizador meta={meta} texto={texto} onResponder={responder} />
        )}
        {meta.tipo === 'clasificar' && (
          <Clasificar meta={meta} texto={texto} onResponder={responder} />
        )}
      </section>
    </Reveal>
  );
}
