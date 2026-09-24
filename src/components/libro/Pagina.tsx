import { useTranslation } from 'react-i18next';

import Ajustar from './Ajustar';
import Bloques from './Bloques';
import { FOTO_SRC, LAMINAS, PARTE_DE_CAPITULO } from '../../content/libro/estructura';
import { useEscudos } from '../../hooks/useEscudos';
import { libroTexto } from '../../content/libro';
import { ACTIVIDADES_EN_ORDEN } from '../../content/libro/estructura';
import { resumirProgreso, useProgresoLibro } from '../../hooks/useProgresoLibro';
import { useLanguage } from '../../i18n/languageContext';
import type { PaginaLibro } from './paginar';

/**
 * One page of the reader.
 *
 * Everything is real DOM, which is the whole reason the fold moved off WebGL:
 * a checkbox is a checkbox, text is selectable, and a screen reader can follow
 * the page. Page kinds mirror the printed edition's own layouts.
 */
export default function Pagina({
  pagina,
  onCerrar,
}: {
  pagina: PaginaLibro;
  /** Only the closing filler page offers a way out; the rest ignore it. */
  onCerrar?: () => void;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const libro = libroTexto(language);
  const escudos = useEscudos();

  switch (pagina.tipo) {
    case 'portada':
      return (
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={FOTO_SRC.planta_fique_maguey}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/45 to-charcoal/85" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-8 py-10">
            <p className="text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] text-cream/85">
              {libro.editor}
            </p>
            <h1 className="font-fraunces font-bold text-cream text-3xl sm:text-5xl leading-[1.05] mt-6">
              {libro.titulo}
            </h1>
            <p className="text-cream/85 font-light italic mt-4 text-sm sm:text-lg max-w-sm">
              {libro.subtitulo}
            </p>
            <div className="flex items-center gap-4 bg-cream rounded-sm px-5 py-3 mt-10">
              <img src={escudos.aratoca} alt="" className="h-8 sm:h-10 w-auto" />
              <span className="w-px h-8 bg-stone/40" />
              <img src={escudos.ministerio} alt="" className="h-7 sm:h-9 w-auto" />
            </div>
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-cream/70 mt-8">
              {libro.edicion}
            </p>
          </div>
        </div>
      );

    case 'parte': {
      const parte = libro.partes[pagina.numero];
      return (
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={FOTO_SRC[parte.foto]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal/85 via-charcoal/55 to-charcoal/80" />
          <div className="relative h-full flex flex-col justify-center px-8 sm:px-12 py-10">
            <p className="text-xs uppercase tracking-[0.3em] text-fique">
              {t('libro.parte', { numero: pagina.numero })}
            </p>
            <h2 className="font-fraunces font-bold text-cream text-3xl sm:text-5xl leading-tight mt-4">
              {parte.titulo}
            </h2>
            <p className="text-cream/80 font-light mt-5 max-w-md leading-relaxed text-sm sm:text-base">
              {parte.subtitulo}
            </p>
          </div>
        </div>
      );
    }

    case 'lamina': {
      const lamina = libro.laminas[pagina.clave as keyof typeof LAMINAS];
      return (
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={FOTO_SRC[lamina.foto]}
            alt={lamina.pie}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/92 via-charcoal/70 to-transparent px-8 sm:px-10 pt-20 pb-8">
            <h3 className="font-fraunces text-cream text-xl sm:text-2xl">{lamina.titulo}</h3>
            <p className="text-cream/80 font-light text-sm mt-2 leading-relaxed">{lamina.pie}</p>
          </div>
        </div>
      );
    }

    case 'capitulo': {
      const capitulo = libro.capitulos[pagina.numero];
      const parte = libro.partes[PARTE_DE_CAPITULO[pagina.numero]];
      return (
        <div className="h-full flex flex-col justify-center px-8 sm:px-12 py-10">
          <p className="text-xs font-bold uppercase tracking-widest text-penca">
            {parte.titulo}
          </p>
          <p className="text-xs uppercase tracking-widest text-stone mt-2">{capitulo.ordinal}</p>
          <h2 className="font-fraunces font-bold text-charcoal text-2xl sm:text-4xl leading-tight mt-6">
            {capitulo.titulo}
          </h2>
          <span className="block w-16 h-1 bg-terracotta mt-8" />
        </div>
      );
    }

    case 'contenido': {
      // A photograph always gets a page to itself (see `paginar.ts`), and on a
      // page-sized box a portrait shot laid out at full width is taller than
      // the page whatever it is scaled to. So it is bled to the edges and
      // captioned over the image, exactly as the plates are — which is what the
      // printed edition does with a full-page photograph anyway.
      const sola = pagina.bloques.length === 1 ? pagina.bloques[0] : null;
      if (sola?.tipo === 'foto') {
        return (
          <div className="relative h-full w-full overflow-hidden">
            <img
              src={FOTO_SRC[sola.foto]}
              alt={sola.pie}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/92 via-charcoal/70 to-transparent px-8 sm:px-10 pt-20 pb-8">
              <h3 className="font-fraunces text-cream text-xl sm:text-2xl">{sola.titulo}</h3>
              <p className="text-cream/80 font-light text-sm mt-2 leading-relaxed">{sola.pie}</p>
            </div>
          </div>
        );
      }

      return (
        <Ajustar className="px-7 sm:px-10 py-8">
          <Bloques bloques={pagina.bloques} />
        </Ajustar>
      );
    }

    case 'seccion': {
      // Presentación and Sinopsis carry an eyebrow; Fuentes and Créditos do not.
      const conOrdinal =
        pagina.clave === 'presentacion'
          ? libro.presentacion
          : pagina.clave === 'sinopsis'
            ? libro.sinopsis
            : null;
      const seccion =
        conOrdinal ?? (pagina.clave === 'fuentes' ? libro.fuentes : libro.creditos);

      return (
        <Ajustar className="px-7 sm:px-10 py-8">
          {pagina.inicio && (
            <header className="mb-6">
              {conOrdinal && (
                <p className="text-xs font-bold uppercase tracking-widest text-penca">
                  {conOrdinal.ordinal}
                </p>
              )}
              <h2 className="font-fraunces text-2xl sm:text-3xl text-charcoal mt-2">
                {seccion.titulo}
              </h2>
            </header>
          )}
          <Bloques bloques={pagina.bloques} />
          {pagina.clave === 'presentacion' && (
            <p className="text-xs uppercase tracking-widest text-stone mt-8">
              {libro.presentacion.firma}
            </p>
          )}
        </Ajustar>
      );
    }

    case 'glosario': {
      const grupo = libro.glosario.grupos[pagina.indice];
      return (
        <Ajustar className="px-7 sm:px-10 py-8">
          {pagina.indice === 0 && (
            <header className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-penca">
                {t('libro.glosario')}
              </p>
              <h2 className="font-fraunces text-2xl sm:text-3xl text-charcoal mt-2">
                {libro.glosario.titulo}
              </h2>
              <p className="text-charcoal/70 font-light leading-relaxed mt-4 text-sm">
                {libro.glosario.intro}
              </p>
            </header>
          )}
          <h3 className="font-fraunces text-xl text-earth mb-4">{grupo.titulo}</h3>
          <dl className="space-y-3">
            {grupo.terminos.map((termino) => (
              <div key={termino.termino} className="border-t border-stone/25 pt-3">
                <dt className="font-fraunces text-charcoal">{termino.termino}</dt>
                <dd className="text-charcoal/70 font-light text-sm leading-relaxed mt-1 text-justify hyphens-auto">
                  {termino.definicion}
                </dd>
              </div>
            ))}
          </dl>
        </Ajustar>
      );
    }

    case 'repaso':
      return (
        <Ajustar className="px-7 sm:px-10 py-8">
          {pagina.inicio && (
            <header className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-penca">
                {t('libro.glosario')}
              </p>
              <h2 className="font-fraunces text-2xl sm:text-3xl text-charcoal mt-2">
                {t('libro.repaso')}
              </h2>
              <p className="text-charcoal/70 font-light leading-relaxed mt-4 text-sm">
                {t('libro.repasoIntro')}
              </p>
            </header>
          )}
          <Bloques bloques={pagina.bloques} />
        </Ajustar>
      );

    case 'cierre':
      return <Cierre />;

    case 'enhorabuena':
      return <Enhorabuena onCerrar={onCerrar} />;

    case 'contracubierta':
      return (
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={FOTO_SRC.cultivo_fique}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/85" />
          <div className="relative h-full flex flex-col justify-between px-8 sm:px-10 py-10">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.25em] text-fique">
                {libro.editor}
              </p>
              <h2 className="font-fraunces text-cream text-xl sm:text-2xl leading-snug mt-4">
                {libro.subtitulo}
              </h2>
              {libro.contracubierta.parrafos.map((parrafo) => (
                <p
                  key={parrafo.slice(0, 30)}
                  className="text-cream/75 font-light text-sm leading-relaxed mt-4"
                >
                  {parrafo}
                </p>
              ))}
            </div>
            <div className="flex items-center gap-4 bg-cream rounded-sm px-4 py-2.5 self-start">
              <img src={escudos.aratoca} alt="" className="h-7 w-auto" />
              <span className="w-px h-6 bg-stone/40" />
              <img src={escudos.ministerio} alt="" className="h-6 w-auto" />
            </div>
          </div>
        </div>
      );
  }
}

/** The closing page: what the reader answered along the way. */
function Cierre() {
  const { language } = useLanguage();
  const libro = libroTexto(language);
  const { progreso, reiniciar } = useProgresoLibro();
  const { respondidas, aciertos, total } = resumirProgreso(progreso, ACTIVIDADES_EN_ORDEN);

  const resumen = libro.cierre.resumen
    .replace('{{respondidas}}', String(respondidas))
    .replace('{{aciertos}}', String(aciertos))
    .replace('{{total}}', String(total));

  return (
    <Ajustar className="min-h-full flex flex-col justify-center px-8 sm:px-12 py-10 text-center">
      <h2 className="font-fraunces text-2xl sm:text-3xl text-charcoal">{libro.cierre.titulo}</h2>
      <p className="text-charcoal/75 font-light leading-relaxed mt-5">{libro.cierre.intro}</p>

      <div className="mt-8 rounded-tl-3xl rounded-br-3xl bg-moss/15 border border-stone/25 p-6">
        {respondidas === 0 ? (
          <p className="text-charcoal/70 font-light text-sm">{libro.cierre.sinRespuestas}</p>
        ) : (
          <>
            <p className="font-fraunces text-3xl text-penca leading-none">
              {aciertos}/{total}
            </p>
            <p className="text-charcoal/70 font-light text-sm mt-3">{resumen}</p>
          </>
        )}
      </div>

      {respondidas > 0 && (
        <button
          onClick={reiniciar}
          className="mt-6 text-xs font-bold uppercase tracking-widest text-penca hover:text-terracotta transition-colors"
        >
          {libro.cierre.reiniciar}
        </button>
      )}
    </Ajustar>
  );
}

/**
 * The filler page.
 *
 * A leaf has two faces, so the book occasionally ends a page short of a whole
 * one. Rather than pad with a blank, that page says goodbye and offers the way
 * out — it is the last thing a reader sees before the back cover, and it is the
 * only page that knows why it exists.
 */
function Enhorabuena({ onCerrar }: { onCerrar?: () => void }) {
  const { language } = useLanguage();
  const { enhorabuena } = libroTexto(language);

  return (
    <Ajustar className="min-h-full flex flex-col justify-center items-center px-8 sm:px-12 py-10 text-center">
      <span className="block w-16 h-1 bg-terracotta" aria-hidden="true" />
      <h2 className="font-fraunces font-bold text-charcoal text-2xl sm:text-4xl leading-tight mt-8">
        {enhorabuena.titulo}
      </h2>
      <p className="text-charcoal/75 font-light leading-relaxed mt-6 max-w-sm">
        {enhorabuena.texto}
      </p>

      <button
        onClick={() => onCerrar?.()}
        className="mt-10 inline-flex items-center justify-center rounded-full bg-charcoal text-cream px-7 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-earth"
      >
        {enhorabuena.boton}
      </button>
    </Ajustar>
  );
}
