/**
 * The book's sound, synthesised rather than sampled.
 *
 * Everything here is generated with the Web Audio API: there are no audio files
 * to download, nothing to license, and the whole layer costs a couple of
 * kilobytes of JavaScript. The palette is deliberately dry and papery — a page
 * turn is filtered noise shaped like a sheet of paper moving, not a whoosh.
 *
 * Browsers refuse to start an AudioContext before the visitor has interacted
 * with the page, so the context is created lazily on the first sound and
 * `resume()` is retried on every call. Opening the reader is itself a click,
 * which is what unlocks it in practice.
 */

export type Efecto = 'clic' | 'pagina' | 'abrir' | 'cerrar' | 'acierto' | 'fallo';

const CLAVE_SILENCIO = 'aratoca:libro:silencio';

let contexto: AudioContext | null = null;
let maestro: GainNode | null = null;
/** The looping bed. Held so it can be stopped when the reader closes. */
let ambiente: { fuentes: AudioScheduledSourceNode[]; salida: GainNode } | null = null;

/* ------------------------------------------------------------------ *
 * Mute state — a tiny store so React can subscribe with useSyncExternalStore
 * ------------------------------------------------------------------ */

let silenciado = leerPreferencia();
const oyentes = new Set<() => void>();

function leerPreferencia(): boolean {
  try {
    return window.localStorage.getItem(CLAVE_SILENCIO) === '1';
  } catch {
    // Private browsing, or storage blocked. Sound on is the better default.
    return false;
  }
}

export function estaSilenciado(): boolean {
  return silenciado;
}

/** Server-side and during hydration there is no preference to read. */
export function silencioServidor(): boolean {
  return false;
}

export function suscribirSilencio(alCambiar: () => void): () => void {
  oyentes.add(alCambiar);
  return () => oyentes.delete(alCambiar);
}

export function alternarSilencio(): void {
  silenciado = !silenciado;
  try {
    window.localStorage.setItem(CLAVE_SILENCIO, silenciado ? '1' : '0');
  } catch {
    // Not being able to remember the choice is not a reason to ignore it now.
  }
  if (maestro && contexto) {
    // A short ramp rather than a jump: an instant gain change clicks audibly.
    maestro.gain.cancelScheduledValues(contexto.currentTime);
    maestro.gain.setTargetAtTime(silenciado ? 0 : 1, contexto.currentTime, 0.05);
  }
  oyentes.forEach((oyente) => {
    oyente();
  });
}

/* ------------------------------------------------------------------ *
 * Context
 * ------------------------------------------------------------------ */

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!contexto) {
    const Constructor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Constructor) return null;
    try {
      contexto = new Constructor();
    } catch {
      return null;
    }
    maestro = contexto.createGain();
    maestro.gain.value = silenciado ? 0 : 1;
    maestro.connect(contexto.destination);
  }
  if (contexto.state === 'suspended') void contexto.resume();
  return contexto;
}

/**
 * A buffer of white noise, the raw material for every papery sound here.
 * Built once and reused — filling it is the expensive part.
 */
let ruido: AudioBuffer | null = null;
function bufferRuido(ctx: AudioContext): AudioBuffer {
  if (ruido && ruido.sampleRate === ctx.sampleRate) return ruido;
  const largo = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, largo, ctx.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < largo; i += 1) datos[i] = Math.random() * 2 - 1;
  ruido = buffer;
  return buffer;
}

/* ------------------------------------------------------------------ *
 * Effects
 * ------------------------------------------------------------------ */

/** Filtered noise with an envelope: the shape every paper sound is made from. */
function soplo(
  ctx: AudioContext,
  destino: AudioNode,
  {
    duracion,
    desde,
    hasta,
    pico,
    q = 1,
    retraso = 0,
  }: {
    duracion: number;
    desde: number;
    hasta: number;
    pico: number;
    q?: number;
    retraso?: number;
  },
) {
  const inicio = ctx.currentTime + retraso;
  const fuente = ctx.createBufferSource();
  fuente.buffer = bufferRuido(ctx);
  fuente.loop = true;

  const filtro = ctx.createBiquadFilter();
  filtro.type = 'bandpass';
  filtro.Q.value = q;
  filtro.frequency.setValueAtTime(desde, inicio);
  filtro.frequency.exponentialRampToValueAtTime(Math.max(hasta, 40), inicio + duracion);

  const sobre = ctx.createGain();
  sobre.gain.setValueAtTime(0.0001, inicio);
  sobre.gain.exponentialRampToValueAtTime(pico, inicio + duracion * 0.25);
  sobre.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);

  fuente.connect(filtro).connect(sobre).connect(destino);
  fuente.start(inicio);
  fuente.stop(inicio + duracion + 0.05);
}

/** A short pitched body, for the wooden knock under a click. */
function golpe(
  ctx: AudioContext,
  destino: AudioNode,
  { frecuencia, duracion, pico }: { frecuencia: number; duracion: number; pico: number },
) {
  const inicio = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frecuencia, inicio);
  osc.frequency.exponentialRampToValueAtTime(frecuencia * 0.6, inicio + duracion);

  const sobre = ctx.createGain();
  sobre.gain.setValueAtTime(0.0001, inicio);
  sobre.gain.exponentialRampToValueAtTime(pico, inicio + 0.008);
  sobre.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);

  osc.connect(sobre).connect(destino);
  osc.start(inicio);
  osc.stop(inicio + duracion + 0.02);
}

