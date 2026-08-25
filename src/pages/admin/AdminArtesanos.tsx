import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';

import MediaPicker, { type MediaSelection } from '../../components/admin/MediaPicker';
import type { ArtesanoInput } from '../../services/artesanos';
import {
  createArtesano,
  deleteArtesano,
  subscribeAllArtesanos,
  updateArtesano,
} from '../../services/artesanosAdmin';
import type { Artesano } from '../../types/content';

const EMPTY_FORM: ArtesanoInput = {
  nombre: '',
  oficio: { es: '', en: '' },
  bio: { es: '', en: '' },
  fotoUrl: '',
  fotoPath: '',
  orden: 0,
  publicado: false,
};

/** Drops the server-managed fields, leaving only what the form owns. */
function toInput(artesano: Artesano): ArtesanoInput {
  return {
    nombre: artesano.nombre,
    oficio: artesano.oficio,
    bio: artesano.bio,
    fotoUrl: artesano.fotoUrl,
    fotoPath: artesano.fotoPath,
    orden: artesano.orden,
    publicado: artesano.publicado,
  };
}

const FIELD =
  'w-full rounded-lg border border-stone/50 bg-cream px-4 py-2.5 text-charcoal placeholder:text-stone/70 focus:border-penca focus:outline-none focus:ring-1 focus:ring-penca transition-colors';
const LABEL = 'block text-xs font-bold uppercase tracking-widest text-charcoal mb-2';

