import { Camera } from 'lucide-react';

import { ASSETS, aspectRatio } from '../../content/libro/estructura';
import { libroTexto } from '../../content/libro';
import { useLanguage } from '../../i18n/languageContext';
import type { AssetTag } from '../../types/libro';

/**
 * One catalogued photograph, with its caption.
 *
 * No photography has been delivered yet, so the placeholder branch is the one
 * that actually renders today. It names the asset tag from the client's own
 * catalogue and shows the brief, which makes an unshot slot self-explanatory in
 * review — far more useful than a broken image or an empty gap, and it doubles
 * as the shot list when the client walks the page.
 */
export default function AssetFigure({
  tag,
  priority = false,
  className = '',
}: {
  tag: AssetTag;
  /** Skip lazy-loading for an image above the fold. */
  priority?: boolean;
  className?: string;
}) {
  const { language } = useLanguage();
  const meta = ASSETS[tag];
  const texto = libroTexto(language).assets[tag];

  return (
    <figure className={`my-12 ${className}`}>
      {meta.archivo ? (
        <img
          src={meta.archivo}
          alt={texto.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full rounded-tl-3xl rounded-br-3xl object-cover"
          style={{ aspectRatio: aspectRatio(tag) }}
        />
      ) : (
        <div
          className="w-full rounded-tl-3xl rounded-br-3xl border border-dashed border-stone bg-moss/10 flex flex-col items-center justify-center gap-3 p-8 text-center"
          style={{ aspectRatio: aspectRatio(tag) }}
        >
          <Camera size={28} className="text-stone" aria-hidden="true" />
          <p className="font-fraunces text-lg text-earth max-w-md">{texto.titulo}</p>
          <p className="text-stone text-xs uppercase tracking-widest">
            {tag} · {meta.formato}
          </p>
        </div>
      )}

      <figcaption className="text-stone text-sm mt-4 font-light italic">
        {texto.pie}
      </figcaption>
    </figure>
  );
}
