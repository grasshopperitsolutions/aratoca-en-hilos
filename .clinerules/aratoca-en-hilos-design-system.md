## Brief overview

This rule file defines the visual design system, structure, and component patterns for the **Aratoca en Hilos** webapp — a digital book / storytelling site about the fique (sisal) fiber tradition in Aratoca, Santander, Colombia. The project uses React + TypeScript + Vite with **Tailwind CSS v4**. The design must feel like a warm, handcrafted digital book: organic textures, ample whitespace, earthy colors, and subtle animations.

---

## Color palette

All colors are defined as Tailwind theme tokens in `src/index.css` using the `@theme` directive. Never use raw hex values in components; always use the Tailwind utility classes (e.g. `bg-cream`, `text-charcoal`, `border-stone`).

| Token | Hex | Usage |
|---|---|---|
| `fique` | `#D9C7A3` | Primary — natural dry fiber beige |
| `earth` | `#6B4226` | Primary dark — wood, looms, artisanal roots |
| `penca` | `#4C7A3D` | Secondary — live fique plant, sustainability |
| `moss` | `#8FA878` | Secondary light — soft backgrounds, natural accents |
| `terracotta` | `#B85C38` | Accent — alpargatas, natural dyes, warmth |
| `cream` | `#F7F2E9` | Neutral light — main background, artisanal paper |
| `charcoal` | `#2E2118` | Neutral dark — main text |
| `stone` | `#A79E8E` | Support — borders, separators, secondary text |

**Rules:**
- Background is always `bg-cream`, never pure white.
- Text is `text-charcoal` unless on dark backgrounds (then use `text-cream`).
- Accent colors (terracotta, penca) used sparingly for CTAs, highlights, icons.

---

## Typography

Google Fonts loaded via `<link>` in `index.html`:

- **Titles:** `"Fraunces"` (serif, warm artisanal character) — weights 500, 600
- **Body:** `"Nunito Sans"` (sans-serif, clean and legible) — weight 400
- **Accent/citations (optional):** `"Caveat"` (handwritten, use sparingly)

Use Tailwind font classes: `font-fraunces`, `font-nunito`, `font-caveat`.

**Scale (rem):**

| Element | Size | Font | Weight |
|---|---|---|---|
| H1 | 3rem | Fraunces | 600 |
| H2 | 2rem | Fraunces | 600 |
| H3 | 1.5rem | Fraunces | 500 |
| Body | 1rem | Nunito Sans | 400 |
| Small/caption | 0.875rem | Nunito Sans | 400 |

---

## Layout & spacing

- Max content width: `max-w-7xl mx-auto` (1200px), centered with auto margins.
- Generous vertical spacing between sections: `py-24` (mobile) to `py-32` (desktop), with `px-6 md:px-12`.
- Use CSS Grid and Flexbox via Tailwind utilities.
- Cards and containers: `rounded-lg` to `rounded-xl` for soft, woven-like edges.
- Borders/separators: thin (`border`), `border-stone`, optionally `border-dashed` to evoke weaving patterns.

---

## Component patterns

### Hero section
- Full-viewport-height background image with semi-transparent dark overlay (`bg-charcoal/20`).
- Title in Fraunces, cream color.
- Short subtitle about the Aratoca tradition.

### Two-column text + image sections
- Used for history, storytelling.
- Alternating layout (text left / image right on desktop, stacked on mobile).
- Background: `bg-moss/10` or `bg-cream`.

### Process timeline (7 phases of fique)
- Vertical timeline with alternating left/right layout on desktop.
- Each phase: icon + title + short description.
- Alternating accent colors per card (cycle through fique, earth, penca, moss, terracotta).
- Icons: Lucide icons in circular containers.

### Product grid
- 3-column grid on desktop (`md:grid-cols-3`), 1 on mobile.
- Cards with image, title, short description.
- Hover: `group-hover:scale-105` and grayscale removal.

### CTA banner
- Full-width section with `bg-penca` background.
- Cream text, large heading, clear button.
- Invites user to explore the "digital book" chapters.

### Footer
- Background: `bg-cream` with `border-t border-stone/30`.
- Text: `text-charcoal`.
- Links to Terms and Privacy Policy via `react-router-dom` `<Link>`.
- Social icons in line style.

---

## Animations & interactions

- Scroll-triggered fade-in + slide-up via the `<Reveal>` component (uses Intersection Observer).
- Duration: 1.2s, ease-out cubic-bezier.
- Hover effects on cards: subtle elevation and shadow.
- No aggressive or distracting animations — keep it book-like and calm.

---

## Image guidelines

- Photos should be real: harvest, defibration, washing, drying, carding, spinning, weaving.
- Images should have slightly organic/rounded borders (not perfect rectangles).
- Use `object-cover` for consistent aspect ratios.

---

## File structure conventions

