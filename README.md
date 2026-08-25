# Aratoca en Hilos

Bilingual website for **Aratoca en Hilos**, a project documenting the craft of fique
(natural agave fibre) in Aratoca, Santander, Colombia.

React 19 + TypeScript + Vite 8 + Tailwind CSS v4, prerendered to static HTML and deployed
to GitHub Pages under the `/aratoca-en-hilos/` sub-path.

---

## Quick start

```bash
npm install
```

Copy the environment template and fill it in from the Firebase console
(**Project settings → General → Your apps → Web app → SDK setup and configuration**):

```bash
cp .env.example .env
```

Then:

```bash
npm run dev
```

The site is available at http://localhost:5173/aratoca-en-hilos/.

Without a `.env` the public site still runs perfectly — it falls back to the committed
content snapshot. Only the contact form and the admin panel need Firebase.

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Full production pipeline (see below) |
| `npm run preview` | Serves `dist/` exactly as it will be deployed |
| `npm run lint` | ESLint |
| `npx tsc -b` | Type check |

`npm run build` runs five steps in order:

1. **`build:content`** — reads published artisans from Firestore into
   `src/content/artesanos.generated.json`. Skipped gracefully when Firebase is unconfigured.
2. **`tsc -b`** — type check.
3. **`build:client`** — the browser bundle.
4. **`build:ssr`** — a Node bundle of `src/entry-server.tsx`.
5. **`prerender`** — renders every route to static HTML and writes `sitemap.xml`,
   `robots.txt`, `llms.txt`, `404.html` and `.nojekyll`.

---

## Architecture

### Prerendering

The site is a React SPA that is **rendered to static HTML at build time**. Every route ships
real content in the HTML source, which matters because most AI/LLM crawlers — and the
cheaper search crawlers — do not execute JavaScript.

`scripts/prerender.mjs` drives this. It emits each route twice:

- `artesanos/index.html` — served at `/artesanos/`
- `artesanos.html` — served at `/artesanos`

Both carry the same canonical URL. The pair means a hard load works on any static host,
whether or not it redirects extension-less paths to directories.

### Routing and languages

Spanish lives at the root and is the `hreflang` x-default; English lives under `/en/` with
English slugs. `src/i18n/routes.ts` is the single source of truth — the router, the language
switcher, the sitemap and the SEO manifest all derive from it, so they cannot drift.

| Spanish | English |
|---|---|
| `/` | `/en/` |
| `/artesanos` | `/en/artisans` |
| `/taller-fique` | `/en/fique-workshop` |
| `/contacto` | `/en/contact` |
| `/terminos` | `/en/terms` |
| `/privacidad` | `/en/privacy` |

`/acerca-de` is a retired URL and is emitted as a static redirect stub to `/artesanos/`.

The active language is derived purely from the URL — never from `localStorage` or the
`navigator` language. A detector would make the prerendered output non-deterministic.

### Bundle splitting

The initial bundle is roughly 118 kB gzipped. The Firebase SDK (about 141 kB gzipped) is
**not** part of it: Firestore is dynamically imported when the artisans page mounts or when
the contact form is submitted, and Auth plus Storage live in the lazily loaded admin chunk.
Nothing under `src/pages` outside `pages/admin` may import `src/firebaseAdmin.ts`.

---

## Admin panel

Reachable **only by typing the URL** — `/aratoca-en-hilos/admin`. It is absent from the
header, the footer, the sitemap and the prerender manifest, and emits `noindex,nofollow`.

| Route | Purpose |
|---|---|
| `/admin` | Email/password sign-in |
| `/admin/artesanos` | Artisan profiles: create, edit, reorder, publish, bilingual bios |
| `/admin/mensajes` | Contact form inbox |
| `/admin/archivos` | Media library: upload, preview, copy URL, delete |

The UI is Spanish-only: it is an internal tool for the client, not part of the bilingual
public site.

Signing in is not sufficient for access — the uid must also have a document in the
`admins/` collection, which is the same allowlist the security rules check.

---

## Firebase setup

All Firebase calls are made from the browser; there is no API proxy. **The security rules
are therefore the only thing protecting the data** — the UI checks are for routing only.

### 1. Enable services

In the Firebase console: **Firestore** (production mode), **Authentication → Email/Password**,
and **Cloud Storage** (requires the Blaze plan; set a low budget alert).

