import { useState } from 'react';
import { CircleAlert, ExternalLink, ImageIcon, Plus, Trash2 } from 'lucide-react';

import MediaPicker, { type MediaSelection } from './MediaPicker';
import SocialGlyph from '../SocialGlyph';
import { NETWORK_LABELS, detectNetwork, hostLabel } from '../../content/social';
import type { ArtesanoInput } from '../../services/artesanos';
import type { ArtesanoErrors } from '../../services/artesanosAdmin';

const FIELD =
  'w-full rounded-lg border border-stone/50 bg-cream px-4 py-2.5 text-charcoal placeholder:text-stone/70 focus:border-penca focus:outline-none focus:ring-1 focus:ring-penca transition-colors';
const LABEL = 'block text-xs font-bold uppercase tracking-widest text-charcoal mb-2';
const ADD =
  'inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-penca hover:text-terracotta transition-colors';
const REMOVE = 'p-2 text-stone hover:text-terracotta shrink-0';

interface ArtesanoFormProps {
  form: ArtesanoInput;
  errors: ArtesanoErrors;
  onChange: (next: ArtesanoInput) => void;
}

export default function ArtesanoForm({ form, errors, onChange }: ArtesanoFormProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const set = <K extends keyof ArtesanoInput>(key: K, value: ArtesanoInput[K]) =>
    onChange({ ...form, [key]: value });

  function applySelection(selection: MediaSelection) {
    onChange({ ...form, fotoUrl: selection.url, fotoPath: selection.path });
  }

  const fieldError = (message?: string) =>
    message ? (
      <p className="flex items-center gap-2 text-terracotta text-sm mt-2">
        <CircleAlert size={14} />
        {message}
      </p>
    ) : null;

  return (
    <div className="space-y-8">
      {/* ---- Required ---- */}
      <section className="space-y-6">
        <h3 className="font-fraunces text-lg text-earth">Datos obligatorios</h3>

        <div>
          <label htmlFor="nombre" className={LABEL}>
            Nombre *
          </label>
          <input
            id="nombre"
            className={FIELD}
            value={form.nombre}
            onChange={(event) => set('nombre', event.target.value)}
          />
          {fieldError(errors.nombre)}
        </div>

        <div>
          <span className={LABEL}>Imagen *</span>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-moss/20 border border-stone/20 flex items-center justify-center shrink-0">
              {form.fotoUrl ? (
                <img src={form.fotoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={24} className="text-stone" />
              )}
            </div>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="rounded-full border border-charcoal px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-charcoal hover:text-cream transition-all"
            >
              {form.fotoUrl ? 'Cambiar imagen' : 'Elegir imagen'}
            </button>
            {form.fotoUrl && (
              <button
                type="button"
                onClick={() => onChange({ ...form, fotoUrl: '', fotoPath: '' })}
                className="text-sm text-stone hover:text-terracotta underline"
              >
                Quitar
              </button>
            )}
          </div>
          {fieldError(errors.foto)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="bio-es" className={LABEL}>
              Descripción (español) *
            </label>
            <textarea
              id="bio-es"
              rows={5}
              className={`${FIELD} resize-y`}
              value={form.bio.es}
              onChange={(event) => set('bio', { ...form.bio, es: event.target.value })}
            />
            {fieldError(errors.bio)}
          </div>
          <div>
            <label htmlFor="bio-en" className={LABEL}>
              Descripción (inglés)
            </label>
            <textarea
              id="bio-en"
              rows={5}
              className={`${FIELD} resize-y`}
              value={form.bio.en}
              onChange={(event) => set('bio', { ...form.bio, en: event.target.value })}
            />
            <p className="text-stone text-xs mt-2">
              Si se deja vacío, la página en inglés muestra la descripción en español.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Optional ---- */}
      <section className="space-y-6 border-t border-stone/20 pt-8">
        <h3 className="font-fraunces text-lg text-earth">Datos opcionales</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="oficio-es" className={LABEL}>
              Oficio (español)
            </label>
            <input
              id="oficio-es"
              className={FIELD}
              value={form.oficio.es}
              onChange={(event) => set('oficio', { ...form.oficio, es: event.target.value })}
            />
          </div>
          <div>
            <label htmlFor="oficio-en" className={LABEL}>
              Oficio (inglés)
            </label>
            <input
              id="oficio-en"
              className={FIELD}
              value={form.oficio.en}
              onChange={(event) => set('oficio', { ...form.oficio, en: event.target.value })}
            />
          </div>
        </div>

        {/* Phones */}
        <div>
          <span className={LABEL}>Teléfonos</span>
          <div className="space-y-3">
            {form.telefonos.map((telefono, index) => (
              <div key={index} className="flex items-center gap-3 flex-wrap">
                <input
                  aria-label={`Teléfono ${index + 1}`}
                  className={`${FIELD} flex-1 min-w-[12rem]`}
                  placeholder="+57 300 000 0000"
                  value={telefono.numero}
                  onChange={(event) => {
                    const next = [...form.telefonos];
                    next[index] = { ...next[index], numero: event.target.value };
                    set('telefonos', next);
                  }}
                />
                <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-penca"
                    checked={telefono.whatsapp}
                    onChange={(event) => {
                      const next = [...form.telefonos];
                      next[index] = { ...next[index], whatsapp: event.target.checked };
                      set('telefonos', next);
                    }}
                  />
                  WhatsApp
                </label>
                <button
                  type="button"
                  aria-label="Quitar teléfono"
                  className={REMOVE}
                  onClick={() => set('telefonos', form.telefonos.filter((_, i) => i !== index))}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className={`${ADD} mt-3`}
            onClick={() => set('telefonos', [...form.telefonos, { numero: '', whatsapp: false }])}
          >
            <Plus size={14} /> Añadir teléfono
          </button>
        </div>

        {/* Emails */}
        <div>
          <span className={LABEL}>Correos</span>
          <div className="space-y-3">
            {form.correos.map((correo, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  aria-label={`Correo ${index + 1}`}
                  type="email"
                  className={`${FIELD} flex-1`}
                  placeholder="artesano@ejemplo.com"
                  value={correo}
                  onChange={(event) => {
                    const next = [...form.correos];
                    next[index] = event.target.value;
                    set('correos', next);
                  }}
                />
                <button
                  type="button"
                  aria-label="Quitar correo"
                  className={REMOVE}
                  onClick={() => set('correos', form.correos.filter((_, i) => i !== index))}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className={`${ADD} mt-3`}
            onClick={() => set('correos', [...form.correos, ''])}
          >
            <Plus size={14} /> Añadir correo
          </button>
        </div>

        {/* Links */}
        <div>
          <span className={LABEL}>Enlaces</span>
          <p className="text-stone text-xs mb-3">
            Pega cualquier dirección. Si es una red social conocida se muestra su icono; si no,
            se muestra como enlace con el texto que escribas.
          </p>
          <div className="space-y-3">
            {form.enlaces.map((enlace, index) => {
              const network = detectNetwork(enlace.url);
              return (
                <div key={index} className="flex items-center gap-3 flex-wrap">
                  <span
                    className="w-9 h-9 rounded-full border border-stone/40 flex items-center justify-center text-earth shrink-0"
                    title={network ? NETWORK_LABELS[network] : 'Enlace'}
                  >
                    {network ? <SocialGlyph network={network} size={16} /> : <ExternalLink size={15} />}
                  </span>
                  <input
                    aria-label={`Dirección ${index + 1}`}
                    className={`${FIELD} flex-1 min-w-[14rem]`}
                    placeholder="https://instagram.com/…"
                    value={enlace.url}
                    onChange={(event) => {
                      const next = [...form.enlaces];
                      next[index] = { ...next[index], url: event.target.value };
                      set('enlaces', next);
                    }}
                  />
                  {!network && (
                    <input
                      aria-label={`Texto del enlace ${index + 1}`}
                      className={`${FIELD} w-full sm:w-48`}
                      placeholder={enlace.url ? hostLabel(enlace.url) : 'Texto a mostrar'}
                      value={enlace.etiqueta}
                      onChange={(event) => {
                        const next = [...form.enlaces];
                        next[index] = { ...next[index], etiqueta: event.target.value };
                        set('enlaces', next);
                      }}
                    />
                  )}
                  <button
                    type="button"
                    aria-label="Quitar enlace"
                    className={REMOVE}
                    onClick={() => set('enlaces', form.enlaces.filter((_, i) => i !== index))}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className={`${ADD} mt-3`}
            onClick={() => set('enlaces', [...form.enlaces, { url: '', etiqueta: '' }])}
          >
            <Plus size={14} /> Añadir enlace
          </button>
        </div>

        <div>
          <label htmlFor="mapa" className={LABEL}>
            Ubicación en Google Maps
          </label>
          <input
            id="mapa"
            className={FIELD}
            placeholder="https://maps.app.goo.gl/…"
            value={form.mapaUrl}
            onChange={(event) => set('mapaUrl', event.target.value)}
          />
          <p className="text-stone text-xs mt-2">
            Se muestra como un enlace “Ver ubicación”, sin mapa incrustado.
          </p>
        </div>
      </section>

      <label className="flex items-center gap-3 cursor-pointer border-t border-stone/20 pt-6">
        <input
          type="checkbox"
          checked={form.publicado}
          onChange={(event) => set('publicado', event.target.checked)}
          className="w-4 h-4 accent-penca"
        />
        <span className="text-sm text-charcoal">Publicado (visible en el sitio)</span>
      </label>

      {pickerOpen && (
        <MediaPicker onSelect={applySelection} onClose={() => setPickerOpen(false)} />
      )}
    </div>
  );
}
