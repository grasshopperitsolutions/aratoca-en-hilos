import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CENTRO_ARATOCA, sonValidas } from '../services/coordenadas';
import { useLanguage } from '../i18n/languageContext';
import { localised, type Artesano } from '../types/content';

import 'leaflet/dist/leaflet.css';

/**
 * Where the artisans are, on a map of Aratoca.
 *
 * Leaflet over OpenStreetMap: no API key, no billing account and nothing to
 * keep secret, which matters in a project that calls Firebase straight from the
 * browser and has no server of its own to hide a key behind.
 *
 * Leaflet is loaded with a dynamic import, for two reasons: it touches `window`
 * at module scope and would break the prerender outright, and it is far too
 * heavy to sit in the first-paint bundle of a page whose real content is the
 * artisan list below.
 */

/** The site mark, reused as the pin. Inlined so it needs no extra request. */
const PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 78" width="34" height="42">
  <path d="M32 77C32 77 60 47 60 30A28 28 0 1 0 4 30C4 47 32 77 32 77Z"
        fill="#F7F2E9" stroke="#4C7A3D" stroke-width="3"/>
  <g transform="translate(16 12) scale(0.5)">
    <path d="M32 52 C 18 44, 11 30, 13 14 C 25 20, 31 33, 32 52 Z" fill="#4C7A3D"/>
    <path d="M32 52 C 46 44, 53 30, 51 14 C 39 20, 33 33, 32 52 Z" fill="#8FA878"/>
    <path d="M32 52 C 28 38, 28 24, 32 8 C 36 24, 36 38, 32 52 Z" fill="#6B4226"/>
  </g>
</svg>`;

/** Escapes text going into a Leaflet popup, which takes an HTML string. */
function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function MapaArtesanos({ artesanos }: { artesanos: Artesano[] }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const contenedor = useRef<HTMLDivElement | null>(null);
  const [listo, setListo] = useState(false);

  // Only those with a usable pair; the rest are simply not on the map.
  const situados = useMemo(
    () =>
      artesanos.filter(
        (artesano) =>
          artesano.lat !== null && artesano.lng !== null && sonValidas(artesano.lat, artesano.lng),
      ),
    [artesanos],
  );

  useEffect(() => {
    if (!contenedor.current || situados.length === 0) return;

    let mapa: import('leaflet').Map | null = null;
    let cancelado = false;

    void import('leaflet')
      .then((L) => {
        if (cancelado || !contenedor.current) return;

        mapa = L.map(contenedor.current, {
          // The map is decoration around a list, not the way the page is read.
          // Letting it swallow the wheel would trap anyone scrolling past it.
          scrollWheelZoom: false,
          attributionControl: true,
          // A view must exist before any layer is added; the pins replace it
          // immediately, but Leaflet throws without one.
          center: [CENTRO_ARATOCA.lat, CENTRO_ARATOCA.lng],
          zoom: 13,
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap',
        }).addTo(mapa);

        const icono = L.divIcon({
          html: PIN_SVG,
          className: 'mapa-artesanos__pin',
          iconSize: [34, 42],
          // Anchored at the point of the pin, not its middle.
          iconAnchor: [17, 42],
          popupAnchor: [0, -38],
        });

        const marcadores = situados.map((artesano) => {
          const oficio = localised(artesano.oficio, language);
          const marcador = L.marker([artesano.lat as number, artesano.lng as number], {
            icon: icono,
            title: artesano.nombre,
            alt: artesano.nombre,
            keyboard: true,
          }).addTo(mapa as import('leaflet').Map);

          marcador.bindPopup(
            `<div class="mapa-artesanos__ficha">
               ${
                 artesano.fotoUrl
                   ? `<img src="${escapar(artesano.fotoUrl)}" alt="" loading="lazy" />`
                   : ''
               }
               <div>
                 <p class="mapa-artesanos__nombre">${escapar(artesano.nombre)}</p>
                 ${oficio ? `<p class="mapa-artesanos__oficio">${escapar(oficio)}</p>` : ''}
                 <a href="#artesano-${escapar(artesano.id)}">${escapar(t('artesanos.verFicha'))}</a>
               </div>
             </div>`,
            { closeButton: true },
          );

          // Hover opens it, as asked; click still works, and so does keyboard
          // focus — which hover alone would leave out.
          marcador.on('mouseover', () => marcador.openPopup());
          marcador.on('focus', () => marcador.openPopup());

          return marcador;
        });

        // Frame every pin. A single artisan has no bounds worth fitting, so it
        // gets a sensible street-level zoom instead.
        if (marcadores.length === 1) {
          mapa.setView(marcadores[0].getLatLng(), 15);
        } else {
          mapa.fitBounds(L.featureGroup(marcadores).getBounds(), { padding: [42, 42] });
        }

        setListo(true);
      })
      .catch((caught: Error) => {
        console.warn('[artesanos] map unavailable:', caught.message);
      });

    return () => {
      cancelado = true;
      mapa?.remove();
    };
  }, [situados, language, t]);

  // Nothing to plot yet: the client has not added coordinates to anyone. An
  // empty grey rectangle would read as a bug, so the section simply is not there.
  if (situados.length === 0) return null;

  return (
    <section className="px-6 md:px-12 pb-4" aria-labelledby="mapa-artesanos-titulo">
      <div className="max-w-6xl mx-auto">
        <h2 id="mapa-artesanos-titulo" className="sr-only">
          {t('artesanos.mapaTitulo')}
        </h2>
        <div className="relative rounded-tl-[3rem] rounded-br-[3rem] overflow-hidden border border-stone/25">
          <div
            ref={contenedor}
            className="h-[320px] md:h-[440px] w-full bg-fique/40"
            role="application"
            aria-label={t('artesanos.mapaTitulo')}
          />
          {!listo && (
            <p className="absolute inset-0 flex items-center justify-center text-stone text-sm pointer-events-none">
              {t('artesanos.mapaCargando')}
            </p>
          )}
        </div>
        <p className="text-stone text-xs mt-3">{t('artesanos.mapaPie')}</p>
      </div>
    </section>
  );
}
