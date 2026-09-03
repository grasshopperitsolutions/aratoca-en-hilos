/**
 * Recognises social networks from a URL and supplies their glyphs.
 *
 * Artisans paste whatever link they have — an Instagram profile, a Facebook
 * page, their own website — so the network is inferred from the hostname rather
 * than asked for. Anything unrecognised is treated as a plain link, which keeps
 * the admin form to a single URL field.
 *
 * Glyphs are inline paths because lucide dropped its brand icons, and pulling in
 * a second icon package for a handful of marks is not worth the bundle.
 */

export type SocialNetwork =
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'tiktok'
  | 'x'
  | 'linkedin'
  | 'pinterest'
  | 'whatsapp';

export const SOCIAL_GLYPHS: Record<SocialNetwork, string> = {
  instagram:
    'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.9-11.1a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5Z',
  facebook:
    'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z',
  youtube:
    'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.1V8.9l5.2 3.1Z',
  tiktok:
    'M16.6 5.8a4.3 4.3 0 0 1-1-2.8h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5v-3.2a5.7 5.7 0 1 0 4.9 5.6V9.0a7.3 7.3 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.3-1.5Z',
  x: 'M17.5 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.8L4.3 21H1l7.7-8.8L1.3 3H8l4.7 6.2L17.5 3Zm-1.2 16h1.8L7.8 4.9H5.9L16.3 19Z',
  linkedin:
    'M20.4 3H3.6A.6.6 0 0 0 3 3.6v16.8a.6.6 0 0 0 .6.6h16.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6ZM8.3 18.3H5.4V9.7h2.9v8.6ZM6.9 8.5a1.7 1.7 0 1 1 1.7-1.7 1.7 1.7 0 0 1-1.7 1.7Zm11.4 9.8h-2.9v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3H9.5V9.7h2.8v1.2a3 3 0 0 1 2.7-1.5c2.9 0 3.4 1.9 3.4 4.4Z',
  pinterest:
    'M12 2a10 10 0 0 0-3.6 19.3 9.6 9.6 0 0 1 0-2.9c.2-.8 1.2-5.2 1.2-5.2a3.7 3.7 0 0 1-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5a1.5 1.5 0 0 0 1.6 1.9c1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.2-3.8a4.8 4.8 0 0 0-5 4.8 2.9 2.9 0 0 0 .7 2 .5.5 0 0 1 .1.5l-.2.8c-.1.3-.3.4-.6.2a4.4 4.4 0 0 1-2-3.9c0-2.9 2.4-6.3 7.2-6.3 3.8 0 6.4 2.8 6.4 5.8 0 4-2.2 6.9-5.4 6.9a2.9 2.9 0 0 1-2.5-1.3l-.7 2.6a11.6 11.6 0 0 1-1.1 2.4A10 10 0 1 0 12 2Z',
  whatsapp:
    'M17.5 14.4c-.3-.2-1.7-.8-1.9-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.6.1a7.6 7.6 0 0 1-2.2-1.4 8.4 8.4 0 0 1-1.6-1.9c-.2-.3 0-.4.1-.6l.4-.5a1.8 1.8 0 0 0 .3-.4.5.5 0 0 0 0-.5c0-.1-.7-1.6-.9-2.2s-.5-.5-.7-.5H8.2a1.1 1.1 0 0 0-.8.4 3.3 3.3 0 0 0-1 2.4 5.7 5.7 0 0 0 1.2 3 13 13 0 0 0 5 4.4 8.8 8.8 0 0 0 3.4.9 2.9 2.9 0 0 0 2-.6 2.4 2.4 0 0 0 .7-1.7c0-.2 0-.4-.3-.5ZM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z',
};

/** Hostname fragment → network. Order matters only for readability. */
const HOST_PATTERNS: [RegExp, SocialNetwork][] = [
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'facebook'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'],
  [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)(twitter\.com|x\.com)$/, 'x'],
  [/(^|\.)linkedin\.com$/, 'linkedin'],
  [/(^|\.)pinterest\.[a-z.]+$/, 'pinterest'],
  [/(^|\.)(wa\.me|whatsapp\.com)$/, 'whatsapp'],
];

export const NETWORK_LABELS: Record<SocialNetwork, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  x: 'X',
  linkedin: 'LinkedIn',
  pinterest: 'Pinterest',
  whatsapp: 'WhatsApp',
};

/** Accepts input without a scheme, since that is how people type URLs. */
export function normaliseUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function detectNetwork(url: string): SocialNetwork | null {
  try {
    const { hostname } = new URL(normaliseUrl(url));
    const host = hostname.replace(/^www\./, '');
    return HOST_PATTERNS.find(([pattern]) => pattern.test(host))?.[1] ?? null;
  } catch {
    return null;
  }
}

/** Hostname alone, as a readable fallback label for a non-social link. */
export function hostLabel(url: string): string {
  try {
    return new URL(normaliseUrl(url)).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Digits only, as wa.me requires — "+57 300 000 0000" becomes 573000000000. */
export function whatsappUrl(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}`;
}

export function telUrl(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
