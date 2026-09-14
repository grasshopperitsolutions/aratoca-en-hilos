import { Fragment } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Reveal from './Reveal';
import { MOSTRAR_PENDIENTES, PENDIENTES_LEGALES } from '../content/pendientes';

interface LegalDocumentProps {
  /** Translation namespace: `terminos` or `privacidad`. */
  namespace: string;
  /** Section ids in display order. */
  sections: readonly string[];
  /** Values interpolated into the copy (company name, NIT, email…). */
  values: Record<string, string>;
  /** Localised "last updated" line. */
  updated: string;
  intro: string;
}

/** Splits a body into paragraphs on blank lines, keeping single breaks intact. */
function Paragraphs({ body }: { body: string }) {
  return (
    <>
      {body.split('\n\n').map((paragraph, index) => (
        <p key={index} className="text-charcoal/80 leading-relaxed">
          {paragraph.split('\n').map((line, lineIndex, lines) => (
            <Fragment key={lineIndex}>
              {line}
              {lineIndex < lines.length - 1 && <br />}
            </Fragment>
          ))}
        </p>
      ))}
    </>
  );
}

/**
 * Renders a legal document from translation keys. Both Términos and Privacidad
 * share this so the two documents can never drift apart in layout or typography.
 */
export default function LegalDocument({
  namespace,
  sections,
  values,
  updated,
  intro,
}: LegalDocumentProps) {
  const { t } = useTranslation();

  return (
    <section className="px-6 md:px-12 py-16 md:py-24 bg-cream">
      <article className="max-w-3xl mx-auto">
        {/* TEMPORARY — pre-handover scaffolding; see `content/pendientes.ts`.
            These documents quote entity details that are still placeholders, and
            a legal notice built on a placeholder NIT is not a legal notice. The
            values stay visible, but the page says so at the top. */}
        {MOSTRAR_PENDIENTES && PENDIENTES_LEGALES.length > 0 && (
          <div
            role="note"
            className="mb-12 flex gap-3 rounded-lg border border-dashed border-terracotta/70 bg-terracotta/10 p-5 text-sm leading-relaxed text-charcoal/85"
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-terracotta" aria-hidden="true" />
            <p>
              {t('pendiente.avisoLegal', {
                campos: PENDIENTES_LEGALES.map((campo) =>
                  t(`pendiente.campos.${campo}`),
                ).join(', '),
              })}
            </p>
          </div>
        )}

        <Reveal>
          <p className="text-sm uppercase tracking-widest text-stone mb-8">{updated}</p>
          <p className="text-lg text-charcoal/80 leading-relaxed mb-16 font-light">
            {intro}
          </p>
        </Reveal>

        <div className="space-y-12">
          {sections.map((section) => (
            <Reveal key={section}>
              <div className="border-t border-stone/20 pt-8 space-y-4">
                <h2 className="text-2xl font-fraunces text-earth">
                  {t(`${namespace}.sections.${section}.title`, values)}
                </h2>
                <Paragraphs body={t(`${namespace}.sections.${section}.body`, values)} />
              </div>
            </Reveal>
          ))}
        </div>
      </article>
    </section>
  );
}
