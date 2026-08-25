import { useState, type FormEvent } from 'react';
import { CircleAlert, CircleCheck, Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { COMPANY, FULL_ADDRESS, MAILTO_URL, TEL_URL, WHATSAPP_URL } from '../content/company';
import { useLanguage } from '../i18n/languageContext';
import {
  CONTACT_LIMITS,
  THROTTLED_ERROR_NAME,
  type ContactoInput,
} from '../services/contactLimits';

type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldErrors = Partial<Record<keyof ContactoInput, string>>;

const EMPTY_FORM = { nombre: '', email: '', telefono: '', mensaje: '' };

/** Deliberately loose — the aim is to catch typos, not to police valid addresses. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]{5,}$/;

function validate(form: typeof EMPTY_FORM): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.nombre.trim()) errors.nombre = 'nameRequired';
  else if (form.nombre.trim().length > CONTACT_LIMITS.nameMax) errors.nombre = 'nameTooLong';

  if (!form.email.trim()) errors.email = 'emailRequired';
  else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'emailInvalid';

  if (form.telefono.trim() && !PHONE_PATTERN.test(form.telefono.trim())) {
    errors.telefono = 'phoneInvalid';
  }

  const mensaje = form.mensaje.trim();
  if (!mensaje) errors.mensaje = 'messageRequired';
  else if (mensaje.length < CONTACT_LIMITS.messageMin) errors.mensaje = 'messageTooShort';
  else if (mensaje.length > CONTACT_LIMITS.messageMax) errors.mensaje = 'messageTooLong';

  return errors;
}

const FIELD_CLASSES =
  'w-full rounded-lg border border-stone/50 bg-cream px-4 py-3 text-charcoal placeholder:text-stone/70 focus:border-penca focus:outline-none focus:ring-1 focus:ring-penca transition-colors';

export default function Contacto() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  /** Honeypot: invisible to people, irresistible to bots. */
  const [website, setWebsite] = useState('');

  function update(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Silently accept honeypot submissions so bots get no signal from the failure.
    if (website) {
      setStatus('success');
      return;
    }

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('sending');
    try {
      // Firestore is loaded here rather than at module scope: the page renders
      // from prerendered HTML, and only an actual submission needs the SDK.
      const { enviarMensaje } = await import('../services/contacto');
      await enviarMensaje({ ...form, idioma: language });
      setForm(EMPTY_FORM);
      setStatus('success');
    } catch (error) {
      if (error instanceof Error && error.name === THROTTLED_ERROR_NAME) {
        setErrors({ mensaje: 'throttled' });
        setStatus('idle');
        return;
      }
      console.error('[contacto] submission failed:', error);
      setStatus('error');
    }
  }

  const fieldError = (field: keyof ContactoInput) =>
    errors[field] ? t(`contacto.form.errors.${errors[field]}`) : null;

  return (
    <>
      <PageHeader
        accent={t('contacto.accent')}
        title={t('contacto.title')}
        intro={t('contacto.intro')}
      />

      <section className="px-6 md:px-12 py-20 md:py-28 bg-cream">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          {/* Formulario */}
          <div className="lg:col-span-3">
            <Reveal direction="right">
              <h2 className="text-3xl font-fraunces text-earth mb-8">
                {t('contacto.form.title')}
              </h2>

              {status === 'success' ? (
                <div className="border border-penca/40 bg-moss/10 rounded-tl-3xl rounded-br-3xl p-8">
                  <div className="flex items-center gap-3 text-penca mb-3">
                    <CircleCheck size={24} />
                    <h3 className="text-xl font-fraunces">{t('contacto.form.successTitle')}</h3>
                  </div>
                  <p className="text-charcoal/70 font-light mb-6">
                    {t('contacto.form.successBody')}
                  </p>
                  <Button variant="outline" onClick={() => setStatus('idle')}>
                    {t('contacto.form.successAgain')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-bold uppercase tracking-widest text-charcoal mb-2">
                      {t('contacto.form.name')}
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      autoComplete="name"
                      maxLength={CONTACT_LIMITS.nameMax}
                      value={form.nombre}
                      onChange={(event) => update('nombre', event.target.value)}
                      placeholder={t('contacto.form.namePlaceholder')}
                      aria-invalid={Boolean(errors.nombre)}
                      className={FIELD_CLASSES}
                    />
                    {fieldError('nombre') && (
                      <p className="text-terracotta text-sm mt-2">{fieldError('nombre')}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold uppercase tracking-widest text-charcoal mb-2">
                        {t('contacto.form.email')}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={CONTACT_LIMITS.emailMax}
                        value={form.email}
                        onChange={(event) => update('email', event.target.value)}
                        placeholder={t('contacto.form.emailPlaceholder')}
                        aria-invalid={Boolean(errors.email)}
                        className={FIELD_CLASSES}
                      />
                      {fieldError('email') && (
                        <p className="text-terracotta text-sm mt-2">{fieldError('email')}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="telefono" className="block text-sm font-bold uppercase tracking-widest text-charcoal mb-2">
                        {t('contacto.form.phone')}
                      </label>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        autoComplete="tel"
                        maxLength={CONTACT_LIMITS.phoneMax}
                        value={form.telefono}
                        onChange={(event) => update('telefono', event.target.value)}
                        placeholder={t('contacto.form.phonePlaceholder')}
                        aria-invalid={Boolean(errors.telefono)}
                        className={FIELD_CLASSES}
                      />
                      {fieldError('telefono') && (
                        <p className="text-terracotta text-sm mt-2">{fieldError('telefono')}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-bold uppercase tracking-widest text-charcoal mb-2">
                      {t('contacto.form.message')}
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={6}
                      maxLength={CONTACT_LIMITS.messageMax}
                      value={form.mensaje}
                      onChange={(event) => update('mensaje', event.target.value)}
                      placeholder={t('contacto.form.messagePlaceholder')}
                      aria-invalid={Boolean(errors.mensaje)}
                      className={`${FIELD_CLASSES} resize-y`}
                    />
                    {fieldError('mensaje') && (
                      <p className="text-terracotta text-sm mt-2">{fieldError('mensaje')}</p>
                    )}
                  </div>

                  {/* Honeypot — hidden from people and from assistive technology. */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-start gap-3 border border-terracotta/40 bg-terracotta/5 rounded-lg p-4">
                      <CircleAlert size={20} className="text-terracotta shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-charcoal">{t('contacto.form.errorTitle')}</p>
                        <p className="text-charcoal/70 text-sm mt-1">
                          {t('contacto.form.errorBody', { email: COMPANY.email })}
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="text-stone text-sm font-light">{t('contacto.form.consent')}</p>

                  <Button type="submit" variant="primary" className={status === 'sending' ? 'opacity-70' : ''}>
                    <Send size={16} />
                    {status === 'sending' ? t('contacto.form.sending') : t('contacto.form.submit')}
                  </Button>
                </form>
              )}
            </Reveal>
          </div>

          {/* Datos directos */}
          <div className="lg:col-span-2">
            <Reveal direction="left" delay={200}>
              <div className="bg-moss/10 rounded-tl-3xl rounded-br-3xl p-8 md:p-10 space-y-8">
                <h2 className="text-2xl font-fraunces text-earth">{t('contacto.direct.title')}</h2>

                <div className="flex gap-4">
                  <Mail size={20} className="text-penca shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone mb-1">
                      {t('contacto.direct.emailLabel')}
                    </p>
                    <a href={MAILTO_URL} className="text-charcoal hover:text-terracotta transition-colors break-all">
                      {COMPANY.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone size={20} className="text-penca shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone mb-1">
                      {t('contacto.direct.phoneLabel')}
                    </p>
                    <a href={TEL_URL} className="text-charcoal hover:text-terracotta transition-colors">
                      {COMPANY.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MessageCircle size={20} className="text-penca shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone mb-1">
                      {t('contacto.direct.whatsappLabel')}
                    </p>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-charcoal hover:text-terracotta transition-colors"
                    >
                      {t('contacto.direct.whatsappAction')}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MapPin size={20} className="text-penca shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone mb-1">
                      {t('contacto.direct.addressLabel')}
                    </p>
                    <p className="text-charcoal">{FULL_ADDRESS}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock size={20} className="text-penca shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone mb-1">
                      {t('contacto.direct.hoursLabel')}
                    </p>
                    <p className="text-charcoal">{t('contacto.direct.hoursValue')}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
