/**
 * Email bodies, in code.
 *
 * The Trigger Email extension kept these in a Firestore `templates` collection;
 * holding them here instead means they are version-controlled, reviewable in a
 * diff, and deployed atomically with the function that uses them — rather than
 * edited by hand in a console with no history.
 *
 * The `template.name` on each document still selects which one to render, so
 * the security rules that pin a document to a specific template keep working
 * unchanged. A visitor chooses the data, never the markup.
 */

export const TEMPLATE_NAMES = ['contacto', 'invitacion'] as const;
export type TemplateName = (typeof TEMPLATE_NAMES)[number];

export interface RenderedEmail {
  subject: string;
  html: string;
  /** Set when the recipient should be able to reply to someone else. */
  replyTo?: string;
}

export class UnknownTemplateError extends Error {
  constructor(name: string) {
    super(`No template named "${name}"`);
    this.name = 'UnknownTemplateError';
  }
}

/** Data is user-supplied, so everything interpolated is escaped. */
function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Preserves the line breaks a visitor typed into the message box. */
function escapeParagraph(value: unknown): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br />');
}

/**
 * Sanitises a value destined for a header rather than a body.
 *
 * A subject is not HTML, so escaping it would just show `&lt;` to the reader.
 * What actually matters here is that carriage returns and control characters
 * cannot smuggle extra headers into the message, and that a 120-character name
 * cannot push the real subject out of view in an inbox list.
 */
function headerSafe(value: unknown, maxLength = 60): string {
  const flattened = String(value ?? '')
    // Matching control characters is the entire point here — they are exactly
    // what a header-injection attempt would use.
    // eslint-disable-next-line no-control-regex
    .replace(/[\r\n\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return flattened.length > maxLength ? `${flattened.slice(0, maxLength - 1)}…` : flattened;
}

const SHELL = (title: string, body: string): string => `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#F7F2E9;font-family:'Nunito Sans',Helvetica,Arial,sans-serif;color:#2E2118;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #A79E8E33;border-radius:12px;padding:32px;">
      <p style="margin:0 0 24px;font-size:18px;color:#6B4226;font-weight:700;">
        Aratoca <span style="font-style:italic;font-weight:400;color:#B85C38;">en Hilos</span>
      </p>
      <h1 style="margin:0 0 20px;font-size:20px;color:#2E2118;">${title}</h1>
      ${body}
    </div>
  </body>
</html>`;

type Data = Record<string, unknown>;

const RENDERERS: Record<TemplateName, (data: Data) => RenderedEmail> = {
  contacto: (data) => ({
    subject: `Nuevo mensaje de ${headerSafe(data.nombre) || 'alguien'} — Aratoca en Hilos`,
    // So a reply from the inbox goes straight back to the enquirer.
    replyTo: typeof data.email === 'string' ? data.email : undefined,
    html: SHELL(
      'Nuevo mensaje desde el sitio web',
      `<table style="width:100%;border-collapse:collapse;font-size:15px;">
         <tr><td style="padding:6px 0;color:#A79E8E;width:110px;">Nombre</td><td>${escapeHtml(data.nombre)}</td></tr>
         <tr><td style="padding:6px 0;color:#A79E8E;">Correo</td><td>${escapeHtml(data.email)}</td></tr>
         <tr><td style="padding:6px 0;color:#A79E8E;">Teléfono</td><td>${escapeHtml(data.telefono) || '—'}</td></tr>
         <tr><td style="padding:6px 0;color:#A79E8E;">Idioma</td><td>${escapeHtml(data.idioma)}</td></tr>
       </table>
       <hr style="border:none;border-top:1px solid #A79E8E33;margin:24px 0;" />
       <p style="margin:0;font-size:15px;line-height:1.6;">${escapeParagraph(data.mensaje)}</p>`,
    ),
  }),

  invitacion: (data) => ({
    subject: 'Te han invitado a administrar Aratoca en Hilos',
    html: SHELL(
      'Invitación al panel de administración',
      `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;">
         ${escapeHtml(data.invitadaPor) || 'Un administrador'} te ha invitado a administrar
         el sitio de Aratoca en Hilos.
       </p>
       <p style="margin:0 0 24px;">
         <a href="${escapeHtml(data.enlace)}"
            style="display:inline-block;background:#B85C38;color:#F7F2E9;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:700;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;">
           Crear mi contraseña
         </a>
       </p>
       <p style="margin:0 0 8px;font-size:14px;color:#A79E8E;line-height:1.6;">
         El enlace caduca en ${escapeHtml(data.dias)} días. Si no esperabas este correo,
         puedes ignorarlo.
       </p>
       <p style="margin:0;font-size:12px;color:#A79E8E;word-break:break-all;">
         ${escapeHtml(data.enlace)}
       </p>`,
    ),
  }),
};

export function isTemplateName(value: unknown): value is TemplateName {
  return typeof value === 'string' && (TEMPLATE_NAMES as readonly string[]).includes(value);
}

export function renderTemplate(name: string, data: Data): RenderedEmail {
  if (!isTemplateName(name)) throw new UnknownTemplateError(name);
  return RENDERERS[name](data);
}
