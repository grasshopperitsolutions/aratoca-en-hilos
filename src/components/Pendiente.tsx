import { AlertTriangle, ImageOff } from 'lucide-react';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { MOSTRAR_PENDIENTES } from '../content/pendientes';

/**
 * TEMPORARY — pre-handover scaffolding. See `content/pendientes.ts`.
 *
 * Marks something the client still owes: a detail the site publishes with a
 * placeholder standing in for it, or a photograph the layout was designed
 * around and does not have.
 *
 * The badge carries both a styled tooltip and a native `title`. The styled one
 * is the one people will see; the native one is the one that survives a
 * container with `overflow: hidden`, a touch screen, and a screen reader.
 */

const AVISO =
  'rounded-md border border-dashed border-terracotta/70 bg-terracotta/10 text-terracotta';

function Globo({ texto }: { texto: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-lg bg-charcoal px-3 py-2 text-left text-xs font-normal normal-case tracking-normal leading-snug text-cream opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {texto}
    </span>
  );
}

/**
 * Wraps a value that is still a placeholder. The value itself stays visible —
 * the client asked to see the site as it stands — with the badge beside it
 * saying what is missing.
 */
export default function Pendiente({
  children,
  detalle,
  si = true,
}: {
  children?: ReactNode;
  /** Already-translated name of the missing detail. */
  detalle: string;
  /** Whether this detail is in fact still missing. Passing the condition rather
   *  than branching at every call site keeps the badge from being forgotten on
   *  one of them, and keeps the markup identical either way. */
  si?: boolean;
}) {
  const { t } = useTranslation();
  if (!si || !MOSTRAR_PENDIENTES) return <>{children}</>;

  const texto = t('pendiente.aviso', { detalle });

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {children}
      <span
        tabIndex={0}
        title={texto}
        aria-label={texto}
        className={`group relative inline-flex items-center gap-1 ${AVISO} px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider outline-none focus-visible:ring-2 focus-visible:ring-terracotta`}
      >
        <AlertTriangle size={11} aria-hidden="true" />
        {t('pendiente.etiqueta')}
        <Globo texto={texto} />
      </span>
    </span>
  );
}

/**
 * Stands in for a photograph the client has not sent. Keeps the slot's shape so
 * the layout still reads correctly, and names the shot that belongs there.
 */
export function ImagenPendiente({
  detalle,
  tono = 'claro',
  className = '',
}: {
  /** Already-translated description of the photograph that belongs here. */
  detalle: string;
  /** `contraste` for a slot sitting on a dark section, where a tinted panel
   *  would disappear into the background instead of announcing itself. */
  tono?: 'claro' | 'contraste';
  className?: string;
}) {
  const { t } = useTranslation();
  const texto = t('pendiente.imagen', { detalle });

  // The palette is chosen here rather than passed in: two competing `bg-*`
  // utilities are resolved by their order in the compiled stylesheet, not by
  // the order they are written, so a caller-supplied background silently loses.
  const fondo =
    tono === 'contraste'
      ? 'border-terracotta bg-cream'
      : 'border-terracotta/50 bg-terracotta/5';

  return (
    <div
      tabIndex={0}
      title={texto}
      aria-label={texto}
      className={`group relative flex flex-col items-center justify-center gap-3 border-2 border-dashed p-6 text-center outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${fondo} ${className}`}
    >
      <ImageOff size={28} className="text-terracotta" aria-hidden="true" />
      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-terracotta">
        {t('pendiente.etiquetaFoto')}
      </span>
      <span className="text-xs font-light leading-snug text-charcoal/80">{detalle}</span>
      <Globo texto={texto} />
    </div>
  );
}
