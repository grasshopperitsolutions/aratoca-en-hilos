import { setGlobalOptions } from 'firebase-functions/v2';
import { defineSecret, defineString } from 'firebase-functions/params';
import { onDocumentCreated, type FirestoreEvent } from 'firebase-functions/v2/firestore';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

import { EmailTransportError, sendEmail } from './email';
import { renderTemplate } from './templates';

/**
 * Outbound email for aratoca-en-hilos.
 *
 * The site is frontend-only, so it cannot hold the provider's API key: anything
 * in the bundle is public, and the provider's API sends no CORS headers anyway.
 * These two triggers are the smallest server-side surface that solves it — they
 * do exactly what the Trigger Email extension did, except we own them, which
 * matters because Firebase Extensions shuts down on 31 March 2027.
 *
 * The design keeps every existing security property:
 *
 * - The frontend still just writes a Firestore document. No new endpoint, no
 *   client-side credential, no change to the app.
 * - `firestore.rules` still does the validation, including pinning the contact
 *   recipient and the template name. This function is downstream of that.
 * - The document remains the record; `delivery` is written back onto it so a
 *   failure is visible next to the thing that failed.
 */

initializeApp();

// nam5 (the Firestore location) is served by us-central1.
setGlobalOptions({ region: 'us-central1', maxInstances: 5 });

/** Set with: firebase functions:secrets:set RESEND_API_KEY */
const RESEND_API_KEY = defineSecret('RESEND_API_KEY');

/** Must be on a domain verified with the provider. Set in functions/.env */
const EMAIL_FROM = defineString('EMAIL_FROM', {
  description: 'From address for outbound mail, on a verified domain.',
});

type DeliveryState = 'PROCESSING' | 'SUCCESS' | 'ERROR';

async function markDelivery(
  ref: FirebaseFirestore.DocumentReference,
  state: DeliveryState,
  extra: Record<string, unknown> = {},
): Promise<void> {
  await ref.set(
    { delivery: { state, updatedAt: FieldValue.serverTimestamp(), ...extra } },
    { merge: true },
  );
}

/**
 * Renders and sends one queued document.
 *
 * Cloud Functions may retry on failure, so a document already handled is
 * skipped rather than sent twice — an invitation arriving in duplicate is
 * confusing, and a duplicated contact notification is noise.
 */
async function deliver(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined, { id: string }>,
  collection: string,
): Promise<void> {
  const snapshot = event.data;
  if (!snapshot) return;

  const ref = getFirestore().doc(`${collection}/${event.params.id}`);
  const fresh = await ref.get();
  const existing = fresh.get('delivery') as { state?: string } | undefined;

  if (existing?.state === 'SUCCESS' || existing?.state === 'PROCESSING') {
    logger.info(`[${collection}/${event.params.id}] already ${existing.state}, skipping`);
    return;
  }

  const data = snapshot.data();
  const to = data.to;
  const template = data.template as { name?: string; data?: Record<string, unknown> } | undefined;

  if (typeof to !== 'string' || !to.includes('@') || !template?.name) {
    logger.error(`[${collection}/${event.params.id}] not a sendable document`, { to, template });
    await markDelivery(ref, 'ERROR', { error: 'Document is missing a valid `to` or `template`.' });
    return;
  }

  await markDelivery(ref, 'PROCESSING');

  try {
    const rendered = renderTemplate(template.name, template.data ?? {});
    const id = await sendEmail(
      { to, subject: rendered.subject, html: rendered.html, replyTo: rendered.replyTo },
      { apiKey: RESEND_API_KEY.value(), from: EMAIL_FROM.value() },
    );

    await markDelivery(ref, 'SUCCESS', { messageId: id });
    logger.info(`[${collection}/${event.params.id}] sent to ${to}`, { messageId: id });
  } catch (error) {
    const detail =
      error instanceof EmailTransportError || error instanceof Error
        ? error.message
        : 'Unknown error';

    // Recorded rather than rethrown: a retry storm against the provider helps
    // nobody, and the message is visible on the document for diagnosis.
    logger.error(`[${collection}/${event.params.id}] send failed`, { error: detail });
    await markDelivery(ref, 'ERROR', { error: detail });
  }
}

/** Contact form enquiries → the company address (pinned by the rules). */
export const enviarCorreoContacto = onDocumentCreated(
  { document: 'contactos/{id}', secrets: [RESEND_API_KEY] },
  (event) => deliver(event, 'contactos'),
);

/** Admin invitations → the invited address (pinned by the rules). */
export const enviarCorreoInvitacion = onDocumentCreated(
  { document: 'invitaciones/{id}', secrets: [RESEND_API_KEY] },
  (event) => deliver(event, 'invitaciones'),
);
