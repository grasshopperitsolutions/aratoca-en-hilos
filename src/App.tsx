import { Suspense, createElement, lazy, type ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import { LanguageProvider } from './i18n/LanguageProvider';
import {
  LANGUAGES,
  PAGE_KEYS,
  buildPath,
  pageKeyDeCapitulo,
  type LibroCapituloKey,
  type PageKey,
} from './i18n/routes';
// Aliased: `LibroCapitulo` is also the name of the page component below.
import { LIBRO_CAPITULOS, type LibroCapitulo as NumeroCapitulo } from './types/libro';

import Home from './pages/Home';
import Artesanos from './pages/Artesanos';
import TallerFique from './pages/TallerFique';
import Libro from './pages/Libro';
import LibroCapitulo from './pages/LibroCapitulo';
import Contacto from './pages/Contacto';
import Terminos from './pages/Terminos';
import Privacidad from './pages/Privacidad';
import NotFound from './pages/NotFound';

// The admin panel is loaded on demand. It is the only part of the app that
// needs Firebase Auth and Storage, and splitting it keeps roughly half of the
// Firebase SDK out of the bundle every public visitor downloads.
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminArtesanos = lazy(() => import('./pages/admin/AdminArtesanos'));
const AdminMensajes = lazy(() => import('./pages/admin/AdminMensajes'));
const AdminArchivos = lazy(() => import('./pages/admin/AdminArchivos'));
const AdminAdministradores = lazy(() => import('./pages/admin/AdminAdministradores'));
const Registro = lazy(() => import('./pages/admin/Registro'));

/**
 * Every chapter renders the same component, bound to its number. Built here
 * rather than as seven files so adding a chapter stays a single edit in
 * `types/libro.ts`.
 */
function capituloPage(numero: NumeroCapitulo): ComponentType {
  const Page = () => <LibroCapitulo numero={numero} />;
  Page.displayName = `LibroCapitulo${numero}`;
  return Page;
}

const CAPITULO_PAGES = Object.fromEntries(
  LIBRO_CAPITULOS.map((numero) => [pageKeyDeCapitulo(numero), capituloPage(numero)]),
) as Record<LibroCapituloKey, ComponentType>;

const PAGES: Record<PageKey, ComponentType> = {
  home: Home,
  artesanos: Artesanos,
  tallerFique: TallerFique,
  libro: Libro,
  ...CAPITULO_PAGES,
  contacto: Contacto,
  terminos: Terminos,
  privacidad: Privacidad,
};

function AdminLoading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <p className="text-stone uppercase tracking-widest text-sm">Cargando…</p>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route element={<MainLayout />}>
          {/* One route per page per language, generated from the shared slug map
              in src/i18n/routes.ts so the router, the language switcher and the
              SEO manifest can never disagree about a URL. */}
          {LANGUAGES.flatMap((language) =>
            PAGE_KEYS.map((page) => (
              <Route
                key={`${language}:${page}`}
                path={buildPath(page, language)}
                element={createElement(PAGES[page])}
              />
            )),
          )}

          {/* Retired route: the About page was replaced by Artesanos. */}
          <Route path="/acerca-de" element={<Navigate to={buildPath('artesanos', 'es')} replace />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Invitation acceptance. Sits OUTSIDE AdminLayout because the visitor
            is not an admin yet — the layout's gate would bounce them to the
            login form. The token in the URL is the credential. */}
        <Route
          path="/admin/registro"
          element={
            <Suspense fallback={<AdminLoading />}>
              <Registro />
            </Suspense>
          }
        />

        {/* Admin: deliberately absent from the header, footer, sitemap and
            prerender manifest — reachable only by typing the URL. */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<Navigate to="/admin/artesanos" replace />} />
          <Route path="artesanos" element={<AdminArtesanos />} />
          <Route path="mensajes" element={<AdminMensajes />} />
          <Route path="archivos" element={<AdminArchivos />} />
          <Route path="administradores" element={<AdminAdministradores />} />
        </Route>
      </Routes>
    </LanguageProvider>
  );
}
