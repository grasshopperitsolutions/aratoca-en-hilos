import { Lightbulb, Wrench } from 'lucide-react';

import Reveal from '../Reveal';
import type { CalloutTexto } from '../../types/libro';

/**
 * The manuscript's pull-out boxes.
 *
 * Two kinds, and they are not interchangeable: "¿Sabías que?" is a piece of
 * context for a general reader, while "Consejo de taller" is practical advice
 * aimed at someone actually working the fibre. They are styled differently so a
 * reader can tell at a glance which one is talking to them — moss for context,
 * terracotta for advice.
 *
 * Rendered as <aside>, since they sit outside the main argument of the chapter.
 */
const ESTILOS = {
  sabias: {
    icon: Lightbulb,
    box: 'bg-moss/15 border-moss/40',
    accent: 'text-penca',
  },
  consejo: {
    icon: Wrench,
    box: 'bg-terracotta/5 border-terracotta/30',
    accent: 'text-terracotta',
  },
} as const;

const ETIQUETAS: Record<CalloutTexto['tipo'], { es: string; en: string }> = {
  sabias: { es: '¿Sabías que?', en: 'Did you know?' },
  consejo: { es: 'Consejo de taller', en: 'Workshop tip' },
};

export function Callout({
  callout,
  language,
}: {
  callout: CalloutTexto;
  language: 'es' | 'en';
}) {
  const { icon: Icon, box, accent } = ESTILOS[callout.tipo];

  return (
    <Reveal>
      <aside className={`my-10 rounded-tl-3xl rounded-br-3xl border p-8 md:p-10 ${box}`}>
        <p
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${accent}`}
        >
          <Icon size={15} aria-hidden="true" />
          {ETIQUETAS[callout.tipo][language]}
        </p>
        <h3 className="font-fraunces text-xl md:text-2xl text-charcoal mt-3">{callout.titulo}</h3>
        <p className="text-charcoal/75 leading-relaxed font-light mt-3">{callout.texto}</p>
      </aside>
    </Reveal>
  );
}

export default function Callouts({
  callouts,
  language,
}: {
  callouts: readonly CalloutTexto[] | undefined;
  language: 'es' | 'en';
}) {
  if (!callouts || callouts.length === 0) return null;

  return (
    <>
      {callouts.map((callout) => (
        <Callout key={callout.titulo} callout={callout} language={language} />
      ))}
    </>
  );
}
