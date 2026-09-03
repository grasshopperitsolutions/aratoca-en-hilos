import {
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
  type ActionCodeSettings,
  type User,
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

import { requireDb } from '../firebase';
import { requireAuth } from '../firebaseAdmin';
import { ADMINS_COLLECTION, normaliseEmail } from './admins';

/**
 * The three emails Firebase Authentication sends on its own.
 *
 * These cost nothing, need no backend and no external email provider — Google
 * delivers them. The price is limited customisation: subject, body, sender name
 * and reply-to are
 * editable in the console (Authentication → Templates), and the sender domain
 * can be verified there, but the layout is Google's. Fully branded versions
 * would need `generatePasswordResetLink()` from the Admin SDK, which is a
 * backend this project deliberately does not have.
 *
 * 1. Password reset      — `enviarRestablecerPassword`
 * 2. Email verification  — `enviarVerificacion`
 * 3. Email-change notice — sent automatically to the OLD address by
 *                          `cambiarEmail`, so the owner can react if it was
 *                          not them.
 */

/**
 * Where the emailed link returns to once the action completes.
 *
 * Built from the live origin rather than `VITE_SITE_ORIGIN` so the flow also
 * works on localhost and on whatever domain the site is eventually served
 * from. **The domain must be listed under Authentication → Settings →
 * Authorized domains**, or Firebase rejects the link.
 */
function continueTo(appPath: string): ActionCodeSettings {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return { url: `${window.location.origin}${base}${appPath}`, handleCodeInApp: false };
}

/** Sends the Firebase password-reset email. Also serves as "change password". */
export async function enviarRestablecerPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(requireAuth(), normaliseEmail(email), continueTo('/admin'));
}

/** Sends the Firebase address-verification email to the signed-in user. */
export async function enviarVerificacion(user: User): Promise<void> {
  await sendEmailVerification(user, continueTo('/admin/administradores'));
}

/**
 * Starts an email change.
 *
 * `verifyBeforeUpdateEmail` sends a confirmation to the NEW address and only
 * switches the account once that link is opened — so a typo cannot strand the
 * account on an inbox nobody owns. Firebase separately notifies the OLD
 * address, which is the third of its built-in emails.
 *
 * Throws `auth/requires-recent-login` on a stale session; the caller is
 * expected to ask the user to sign in again.
 */
export async function cambiarEmail(user: User, nuevoEmail: string): Promise<void> {
  await verifyBeforeUpdateEmail(user, normaliseEmail(nuevoEmail), continueTo('/admin'));
}

/**
 * Realigns the allowlist entry after an email change has gone through.
 *
 * The `admins` document carries the address shown in the admin list, but the
 * change lands in Firebase Auth whenever the user opens the link — possibly in
 * another browser, with this app nowhere in sight. Without this the list would
 * keep showing the old address indefinitely.
 *
 * The rules permit exactly this write: your own entry, the `email` field alone,
 * and only to the value Auth already reports for your session.
 */
export async function sincronizarEmailAdmin(user: User, emailEnFirestore: string): Promise<void> {
  const actual = normaliseEmail(user.email ?? '');
  if (!actual || actual === emailEnFirestore) return;
  await updateDoc(doc(requireDb(), ADMINS_COLLECTION, user.uid), { email: actual });
}
