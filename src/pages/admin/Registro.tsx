import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CircleAlert, Eye, EyeOff, Leaf, Lock } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

import { isFirebaseConfigured } from '../../firebase';
import {
  InvitationUnusableError,
  MIN_PASSWORD_LENGTH,
  aceptarInvitacionConCuentaExistente,
  leerInvitacion,
  registrarConInvitacion,
} from '../../services/admins';
import type { Invitacion } from '../../types/content';

type Phase =
  | { kind: 'loading' }
  | { kind: 'invalid'; message: string }
  /** No account yet: choose a password. */
  | { kind: 'nueva'; invitacion: Invitacion }
  /** The address already has an account: confirm with the existing password. */
  | { kind: 'existente'; invitacion: Invitacion };

const UNUSABLE_MESSAGES: Record<string, string> = {
  missing: 'Esta invitación no existe o ya fue anulada.',
  used: 'Esta invitación ya se utilizó. Si ya tienes cuenta, entra desde /admin.',
  expired: 'Esta invitación caducó. Pide a un administrador que te envíe una nueva.',
};

const AUTH_MESSAGES: Record<string, string> = {
  'auth/weak-password': 'Esa contraseña es demasiado débil.',
  'auth/invalid-credential': 'La contraseña actual no es correcta.',
  'auth/wrong-password': 'La contraseña actual no es correcta.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
  'auth/network-request-failed': 'No hay conexión con el servidor. Revisa tu red.',
};

const FIELD =
  'w-full rounded-lg border border-stone/50 bg-cream px-4 py-3 text-charcoal placeholder:text-stone/70 focus:border-penca focus:outline-none focus:ring-1 focus:ring-penca transition-colors';
const LABEL = 'block text-sm font-bold uppercase tracking-widest text-charcoal mb-2';

/**
 * Invitation acceptance screen.
 *
 * Deliberately outside `AdminLayout`: the visitor is not an admin yet, so the
 * usual gate would bounce them straight to the login form. Access is granted by
 * possession of the token in the URL, which only arrived in their inbox — that
 * possession is what stands in for email verification.
 */
export default function Registro() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') ?? '';

  // The two "can't even try" cases are decided from props alone, so they are
  // the initial state rather than something an effect flips after first paint.
  const [phase, setPhase] = useState<Phase>(() => {
    if (!isFirebaseConfigured) {
      return { kind: 'invalid', message: 'Firebase no está configurado en esta compilación.' };
    }
    if (!token) {
      return { kind: 'invalid', message: 'El enlace no incluye un código de invitación.' };
    }
    return { kind: 'loading' };
  });
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !token) return;

    let cancelled = false;
    leerInvitacion(token)
      .then((invitacion) => {
        if (!cancelled) setPhase({ kind: 'nueva', invitacion });
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        if (caught instanceof InvitationUnusableError) {
          setPhase({ kind: 'invalid', message: UNUSABLE_MESSAGES[caught.reason] });
          return;
        }
        // Most often this is PERMISSION_DENIED because firestore.rules has not
        // been deployed yet — worth logging, since the visitor-facing message
        // deliberately says nothing about the cause.
        console.error('[admin/registro] could not read the invitation:', caught);
        setPhase({
          kind: 'invalid',
          message: 'No pudimos comprobar la invitación. Inténtalo de nuevo más tarde.',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase.kind !== 'nueva' && phase.kind !== 'existente') return;

    setError(null);

    if (phase.kind === 'nueva') {
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
        return;
      }
      if (password !== confirm) {
        setError('Las dos contraseñas no coinciden.');
        return;
      }
    }

    setBusy(true);
    try {
      if (phase.kind === 'nueva') {
        await registrarConInvitacion(phase.invitacion, password);
      } else {
        await aceptarInvitacionConCuentaExistente(phase.invitacion, password);
      }
      navigate('/admin/artesanos', { replace: true });
    } catch (caught) {
      const code = caught instanceof FirebaseError ? caught.code : '';

      // Being invited back after removal is a normal flow, not an error: the
      // Auth account outlives the allowlist entry, so ask for the existing
      // password instead of trying to create the account again.
      if (code === 'auth/email-already-in-use') {
        setPhase({ kind: 'existente', invitacion: phase.invitacion });
        setPassword('');
        setConfirm('');
        setError(null);
      } else {
        console.error('[admin/registro] acceptance failed:', caught);
        setError(AUTH_MESSAGES[code] ?? 'No pudimos completar el registro. Inténtalo de nuevo.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16 font-nunito">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Leaf className="text-penca" size={24} />
          <span className="font-fraunces text-2xl text-earth">
            Aratoca <span className="italic font-light text-terracotta">admin</span>
          </span>
        </div>

        {phase.kind === 'loading' && (
          <p className="text-center text-stone uppercase tracking-widest text-sm">
            Comprobando la invitación…
          </p>
        )}

        {phase.kind === 'invalid' && (
          <div className="flex items-start gap-3 border border-terracotta/40 bg-terracotta/5 rounded-lg p-4">
            <CircleAlert size={20} className="text-terracotta shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-charcoal">Invitación no válida</p>
              <p className="text-charcoal/70 text-sm mt-1">{phase.message}</p>
            </div>
          </div>
        )}

        {(phase.kind === 'nueva' || phase.kind === 'existente') && (
          <div className="bg-moss/10 rounded-tl-3xl rounded-br-3xl p-8 md:p-10">
            <h1 className="text-2xl font-fraunces text-charcoal mb-2 flex items-center gap-2">
              <Lock size={20} className="text-penca" />
              {phase.kind === 'nueva' ? 'Crea tu contraseña' : 'Confirma tu identidad'}
            </h1>
            <p className="text-charcoal/60 text-sm mb-8">
              {phase.kind === 'nueva' ? (
                <>
                  Has sido invitado a administrar el sitio de Aratoca en Hilos. Elige una
                  contraseña para <strong className="text-charcoal">{phase.invitacion.email}</strong>.
                </>
              ) : (
                <>
                  Ya existe una cuenta para{' '}
                  <strong className="text-charcoal">{phase.invitacion.email}</strong>. Escribe su
                  contraseña actual para aceptar la invitación.
                </>
              )}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="registro-email" className={LABEL}>
                  Correo
                </label>
                <input
                  id="registro-email"
                  type="email"
                  value={phase.invitacion.email}
                  readOnly
                  autoComplete="username"
                  className={`${FIELD} bg-stone/10 text-charcoal/70`}
                />
              </div>

              <div>
                <label htmlFor="registro-password" className={LABEL}>
                  {phase.kind === 'nueva' ? 'Contraseña' : 'Contraseña actual'}
                </label>
                <div className="relative">
                  <input
                    id="registro-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={phase.kind === 'nueva' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`${FIELD} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone hover:text-terracotta transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {phase.kind === 'nueva' && (
                  <p className="text-stone text-xs mt-2">
                    Mínimo {MIN_PASSWORD_LENGTH} caracteres.
                  </p>
                )}
              </div>

              {phase.kind === 'nueva' && (
                <div>
                  <label htmlFor="registro-confirm" className={LABEL}>
                    Repite la contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="registro-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(event) => setConfirm(event.target.value)}
                      className={`${FIELD} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((visible) => !visible)}
                      aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      aria-pressed={showConfirm}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone hover:text-terracotta transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {error && <p className="text-terracotta text-sm">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-terracotta text-cream border border-terracotta rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-cream hover:text-terracotta transition-all disabled:opacity-60"
              >
                {busy ? 'Guardando…' : 'Aceptar invitación'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