### 2. Create the admin user

Create the account under Authentication, copy its **UID**, then add a document at
`admins/<uid>` with fields `email` (string) and `creadoEn` (timestamp).

This collection is not writable from any client, by design — otherwise an attacker could
promote themselves.

### 3. Deploy the rules and indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

`firestore.rules`, `storage.rules` and `firestore.indexes.json` are committed here so the
rules are version-controlled and reviewable.

### 4. App Check

Register a **reCAPTCHA v3** site key and set it as `VITE_RECAPTCHA_SITE_KEY`. The
`contactos` collection is publicly writable — without App Check it is a spam target.

### 5. Email notifications

Install the **Trigger Email from Firestore** extension with a free SMTP provider
(Brevo or SendGrid) and point it at the `contactos` collection.

Submitted documents carry `to` and `template: { name: 'contacto', data: {…} }` rather than
raw HTML. The rules pin `to` to the company address, so the collection cannot be used as an
open mail relay, and the email body comes from a template the public cannot write.

Create the template at `templates/contacto`:

```json
{
  "subject": "Nuevo mensaje de {{nombre}} — Aratoca en Hilos",
  "html": "<h2>Nuevo mensaje desde el sitio web</h2><p><strong>Nombre:</strong> {{nombre}}</p><p><strong>Correo:</strong> {{email}}</p><p><strong>Teléfono:</strong> {{telefono}}</p><p><strong>Idioma:</strong> {{idioma}}</p><hr><p>{{mensaje}}</p>"
}
```

> ⚠️ The recipient address is hard-coded in `firestore.rules` (`contactEmail()`) and must
> match `COMPANY.email` in `src/content/company.ts`. Change both together.

### Data model

| Collection | Access |
|---|---|
| `admins/{uid}` | Admin read; no client writes |
| `artesanos/{id}` | Public read where `publicado == true`; admin write |
| `contactos/{id}` | Public **create** only (field- and size-validated); admin read/update/delete |
| `archivos/{id}` | Public read; admin write |
| `templates/{id}` | No client access — the extension uses the Admin SDK |

---

## Deployment

Pushing to `master` builds and deploys to GitHub Pages via
`.github/workflows/deploy.yml`.

Add these **repository secrets** (Settings → Secrets and variables → Actions). Vite inlines
`VITE_*` at build time, so they must be present in CI rather than at runtime. They are
public values by design — the rules are what protect the data.

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_RECAPTCHA_SITE_KEY
VITE_SITE_ORIGIN
```

### Why there is a nightly build

Artisan content lives in Firestore and is baked into the prerendered HTML at build time.
Visitors see admin edits immediately, because the page subscribes to Firestore — but
**crawlers only see them after a rebuild**. The workflow therefore runs nightly at 06:00 UTC,
and can be triggered by hand from the Actions tab after a content change.

### Moving to another domain

`vite.config.ts` sets `base: '/aratoca-en-hilos/'`. To serve the site from a domain root,
change that to `'/'` and set `VITE_SITE_ORIGIN` to the new origin; everything else —
canonicals, hreflang, the sitemap, `robots.txt` — follows automatically. The build output in
`dist/` is a plain folder and can be handed over or dropped on any static host.

---

## Outstanding before handover

Placeholders are marked `TODO(client)` in the source:

- **`src/content/company.ts`** — registered business name, NIT, address, email, phone,
  WhatsApp, social URLs. The legal pages are not valid without the real entity details
  required by Ley 1581 de 2012.
- **`src/content/images.ts`** — every image is currently a hotlinked Unsplash stock photo
  and is not of Aratoca. Replace with the client's own photography, placed in `src/assets/`
  and imported so Vite fingerprints them.
- The legal pages are written for a **showcase site with a contact form and no
  e-commerce**. If the client starts selling, both documents need sale, pricing and returns
  clauses.

---

## Project conventions

See `.clinerules/`:

- `aratoca-en-hilos-design-system.md` — colours, typography, layout, component patterns
- `quality-checks.md` — run `npm run lint`, `npx tsc -b` and `npm run build` before
  considering any task complete

Never use raw hex values in components; always use the Tailwind theme tokens
(`bg-cream`, `text-charcoal`, `border-stone`, …) defined in `src/index.css`.
