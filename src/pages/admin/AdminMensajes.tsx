import { useEffect, useMemo, useState } from 'react';
import { Mail, MailOpen, Phone, Reply, Trash2 } from 'lucide-react';

import { eliminarMensaje, marcarLeido, subscribeMensajes } from '../../services/contacto';
import type { Mensaje } from '../../types/content';

type Filter = 'todos' | 'noLeidos';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminMensajes() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [filter, setFilter] = useState<Filter>('todos');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => subscribeMensajes(setMensajes, (err) => setError(err.message)), []);

  const visible = useMemo(
    () => (filter === 'noLeidos' ? mensajes.filter((mensaje) => !mensaje.leido) : mensajes),
    [mensajes, filter],
  );

  const unread = mensajes.filter((mensaje) => !mensaje.leido).length;

  async function toggle(mensaje: Mensaje) {
    const next = expanded === mensaje.id ? null : mensaje.id;
    setExpanded(next);
    // Opening an enquiry is what marks it read — no separate button needed.
    if (next && !mensaje.leido) await marcarLeido(mensaje.id, true);
  }

  async function handleDelete(mensaje: Mensaje) {
    if (!window.confirm(`¿Eliminar el mensaje de ${mensaje.nombre}?`)) return;
    await eliminarMensaje(mensaje.id);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-fraunces text-charcoal">Mensajes</h1>
        <p className="text-charcoal/60 text-sm mt-1">
          Consultas recibidas desde el formulario de contacto.
          {unread > 0 && ` ${unread} sin leer.`}
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['todos', 'noLeidos'] as Filter[]).map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
              filter === option
                ? 'bg-charcoal text-cream'
                : 'border border-stone/40 text-charcoal hover:bg-stone/10'
            }`}
          >
            {option === 'todos' ? 'Todos' : 'Sin leer'}
          </button>
        ))}
      </div>

      {error && (
        <p className="border border-terracotta/40 bg-terracotta/5 rounded-lg p-4 text-sm text-charcoal mb-6">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="text-stone py-10 text-center">No hay mensajes que mostrar.</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((mensaje) => (
            <li
              key={mensaje.id}
              className={`border rounded-lg transition-colors ${
                mensaje.leido ? 'border-stone/20 bg-cream' : 'border-penca/40 bg-moss/10'
              }`}
            >
              <button
                onClick={() => toggle(mensaje)}
                className="w-full flex items-center gap-4 p-4 text-left"
                aria-expanded={expanded === mensaje.id}
              >
                {mensaje.leido ? (
                  <MailOpen size={18} className="text-stone shrink-0" />
                ) : (
                  <Mail size={18} className="text-penca shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-fraunces text-lg text-charcoal truncate">{mensaje.nombre}</p>
                  <p className="text-sm text-stone truncate">{mensaje.mensaje}</p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-xs text-stone">{formatDate(mensaje.creadoEn)}</p>
                  <span className="text-xs uppercase tracking-widest text-stone/70">
                    {mensaje.idioma}
                  </span>
                </div>
              </button>

              {expanded === mensaje.id && (
                <div className="px-4 pb-4 pt-2 border-t border-stone/20 space-y-4">
                  <p className="text-charcoal/80 whitespace-pre-wrap leading-relaxed">
                    {mensaje.mensaje}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <a
                      href={`mailto:${mensaje.email}`}
                      className="inline-flex items-center gap-2 text-penca hover:text-terracotta transition-colors"
                    >
                      <Reply size={14} />
                      {mensaje.email}
                    </a>
                    {mensaje.telefono && (
                      <a
                        href={`tel:${mensaje.telefono.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-2 text-penca hover:text-terracotta transition-colors"
                      >
                        <Phone size={14} />
                        {mensaje.telefono}
                      </a>
                    )}
                    <span className="text-stone sm:hidden">{formatDate(mensaje.creadoEn)}</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => marcarLeido(mensaje.id, !mensaje.leido)}
                      className="text-xs font-bold uppercase tracking-widest text-stone hover:text-charcoal"
                    >
                      Marcar como {mensaje.leido ? 'no leído' : 'leído'}
                    </button>
                    <button
                      onClick={() => handleDelete(mensaje)}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-stone hover:text-terracotta"
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
