/**
 * Pulling latitude and longitude out of a Google Maps link.
 *
 * The admin form already asks for a Maps URL, so when that URL happens to carry
 * coordinates there is no reason to make anyone type them again. This is a
 * convenience only: a short link (maps.app.goo.gl) carries nothing to read, and
 * resolving it would need a network round trip this project has deliberately
 * avoided — so the two fields stay editable and this just pre-fills them.
 */

/** Aratoca's town square. Where the map centres when nobody has a pin yet. */
export const CENTRO_ARATOCA = { lat: 6.694, lng: -73.018 } as const;

export interface Coordenadas {
  lat: number;
  lng: number;
}

/** Latitude and longitude that actually describe a point on Earth. */
export function sonValidas(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    // 0,0 is in the Atlantic and is what an empty pair of fields parses to.
    !(lat === 0 && lng === 0)
  );
}

/**
 * The three shapes a Google Maps URL uses for a point, in the order they are
 * worth trusting:
 *
 * - `!3d<lat>!4d<lng>` — the place's own coordinates, in the data blob.
 * - `@<lat>,<lng>,<zoom>z` — where the camera sits, which for a shared place
 *   link is the place.
 * - `?q=<lat>,<lng>` / `?ll=` / `?daddr=` — an explicit query.
 */
const PATRONES: readonly RegExp[] = [
  /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
  /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
  /[?&](?:q|ll|daddr|destination)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
];

/** Coordinates read from a Maps URL, or null when it carries none. */
export function coordenadasDesdeUrl(url: string): Coordenadas | null {
  const texto = url.trim();
  if (!texto) return null;

  for (const patron of PATRONES) {
    const encontrado = patron.exec(texto);
    if (!encontrado) continue;
    const lat = Number(encontrado[1]);
    const lng = Number(encontrado[2]);
    if (sonValidas(lat, lng)) return { lat, lng };
  }
  return null;
}
