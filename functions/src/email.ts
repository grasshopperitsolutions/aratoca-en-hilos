/**
 * The only module in this project that knows how email actually leaves.
 *
 * Everything upstream — the Firestore documents, the security rules, the
 * templates, the triggers — is provider-agnostic. Swapping Resend for anything
 * else means rewriting `sendEmail` here and changing two config values. Nothing
 * else in the codebase mentions a provider by name.
 *
 * Deliberately a plain HTTPS request rather than a vendor SDK: the whole
 * integration is one POST, and a dependency-free transport is one less thing to
 * migrate when the provider changes.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
  /** Optional address for the recipient to reply to, e.g. the enquirer. */
  replyTo?: string;
}

export interface TransportConfig {
  apiKey: string;
  /** Must be on a domain verified with the provider, or the send is rejected. */
  from: string;
}

export class EmailTransportError extends Error {
  readonly status: number;

  constructor(status: number, detail: string) {
    super(`Email provider rejected the message (${status}): ${detail}`);
    this.name = 'EmailTransportError';
    this.status = status;
  }
}

/**
 * Sends one message and returns the provider's id for it.
 *
 * Throws `EmailTransportError` on any non-2xx so the caller can record the
 * failure on the document rather than losing it.
 */
export async function sendEmail(
  email: OutgoingEmail,
  config: TransportConfig,
): Promise<string> {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.from,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new EmailTransportError(response.status, body.slice(0, 500));
  }

  try {
    const parsed = JSON.parse(body) as { id?: string };
    return parsed.id ?? '';
  } catch {
    return '';
  }
}