```
src/
  components/     # Reusable UI (Header, Footer, Reveal, Button, SectionTitle,
                  #   IconCircle, PageHeader, LegalDocument, SocialLinks)
    admin/        # Admin-only UI (MediaPicker)
  pages/          # Public routes (Home, Artesanos, TallerFique, Contacto,
                  #   Terminos, Privacidad, NotFound) — filenames match PageKey
    admin/        # Admin routes (Login, AdminArtesanos, AdminMensajes, AdminArchivos)
  layouts/        # MainLayout (public) and AdminLayout
  hooks/          # useScrollReveal, useArtesanos, useAdminAuth, useDocumentHead
  i18n/           # routes.ts (URL map), config.ts, LanguageProvider, languageContext
  locales/        # es/translation.json, en/translation.json — full key parity required
  content/        # company.ts, images.ts, legal.ts, faq.ts, artesanos.generated.json
  seo/            # meta.ts (head builder), jsonld.ts (structured data)
  services/       # Firestore/Storage access, split public vs admin
  types/          # Shared content types
  firebase.ts     # App + Firestore + App Check (public)
  firebaseAdmin.ts# Auth + Storage (admin chunk only)
  entry-server.tsx# SSR entry used by the prerender step
scripts/          # fetch-content.mjs, prerender.mjs
```

- One component per file.
- CSS: `src/index.css` for Tailwind import and custom theme tokens; component-specific styles via Tailwind utility classes.

---

## Routing and languages

- The site is bilingual. **Spanish sits at the root, English under `/en/` with English
  slugs**: `/artesanos` ↔ `/en/artisans`, `/taller-fique` ↔ `/en/fique-workshop`,
  `/contacto` ↔ `/en/contact`, `/terminos` ↔ `/en/terms`, `/privacidad` ↔ `/en/privacy`.
- **`src/i18n/routes.ts` is the single source of truth for URLs.** The router, the language
  switcher, the sitemap and the SEO manifest are all generated from it. Never hardcode a
  path — use `useLanguage().path(page)`.
- `/acerca-de` is retired and redirects to `/artesanos`.
- `<BrowserRouter basename={import.meta.env.BASE_URL}>` in `main.tsx` — the site is deployed
  under the `/aratoca-en-hilos/` sub-path, so the basename is mandatory.
- `main.tsx` hydrates when the root already has prerendered content and renders fresh
  otherwise, so both `vite dev` and the static build work.
- Header navigation is fixed at top, `bg-cream/90` or transparent depending on scroll, and
  carries the ES/EN switcher. **The admin panel is never linked from it.**

## Internationalisation

- All user-facing copy lives in `src/locales/{es,en}/translation.json`. No hardcoded
  Spanish or English in `src/pages` or `src/components`.
- The two locale files must keep **exact key parity**.
- The admin panel under `pages/admin` is deliberately Spanish-only and exempt.
- The active language comes from the URL only — never from `localStorage` or `navigator`,
  which would make the prerendered output non-deterministic.

---

## Reusable components

| Component | File | Props | Description |
|---|---|---|---|
| **Header** | `src/components/Header.tsx` | none | Fixed top nav, scroll-aware, mobile hamburger menu |
| **Footer** | `src/components/Footer.tsx` | none | Site footer with links to all pages |
| **Reveal** | `src/components/Reveal.tsx` | `children`, `delay?`, `direction?`, `className?` | Scroll-triggered fade-in + slide-up |
| **Button** | `src/components/Button.tsx` | `variant?`, `children`, `href?`, `to?`, `onClick?` | Styled button with primary/secondary/outline/ghost variants |
| **SectionTitle** | `src/components/SectionTitle.tsx` | `title`, `subtitle?`, `accent?`, `align?` | Consistent section heading pattern |
| **IconCircle** | `src/components/IconCircle.tsx` | `icon`, `color`, `size?` | Circular icon container |
| **PageHeader** | `src/components/PageHeader.tsx` | `accent?`, `title`, `intro?`, `note?` | Top-of-page band; reserves the space the fixed header needs |
| **LegalDocument** | `src/components/LegalDocument.tsx` | `namespace`, `sections`, `values`, `updated`, `intro` | Renders Términos and Privacidad from translation keys |
| **SocialLinks** | `src/components/SocialLinks.tsx` | `className?` | Social icons; renders nothing until URLs are configured |

---

## Development workflow

- Run `npm run dev` for local development (served under `/aratoca-en-hilos/`).
- TypeScript strict mode is enabled.
- ESLint with the project's config for code quality.
- Before committing, ensure no TypeScript errors and the app builds with `npm run build`.

## Prerendering and SEO

- `npm run build` renders every route to static HTML. **Anything that must be indexed has to
  render without JavaScript** — most AI crawlers do not execute it.
- Collapsible content must keep its text in the DOM. The Taller Fique FAQ uses native
  `<details>`/`<summary>` for exactly this reason.
- Per-page metadata lives in the `seo.*` translation keys; `src/seo/meta.ts` turns it into
  head tags for both the static build and client-side navigation.
- Anything rendered during hydration must be deterministic — no `Date.now()`, no random
  values, no browser-only reads during render, or hydration will mismatch.

## Firebase boundaries

- All Firebase calls are made from the browser. **The security rules in `firestore.rules`
  and `storage.rules` are the real access control**, not the UI checks.
- `src/firebase.ts` (App + Firestore + App Check) is public. `src/firebaseAdmin.ts`
  (Auth + Storage) may only be imported from `pages/admin`, `components/admin`, or
  admin-only services — importing it elsewhere drags ~35 kB gzipped into the public bundle.
- Firestore is loaded via dynamic `import()` on the public side so it stays out of the
  bundle that blocks first paint.