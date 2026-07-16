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
  components/     # Reusable UI components (Header, Footer, Reveal, Button, SectionTitle, IconCircle)
  pages/          # Route-level pages (Home, About, TallerFique, Terms, Privacy, Contact)
  layouts/        # Layout wrappers (MainLayout)
  hooks/          # Custom hooks (useScrollReveal)
  assets/         # Images, icons
```

- One component per file.
- CSS: `src/index.css` for Tailwind import and custom theme tokens; component-specific styles via Tailwind utility classes.

---

## Routing

- Pages: `/` (Home), `/acerca-de` (About), `/taller-fique` (Workshop), `/terminos` (Terms), `/privacidad` (Privacy), `/contacto` (Contact).
- Uses `react-router-dom` for client-side routing with `<BrowserRouter>` in `main.tsx`.
- Header navigation is fixed at top, background `bg-cream/90` or transparent depending on scroll position.

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

---

## Development workflow

- Run `npm run dev` for local development.
- TypeScript strict mode enabled.
- ESLint with the project's config for code quality.
- Before committing, ensure no TypeScript errors and the app builds with `npm run build`.