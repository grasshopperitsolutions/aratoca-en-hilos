import { useEffect, useState, type FormEvent } from 'react';
import { Check, CircleAlert, Copy, MailPlus, ShieldCheck, Trash2, UserMinus } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

import MiCuenta from '../../components/admin/MiCuenta';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import {
  INVITE_TTL_DAYS,
  InvalidEmailError,
  eliminarAdmin,
  invitarAdmin,
  normaliseEmail,
  revocarInvitacion,
  subscribeAdmins,
  subscribeInvitaciones,
} from '../../services/admins';
import { absoluteUrlWithQuery } from '../../seo/origin';
import type { Admin, Invitacion } from '../../types/content';

const FIELD =
  'w-full rounded-lg border border-stone/50 bg-cream px-4 py-2.5 text-charcoal placeholder:text-stone/70 focus:border-penca focus:outline-none focus:ring-1 focus:ring-penca transition-colors';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isExpired(invitacion: Invitacion): boolean {
  return Boolean(invitacion.expiraEn) && new Date(invitacion.expiraEn!) < new Date();
}

export default function AdminAdministradores() {
  const { user } = useAdminAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => subscribeAdmins(setAdmins, (err) => setError(err.message)), []);
  useEffect(() => subscribeInvitaciones(setInvitaciones, (err) => setError(err.message)), []);

  const pendientes = invitaciones.filter(
    (invitacion) => invitacion.estado === 'pendiente' && !isExpired(invitacion),
  );
  const inactivas = invitaciones.filter(
    (invitacion) => invitacion.estado === 'usada' || isExpired(invitacion),
  );

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const normalised = normaliseEmail(email);

    if (admins.some((admin) => admin.email === normalised)) {
      setError('Esa cuenta ya es administradora.');
      return;
    }
    if (pendientes.some((invitacion) => invitacion.email === normalised)) {
      setError('Ya hay una invitación pendiente para ese correo.');
      return;
    }

    setBusy(true);
    try {
      await invitarAdmin(normalised, user?.email ?? '');
      setEmail('');
      setNotice(`Invitación enviada a ${normalised}. Caduca en ${INVITE_TTL_DAYS} días.`);
    } catch (caught) {
      if (caught instanceof InvalidEmailError) {
        setError('Ese correo no parece válido.');
      } else {
        console.error('[admin/administradores] invite failed:', caught);
        const code = caught instanceof FirebaseError ? ` (${caught.code})` : '';
        setError(`No se pudo crear la invitación${code}.`);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(admin: Admin) {
    if (
      !window.confirm(
        `¿Quitar el acceso de ${admin.email}? Dejará de poder entrar al panel de inmediato.`,
      )
    ) {
      return;
    }
    setError(null);
    try {
      await eliminarAdmin(admin.id);
      setNotice(`${admin.email} ya no tiene acceso al panel.`);
    } catch (caught) {
      console.error('[admin/administradores] remove failed:', caught);
      setError('No se pudo quitar el acceso.');
    }
  }

  async function handleRevoke(invitacion: Invitacion) {
    if (!window.confirm(`¿Anular la invitación de ${invitacion.email}?`)) return;
    await revocarInvitacion(invitacion.id);
  }

  async function copyLink(invitacion: Invitacion) {
    await navigator.clipboard.writeText(
      absoluteUrlWithQuery('/admin/registro', { token: invitacion.id }),
    );
    setCopied(invitacion.id);
    window.setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-fraunces text-charcoal">Administradores</h1>
        <p className="text-charcoal/60 text-sm mt-1">
          Quién puede entrar al panel. Se invita por correo; la persona elige su propia
          contraseña desde el enlace que recibe.
        </p>
      </div>

      {user && <MiCuenta user={user} />}

      {error && (
        <p className="flex items-start gap-3 border border-terracotta/40 bg-terracotta/5 rounded-lg p-4 text-sm text-charcoal mb-6">
          <CircleAlert size={18} className="text-terracotta shrink-0 mt-0.5" />
          {error}
        </p>
      )}
      {notice && (
        <p className="flex items-start gap-3 border border-penca/40 bg-moss/10 rounded-lg p-4 text-sm text-charcoal mb-6">
          <Check size={18} className="text-penca shrink-0 mt-0.5" />
          {notice}
        </p>
      )}

      {/* Invitar */}
      <form onSubmit={handleInvite} className="bg-moss/10 rounded-xl p-6 md:p-8 mb-10">
        <h2 className="font-fraunces text-xl text-earth mb-4">Invitar a un administrador</h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="invite-email"
              className="block text-xs font-bold uppercase tracking-widest text-charcoal mb-2"
            >
              Correo electrónico
            </label>
            <input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="persona@ejemplo.com"
              className={FIELD}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta text-cream border border-terracotta px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-cream hover:text-terracotta transition-all disabled:opacity-60"
          >
            <MailPlus size={16} />
            {busy ? 'Enviando…' : 'Enviar invitación'}
          </button>
        </div>
        <p className="text-stone text-xs mt-3">
          Recibirá un enlace para crear su contraseña. El enlace caduca en {INVITE_TTL_DAYS} días.
        </p>
      </form>

      {/* Administradores activos */}
      <h2 className="font-fraunces text-xl text-earth mb-4">Con acceso ({admins.length})</h2>
      <ul className="space-y-3 mb-10">
        {admins.map((admin) => {
          const isSelf = admin.id === user?.uid;
          return (
            <li
              key={admin.id}
              className="flex items-center gap-4 bg-cream border border-stone/20 rounded-lg p-4"
            >
              <ShieldCheck size={18} className="text-penca shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-charcoal truncate">
                  {admin.email}
                  {isSelf && <span className="text-stone text-sm"> · tú</span>}
                </p>
                <p className="text-xs text-stone">Desde {formatDate(admin.creadoEn)}</p>
              </div>
              <button
                onClick={() => handleRemove(admin)}
                disabled={isSelf}
                title={
                  isSelf
                    ? 'No puedes quitarte el acceso a ti mismo'
                    : `Quitar acceso a ${admin.email}`
                }
                aria-label={`Quitar acceso a ${admin.email}`}
                className="p-2 text-stone hover:text-terracotta disabled:opacity-30 disabled:hover:text-stone"
              >
                <UserMinus size={16} />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Invitaciones pendientes */}
      <h2 className="font-fraunces text-xl text-earth mb-4">
        Invitaciones pendientes ({pendientes.length})
      </h2>
      {pendientes.length === 0 ? (
        <p className="text-stone text-sm mb-10">No hay invitaciones pendientes.</p>
      ) : (
        <ul className="space-y-3 mb-10">
          {pendientes.map((invitacion) => (
            <li
              key={invitacion.id}
              className="flex items-center gap-4 bg-cream border border-penca/30 rounded-lg p-4"
            >
              <MailPlus size={18} className="text-penca shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-charcoal truncate">{invitacion.email}</p>
                <p className="text-xs text-stone">
                  Invitada por {invitacion.invitadaPor || '—'} · caduca el{' '}
                  {formatDate(invitacion.expiraEn)}
                </p>
              </div>
              <button
                onClick={() => copyLink(invitacion)}
                title="Copiar el enlace de invitación"
                aria-label={`Copiar el enlace de ${invitacion.email}`}
                className="p-2 text-stone hover:text-charcoal"
              >
                {copied === invitacion.id ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button
                onClick={() => handleRevoke(invitacion)}
                title="Anular la invitación"
                aria-label={`Anular la invitación de ${invitacion.email}`}
                className="p-2 text-stone hover:text-terracotta"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Historial */}
      {inactivas.length > 0 && (
        <>
          <h2 className="font-fraunces text-xl text-earth mb-4">Invitaciones cerradas</h2>
          <ul className="space-y-2">
            {inactivas.map((invitacion) => (
              <li
                key={invitacion.id}
                className="flex items-center gap-4 border border-stone/20 rounded-lg px-4 py-3 text-sm"
              >
                <span className="flex-1 min-w-0 truncate text-charcoal/70">
                  {invitacion.email}
                </span>
                <span className="text-xs uppercase tracking-widest text-stone">
                  {invitacion.estado === 'usada' ? 'Aceptada' : 'Caducada'}
                </span>
                <button
                  onClick={() => revocarInvitacion(invitacion.id)}
                  aria-label={`Borrar el registro de ${invitacion.email}`}
                  className="p-1 text-stone hover:text-terracotta"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
