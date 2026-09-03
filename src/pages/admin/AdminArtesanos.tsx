import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';

import ArtesanoForm from '../../components/admin/ArtesanoForm';
import type { ArtesanoInput } from '../../services/artesanos';
import {
  createArtesano,
  deleteArtesano,
  subscribeAllArtesanos,
  updateArtesano,
  validateArtesano,
  type ArtesanoErrors,
} from '../../services/artesanosAdmin';
import type { Artesano } from '../../types/content';

const EMPTY_FORM: ArtesanoInput = {
  nombre: '',
  oficio: { es: '', en: '' },
  bio: { es: '', en: '' },
  fotoUrl: '',
  fotoPath: '',
  enlaces: [],
  telefonos: [],
  correos: [],
  mapaUrl: '',
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
    enlaces: artesano.enlaces,
    telefonos: artesano.telefonos,
    correos: artesano.correos,
    mapaUrl: artesano.mapaUrl,
    orden: artesano.orden,
    publicado: artesano.publicado,
  };
}

/**
 * Blank rows are a normal by-product of the "add another" buttons, so they are
 * dropped on save rather than nagged about.
 */
function pruneEmpty(form: ArtesanoInput): ArtesanoInput {
  return {
    ...form,
    nombre: form.nombre.trim(),
    mapaUrl: form.mapaUrl.trim(),
    correos: form.correos.map((c) => c.trim()).filter(Boolean),
    telefonos: form.telefonos
      .map((t) => ({ ...t, numero: t.numero.trim() }))
      .filter((t) => t.numero),
    enlaces: form.enlaces
      .map((e) => ({ url: e.url.trim(), etiqueta: e.etiqueta.trim() }))
      .filter((e) => e.url),
  };
}

export default function AdminArtesanos() {
  const [artesanos, setArtesanos] = useState<Artesano[]>([]);
  const [editing, setEditing] = useState<Artesano | null>(null);
  const [form, setForm] = useState<ArtesanoInput>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<ArtesanoErrors>({});
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
    setErrors({});
    setShowForm(true);
  }

  function startEdit(artesano: Artesano) {
    setEditing(artesano);
    setForm(toInput(artesano));
    setErrors({});
    setShowForm(true);
  }

  async function handleSave() {
    const cleaned = pruneEmpty(form);
    const found = validateArtesano(cleaned);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setError('Faltan datos obligatorios: imagen, nombre y descripción.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      if (editing) await updateArtesano(editing.id, cleaned);
      else await createArtesano(cleaned);
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      setErrors({});
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

          <ArtesanoForm form={form} errors={errors} onChange={setForm} />

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
                setErrors({});
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

    </div>
  );
}
