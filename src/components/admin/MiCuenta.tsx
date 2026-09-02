import { useEffect, useState, type FormEvent } from 'react';
import { BadgeCheck, CircleAlert, KeyRound, Mail, TriangleAlert } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import type { User } from 'firebase/auth';

import {
  cambiarEmail,
  enviarRestablecerPassword,
  enviarVerificacion,
} from '../../services/cuenta';

const FIELD =
  'w-full rounded-lg border border-stone/50 bg-cream px-4 py-2.5 text-charcoal placeholder:text-stone/70 focus:border-penca focus:outline-none focus:ring-1 focus:ring-penca transition-colors';

const ACTION =
  'rounded-full border border-charcoal px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-cream transition-all disabled:opacity-50';

const AUTH_MESSAGES: Record<string, string> = {
  'auth/requires-recent-login':
    'Por seguridad, cierra sesión y vuelve a entrar antes de cambiar tu correo.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/invalid-email': 'Ese correo no es válido.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
  'auth/operation-not-allowed':
    'Firebase rechazó la operación. Comprueba que el dominio está en Authentication → Settings → Authorized domains.',
};

function messageFor(error: unknown, fallback: string): string {
  const code = error instanceof FirebaseError ? error.code : '';
  return AUTH_MESSAGES[code] ?? fallback;
}

/**
 * Account self-service, built entirely on the three emails Firebase sends by
 * itself — no Brevo involved, and nothing here costs anything.
 */
export default function MiCuenta({ user }: { user: User }) {
  const [verified, setVerified] = useState(user.emailVerified);
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'verify' | 'password' | 'email' | null>(null);

  // The account may have been verified in another tab or on a phone, so refresh
  // rather than trusting the flag captured when this session started.
  useEffect(() => {
    void user
      .reload()
      .then(() => setVerified(user.emailVerified))
      .catch(() => {});
  }, [user]);

  function reset() {
    setNotice(null);
    setError(null);
  }

  async function handleVerify() {
    reset();
    setBusy('verify');
    try {
      await enviarVerificacion(user);
      setNotice(`Te enviamos un correo de verificación a ${user.email}.`);
    } catch (caught) {
      setError(messageFor(caught, 'No pudimos enviar el correo de verificación.'));
    } finally {
      setBusy(null);
    }
  }

  async function handlePassword() {
    reset();
    setBusy('password');
    try {
      await enviarRestablecerPassword(user.email ?? '');
      setNotice(`Te enviamos un enlace a ${user.email} para cambiar tu contraseña.`);
    } catch (caught) {
      setError(messageFor(caught, 'No pudimos enviar el correo de cambio de contraseña.'));
    } finally {
      setBusy(null);
    }
  }

  async function handleEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    reset();
    setBusy('email');
    try {
      await cambiarEmail(user, nuevoEmail);
      setNotice(
        `Enviamos un correo de confirmación a ${nuevoEmail}. El cambio se aplica cuando abras ese enlace; avisaremos también a tu correo actual.`,
      );
      setNuevoEmail('');
      setShowEmailForm(false);
    } catch (caught) {
      setError(messageFor(caught, 'No pudimos cambiar el correo.'));
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="bg-cream border border-stone/20 rounded-xl p-6 md:p-8 mb-10">
      <h2 className="font-fraunces text-xl text-earth mb-4">Mi cuenta</h2>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Mail size={18} className="text-penca shrink-0" />
        <span className="text-charcoal">{user.email}</span>
        {verified ? (
          <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-penca">
            <BadgeCheck size={14} /> Verificado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-stone">
            <TriangleAlert size={14} /> Sin verificar
          </span>
        )}
      </div>

      {notice && (
        <p className="border border-penca/40 bg-moss/10 rounded-lg p-4 text-sm text-charcoal mb-6">
          {notice}
        </p>
      )}
      {error && (
        <p className="flex items-start gap-3 border border-terracotta/40 bg-terracotta/5 rounded-lg p-4 text-sm text-charcoal mb-6">
          <CircleAlert size={18} className="text-terracotta shrink-0 mt-0.5" />
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {!verified && (
          <button onClick={handleVerify} disabled={busy !== null} className={ACTION}>
            {busy === 'verify' ? 'Enviando…' : 'Verificar mi correo'}
          </button>
        )}
        <button onClick={handlePassword} disabled={busy !== null} className={ACTION}>
          <KeyRound size={14} className="inline mr-2 -mt-0.5" />
          {busy === 'password' ? 'Enviando…' : 'Cambiar contraseña'}
        </button>
        <button
          onClick={() => {
            reset();
            setShowEmailForm((open) => !open);
          }}
          disabled={busy !== null}
          className={ACTION}
        >
          Cambiar correo
        </button>
      </div>

      {showEmailForm && (
        <form onSubmit={handleEmail} className="mt-6 flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="nuevo-email"
              className="block text-xs font-bold uppercase tracking-widest text-charcoal mb-2"
            >
              Nuevo correo
            </label>
            <input
              id="nuevo-email"
              type="email"
              required
              value={nuevoEmail}
              onChange={(event) => setNuevoEmail(event.target.value)}
              className={FIELD}
            />
          </div>
          <button
            type="submit"
            disabled={busy !== null}
            className="rounded-full bg-penca text-cream border border-penca px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
          >
            {busy === 'email' ? 'Enviando…' : 'Confirmar'}
          </button>
        </form>
      )}
    </section>
  );
}
