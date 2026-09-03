import { ExternalLink, Leaf, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import SocialGlyph from '../components/SocialGlyph';
import {
  NETWORK_LABELS,
  detectNetwork,
  hostLabel,
  normaliseUrl,
  telUrl,
  whatsappUrl,
} from '../content/social';
import { useArtesanos } from '../hooks/useArtesanos';
import { useLanguage } from '../i18n/languageContext';
import { localised, type Artesano } from '../types/content';

const CONTACT_LINK =
  'inline-flex items-center gap-2 text-charcoal/80 hover:text-terracotta transition-colors';

function ContactBlock({ artesano }: { artesano: Artesano }) {
  const { t } = useTranslation();

  const hasContact =
    artesano.telefonos.length > 0 || artesano.correos.length > 0 || artesano.mapaUrl;

  if (!hasContact) return null;

  return (
    <ul className="space-y-3 mt-6 text-sm">
      {artesano.telefonos.map((telefono) => (
        <li key={telefono.numero} className="flex items-center gap-4 flex-wrap">
          <a href={telUrl(telefono.numero)} className={CONTACT_LINK}>
            <Phone size={16} className="text-penca shrink-0" />
            {telefono.numero}
          </a>
          {telefono.whatsapp && (
            <a
              href={whatsappUrl(telefono.numero)}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-penca hover:text-terracotta transition-colors"
            >
              <MessageCircle size={14} />
              {t('artesanos.contacto.whatsapp')}
            </a>
          )}
        </li>
      ))}

      {artesano.correos.map((correo) => (
        <li key={correo}>
          <a href={`mailto:${correo}`} className={`${CONTACT_LINK} break-all`}>
            <Mail size={16} className="text-penca shrink-0" />
            {correo}
          </a>
        </li>
      ))}

      {artesano.mapaUrl && (
        <li>
          <a
            href={normaliseUrl(artesano.mapaUrl)}
            target="_blank"
            rel="noreferrer noopener"
            className={CONTACT_LINK}
          >
            <MapPin size={16} className="text-penca shrink-0" />
            {t('artesanos.contacto.mapa')}
          </a>
        </li>
      )}
    </ul>
  );
}

function LinksBlock({ artesano }: { artesano: Artesano }) {
  if (artesano.enlaces.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mt-6">
      {artesano.enlaces.map((enlace) => {
        const href = normaliseUrl(enlace.url);
        const network = detectNetwork(enlace.url);

        // A recognised network becomes an icon; anything else keeps its text,
        // because a globe icon alone tells a visitor nothing.
        if (network) {
          return (
            <a
              key={enlace.url}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={NETWORK_LABELS[network]}
              title={NETWORK_LABELS[network]}
              className="w-10 h-10 rounded-full border border-stone flex items-center justify-center text-earth hover:bg-earth hover:text-cream hover:border-transparent transition-all"
            >
              <SocialGlyph network={network} size={18} />
            </a>
          );
        }

        return (
          <a
            key={enlace.url}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-stone px-4 py-2 text-xs uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-cream hover:border-transparent transition-all"
          >
            <ExternalLink size={14} />
            {enlace.etiqueta || hostLabel(enlace.url)}
          </a>
        );
      })}
    </div>
  );
}

/**
 * One artisan, laid out as an alternating editorial spread.
 *
 * Odd entries (the 1st, 3rd, …) put the portrait on the left and the details on
 * the right; even entries mirror it. The description always sits directly under
 * the portrait rather than with the details, which keeps the reading column
 * narrow and lets the contact block stay compact beside it.
 *
 * On mobile the grid collapses and everything stacks in source order —
 * portrait, description, details — so the mirroring never scrambles the order.
 */
function ArtesanoEntry({ artesano, index }: { artesano: Artesano; index: number }) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const imageFirst = index % 2 === 0;
  const oficio = localised(artesano.oficio, language);
  const bio = localised(artesano.bio, language);

  return (
    <article className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
      {/* Portrait + description */}
      <Reveal
        direction={imageFirst ? 'right' : 'left'}
        className={imageFirst ? '' : 'md:order-2'}
      >
        <div className="relative overflow-hidden rounded-tl-3xl rounded-br-3xl bg-earth group">
          {artesano.fotoUrl ? (
            <>
              <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors z-10 duration-500" />
              <img
                src={artesano.fotoUrl}
                alt={t('artesanos.photoAlt', { name: artesano.nombre })}
                loading="lazy"
                className="w-full h-[26rem] object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[800ms]"
              />
            </>
          ) : (
            <div className="w-full h-[26rem] flex items-center justify-center bg-moss/30">
              <Leaf size={64} className="text-earth/40" />
            </div>
          )}
        </div>

        {bio && (
          <p className="text-charcoal/70 leading-relaxed mt-6 font-light">{bio}</p>
        )}
      </Reveal>

      {/* Name, craft, contact and links */}
      <Reveal
        direction={imageFirst ? 'left' : 'right'}
        delay={150}
        className={imageFirst ? '' : 'md:order-1'}
      >
        <div className="md:pt-6">
          <h2 className="text-3xl md:text-4xl font-fraunces text-charcoal mb-2">
            {artesano.nombre}
          </h2>
          {oficio && (
            <span className="text-sm text-penca uppercase tracking-widest">{oficio}</span>
          )}

          <ContactBlock artesano={artesano} />
          <LinksBlock artesano={artesano} />
        </div>
      </Reveal>
    </article>
  );
}

export default function Artesanos() {
  const { t } = useTranslation();
  const { path } = useLanguage();
  const { artesanos } = useArtesanos();

  return (
    <>
      <PageHeader
        accent={t('artesanos.accent')}
        title={t('artesanos.title')}
        intro={t('artesanos.intro')}
        note={t('artesanos.note')}
      />

      <section className="px-6 md:px-12 py-20 md:py-28 bg-cream">
        <div className="max-w-6xl mx-auto">
          {artesanos.length === 0 ? (
            <Reveal>
              <p className="text-center text-stone text-lg font-light max-w-xl mx-auto">
                {t('artesanos.empty')}
              </p>
            </Reveal>
          ) : (
            <div className="space-y-24 md:space-y-32">
              {artesanos.map((artesano, index) => (
                <ArtesanoEntry key={artesano.id} artesano={artesano} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <Reveal direction="up">
            <div className="bg-penca rounded-br-[5rem] rounded-tl-[5rem] p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-fraunces text-cream mb-4">
                {t('artesanos.cta.title')}
              </h2>
              <p className="text-cream/80 text-lg mb-8 font-light max-w-xl mx-auto">
                {t('artesanos.cta.text')}
              </p>
              <Button to={path('contacto')} variant="primary">
                {t('artesanos.cta.button')}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