export default function AdminArtesanos() {
  const [artesanos, setArtesanos] = useState<Artesano[]>([]);
  const [editing, setEditing] = useState<Artesano | null>(null);
  const [form, setForm] = useState<ArtesanoInput>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const dragIndex = useRef<number | null>(null);

  useEffect(
    () => subscribeAllArtesanos(setArtesanos, (err) => setError(err.message)),
    [],
  );

  function startCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, orden: artesanos.length });
    setShowForm(true);
  }

  function startEdit(artesano: Artesano) {
    setEditing(artesano);
    setForm(toInput(artesano));
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (editing) await updateArtesano(editing.id, form);
      else await createArtesano(form);
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_FORM);
    } catch (caught) {
      console.error('[admin/artesanos] save failed:', caught);
      setError('No se pudo guardar. Revisa tu conexión y los permisos.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(artesano: Artesano) {
    if (!window.confirm(`¿Eliminar a ${artesano.nombre}? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteArtesano(artesano);
    } catch (caught) {
      console.error('[admin/artesanos] delete failed:', caught);
      setError('No se pudo eliminar el artesano.');
    }
  }

  async function togglePublicado(artesano: Artesano) {
    await updateArtesano(artesano.id, { publicado: !artesano.publicado });
  }

  /** Writes the new sequence back, renumbering `orden` to match the array. */
  async function persistOrder(next: Artesano[]) {
    setArtesanos(next);
    await Promise.all(
      next.map((artesano, index) =>
        artesano.orden === index ? null : updateArtesano(artesano.id, { orden: index }),
      ),
    );
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= artesanos.length || from === to) return;
    const next = [...artesanos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    void persistOrder(next);
  }

  function applySelection(selection: MediaSelection) {
    setForm((current) => ({ ...current, fotoUrl: selection.url, fotoPath: selection.path }));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-fraunces text-charcoal">Artesanos</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Contenido de la página pública de artesanos. Solo se publican los marcados como visibles.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-full bg-terracotta text-cream border border-terracotta px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-cream hover:text-terracotta transition-all"
        >
          <Plus size={16} />
          Nuevo artesano
        </button>
      </div>

      {error && (
        <p className="border border-terracotta/40 bg-terracotta/5 rounded-lg p-4 text-sm text-charcoal mb-6">
          {error}
        </p>
      )}

      {showForm && (
        <div className="bg-moss/10 rounded-xl p-6 md:p-8 mb-8 space-y-6">
          <h2 className="font-fraunces text-xl text-earth">
            {editing ? `Editando: ${editing.nombre}` : 'Nuevo artesano'}
          </h2>

          <div>
            <label htmlFor="nombre" className={LABEL}>
              Nombre
            </label>
            <input
              id="nombre"
              className={FIELD}
              value={form.nombre}
              onChange={(event) => setForm({ ...form, nombre: event.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="oficio-es" className={LABEL}>
                Oficio (español)
              </label>
              <input
                id="oficio-es"
                className={FIELD}
                value={form.oficio.es}
                onChange={(event) =>
                  setForm({ ...form, oficio: { ...form.oficio, es: event.target.value } })
                }
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
                onChange={(event) =>
                  setForm({ ...form, oficio: { ...form.oficio, en: event.target.value } })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="bio-es" className={LABEL}>
                Biografía (español)
              </label>
              <textarea
                id="bio-es"
                rows={5}
                className={`${FIELD} resize-y`}
                value={form.bio.es}
                onChange={(event) =>
                  setForm({ ...form, bio: { ...form.bio, es: event.target.value } })
                }
              />
            </div>
            <div>
              <label htmlFor="bio-en" className={LABEL}>
                Biografía (inglés)
              </label>
              <textarea
                id="bio-en"
                rows={5}
                className={`${FIELD} resize-y`}
                value={form.bio.en}
                onChange={(event) =>
                  setForm({ ...form, bio: { ...form.bio, en: event.target.value } })
                }
              />
            </div>
          </div>

          <div>
            <span className={LABEL}>Retrato</span>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-moss/20 border border-stone/20 flex items-center justify-center shrink-0">
                {form.fotoUrl ? (
                  <img src={form.fotoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-stone" />
                )}
              </div>
              <button
                onClick={() => setPickerOpen(true)}
                className="rounded-full border border-charcoal px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-charcoal hover:text-cream transition-all"
              >
                {form.fotoUrl ? 'Cambiar imagen' : 'Elegir imagen'}
              </button>
              {form.fotoUrl && (
                <button
                  onClick={() => setForm({ ...form, fotoUrl: '', fotoPath: '' })}
                  className="text-sm text-stone hover:text-terracotta underline"
                >
                  Quitar
                </button>
              )}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.publicado}
              onChange={(event) => setForm({ ...form, publicado: event.target.checked })}
              className="w-4 h-4 accent-penca"
            />
            <span className="text-sm text-charcoal">Publicado (visible en el sitio)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={busy}
              className="rounded-full bg-penca text-cream border border-penca px-6 py-3 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-60"
            >
              {busy ? 'Guardando…' : 'Guardar'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="rounded-full border border-stone px-6 py-3 text-sm font-bold uppercase tracking-widest text-charcoal hover:bg-stone/10 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {artesanos.length === 0 ? (
        <p className="text-stone py-10 text-center">Todavía no hay artesanos registrados.</p>
      ) : (
        <ul className="space-y-3">
          {artesanos.map((artesano, index) => (
            <li
              key={artesano.id}
              draggable
              onDragStart={() => {
                dragIndex.current = index;
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex.current !== null) move(dragIndex.current, index);
                dragIndex.current = null;
              }}
              className="flex items-center gap-4 bg-cream border border-stone/20 rounded-lg p-4 hover:border-stone/50 transition-colors"
            >
              <GripVertical size={18} className="text-stone/60 cursor-grab shrink-0" aria-hidden="true" />

              <div className="w-12 h-12 rounded-lg overflow-hidden bg-moss/20 shrink-0 flex items-center justify-center">
                {artesano.fotoUrl ? (
                  <img src={artesano.fotoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={18} className="text-stone" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-fraunces text-lg text-charcoal truncate">{artesano.nombre}</p>
                <p className="text-sm text-stone truncate">{artesano.oficio.es || '—'}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label="Subir"
                  className="p-2 text-stone hover:text-charcoal disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => move(index, index + 1)}
                  disabled={index === artesanos.length - 1}
                  aria-label="Bajar"
                  className="p-2 text-stone hover:text-charcoal disabled:opacity-30"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => togglePublicado(artesano)}
                  aria-label={artesano.publicado ? 'Ocultar' : 'Publicar'}
                  title={artesano.publicado ? 'Publicado' : 'Oculto'}
                  className={`p-2 ${artesano.publicado ? 'text-penca' : 'text-stone'} hover:opacity-70`}
                >
                  {artesano.publicado ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => startEdit(artesano)}
                  aria-label="Editar"
                  className="p-2 text-stone hover:text-charcoal"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(artesano)}
                  aria-label="Eliminar"
                  className="p-2 text-stone hover:text-terracotta"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pickerOpen && (
        <MediaPicker onSelect={applySelection} onClose={() => setPickerOpen(false)} />
      )}
    </div>
  );
}