export function reproducir(efecto: Efecto): void {
  if (silenciado) return;
  const ctx = audio();
  if (!ctx || !maestro) return;

  switch (efecto) {
    case 'clic':
      golpe(ctx, maestro, { frecuencia: 320, duracion: 0.05, pico: 0.05 });
      soplo(ctx, maestro, { duracion: 0.05, desde: 2600, hasta: 1400, pico: 0.03, q: 0.9 });
      break;

    // Two passes: the sheet lifting, then settling. A single swoosh reads as
    // wind; the pair reads as paper.
    case 'pagina':
      soplo(ctx, maestro, { duracion: 0.19, desde: 900, hasta: 2600, pico: 0.075, q: 0.7 });
      soplo(ctx, maestro, {
        duracion: 0.16,
        desde: 2400,
        hasta: 700,
        pico: 0.055,
        q: 0.8,
        retraso: 0.13,
      });
      break;

    case 'abrir':
      golpe(ctx, maestro, { frecuencia: 150, duracion: 0.22, pico: 0.07 });
      soplo(ctx, maestro, { duracion: 0.42, desde: 500, hasta: 2000, pico: 0.06, q: 0.6 });
      break;

    case 'cerrar':
      soplo(ctx, maestro, { duracion: 0.2, desde: 1800, hasta: 400, pico: 0.06, q: 0.7 });
      golpe(ctx, maestro, { frecuencia: 120, duracion: 0.26, pico: 0.08 });
      break;

    // The two answer sounds are intervals rather than buzzes: this is a book
    // for schools, and a wrong answer should not feel like a punishment.
    case 'acierto':
      golpe(ctx, maestro, { frecuencia: 587, duracion: 0.16, pico: 0.045 });
      window.setTimeout(() => {
        if (!silenciado && maestro) golpe(ctx, maestro, { frecuencia: 880, duracion: 0.22, pico: 0.04 });
      }, 90);
      break;

    case 'fallo':
      golpe(ctx, maestro, { frecuencia: 300, duracion: 0.18, pico: 0.04 });
      window.setTimeout(() => {
        if (!silenciado && maestro) golpe(ctx, maestro, { frecuencia: 233, duracion: 0.26, pico: 0.035 });
      }, 100);
      break;
  }
}

/* ------------------------------------------------------------------ *
 * Ambience
 * ------------------------------------------------------------------ */

/**
 * The bed under the reader: dry highland wind off the canyon, with the fique
 * leaves moving in it.
 *
 * Two looping noise sources — one low and steady, one higher and slowly
 * swept by an LFO so the rustle breathes instead of sitting still. Kept very
 * quiet on purpose; it should register only when it stops.
 */
export function iniciarAmbiente(): void {
  const ctx = audio();
  if (!ctx || !maestro || ambiente) return;

  const salida = ctx.createGain();
  salida.gain.setValueAtTime(0.0001, ctx.currentTime);
  salida.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 3);
  salida.connect(maestro);

  // Low bed: the air itself.
  const viento = ctx.createBufferSource();
  viento.buffer = bufferRuido(ctx);
  viento.loop = true;
  const pasoBajo = ctx.createBiquadFilter();
  pasoBajo.type = 'lowpass';
  pasoBajo.frequency.value = 420;
  const gananciaViento = ctx.createGain();
  gananciaViento.gain.value = 0.8;
  viento.connect(pasoBajo).connect(gananciaViento).connect(salida);

  // Upper layer: leaves. The LFO sweep is what stops it sounding like static.
  const hojas = ctx.createBufferSource();
  hojas.buffer = bufferRuido(ctx);
  hojas.loop = true;
  const pasoBanda = ctx.createBiquadFilter();
  pasoBanda.type = 'bandpass';
  pasoBanda.frequency.value = 2200;
  pasoBanda.Q.value = 0.8;
  const gananciaHojas = ctx.createGain();
  gananciaHojas.gain.value = 0.25;

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.08;
  const profundidad = ctx.createGain();
  profundidad.gain.value = 900;
  lfo.connect(profundidad).connect(pasoBanda.frequency);

  hojas.connect(pasoBanda).connect(gananciaHojas).connect(salida);

  viento.start();
  hojas.start();
  lfo.start();

  ambiente = { fuentes: [viento, hojas, lfo], salida };
}

export function detenerAmbiente(): void {
  if (!ambiente || !contexto) return;
  const { fuentes, salida } = ambiente;
  ambiente = null;

  const fin = contexto.currentTime + 0.6;
  salida.gain.cancelScheduledValues(contexto.currentTime);
  salida.gain.setValueAtTime(Math.max(salida.gain.value, 0.0001), contexto.currentTime);
  salida.gain.exponentialRampToValueAtTime(0.0001, fin);
  fuentes.forEach((fuente) => {
    try {
      fuente.stop(fin + 0.05);
    } catch {
      // Already stopped; nothing to do.
    }
  });
}
