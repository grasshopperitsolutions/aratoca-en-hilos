import { useState, type FormEvent } from 'react';
import { CircleAlert, Leaf, Lock } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { isFirebaseConfigured } from '../../firebase';
import { requireAuth } from '../../firebaseAdmin';
import type { AdminStatus } from '../../hooks/useAdminAuth';

/** Firebase auth codes mapped to messages worth showing a person. */
const AUTH_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Ese correo no es válido.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
  'auth/network-request-failed': 'No hay conexión con el servidor. Revisa tu red.',
};

/**
 * Sign-in screen for the admin panel.
 *
 * No sign-up and no password reset by design: the single admin account is
 * created by hand in the Firebase console, so there is no self-service path
 * for anyone who stumbles onto this URL.
 */
export default function Login({ status }: { status: AdminStatus }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      await signInWithEmailAndPassword(requireAuth(), email.trim(), password);
    } catch (caught) {
      const code = caught instanceof FirebaseError ? caught.code : '';
      setError(AUTH_MESSAGES[code] ?? 'No pudimos iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  const fieldClasses =
    'w-full rounded-lg border border-stone/50 bg-cream px-4 py-3 text-charcoal placeholder:text-stone/70 focus:border-penca focus:outline-none focus:ring-1 focus:ring-penca transition-colors';

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16 font-nunito">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Leaf className="text-penca" size={24} />
          <span className="font-fraunces text-2xl text-earth">
            Aratoca <span className="italic font-light text-terracotta">admin</span>
          </span>
        </div>

        {!isFirebaseConfigured ? (
          <div className="flex items-start gap-3 border border-terracotta/40 bg-terracotta/5 rounded-lg p-4">
            <CircleAlert size={20} className="text-terracotta shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-charcoal">Firebase no está configurado</p>
              <p className="text-charcoal/70 text-sm mt-1">
                Faltan las variables <code>VITE_FIREBASE_*</code>. Copia{' '}
                <code>.env.example</code> a <code>.env</code> y rellénalas con los valores de la
                consola de Firebase.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-moss/10 rounded-tl-3xl rounded-br-3xl p-8 md:p-10">
            <h1 className="text-2xl font-fraunces text-charcoal mb-2 flex items-center gap-2">
              <Lock size={20} className="text-penca" />
              Panel de administración
            </h1>
            <p className="text-charcoal/60 text-sm mb-8">
              Acceso restringido. Inicia sesión para gestionar el contenido del sitio.
            </p>

            {status === 'unauthorised' && (
              <div className="flex items-start gap-3 border border-terracotta/40 bg-terracotta/5 rounded-lg p-4 mb-6">
                <CircleAlert size={20} className="text-terracotta shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-charcoal">Esta cuenta no tiene acceso</p>
                  <p className="text-charcoal/70 text-sm mt-1">
                    Tu sesión es válida pero el usuario no está en la lista de administradores.
                  </p>
                  <button
                    onClick={() => signOut(requireAuth())}
                    className="text-terracotta text-sm font-bold underline mt-2"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-sm font-bold uppercase tracking-widest text-charcoal mb-2"
                >
                  Correo
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={fieldClasses}
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-bold uppercase tracking-widest text-charcoal mb-2"
                >
                  Contraseña
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={fieldClasses}
                />
              </div>

              {error && <p className="text-terracotta text-sm">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-terracotta text-cream border border-terracotta rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-cream hover:text-terracotta transition-all disabled:opacity-60"
              >
                {busy ? 'Entrando…' : 'Entrar'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
